import * as os from "os";
import type { AllocatorType } from "./types/workerAllocator.type.js";
import ErrorHandler from "../../utils/errorHandling/errorHandler.js";

export default class WorkerAllocator {
  private static readonly totalCores = os.cpus().length;
  private static readonly MIN_WORKERS = 1;

  /**
   * Optimal worker count for the current environment.
   * Uses sharding in CI or the provided local strategy otherwise.
   */
  public static getOptimalWorkerCount(localStrategy: AllocatorType): number {
    return this.shardingEnabled
      ? this.getWorkersForCIShard()
      : this.getWorkersForLocalStrategy(localStrategy);
  }

  /**
   * Whether sharding is enabled for the current test run.
   */
  private static get shardingEnabled(): boolean {
    return !!(process.env.SHARD_INDEX && process.env.SHARD_TOTAL);
  }

  /**
   * Calculates the optimal worker count for the current CI shard based on the
   * shard configuration provided through environment variables.
   *
   * The function first validates the shard configuration by checking if the
   * SHARD_INDEX is between 1 and SHARD_TOTAL. It then calculates the base
   * workers per shard by dividing the total CPU cores by the shard total.
   * The remaining CPU cores are then distributed to the first shard.
   *
   * The function returns the maximum of the calculated workers for this shard
   * and the minimum allowed workers (1).
   *
   * @returns The optimal worker count for the current CI shard.
   */
  private static getWorkersForCIShard(): number {
    const shardTotal = parseInt(process.env.SHARD_TOTAL || "1", 10);
    const shardIndex = parseInt(process.env.SHARD_INDEX || "1", 10);

    // Validate shard configuration (1-indexed: shards go from 1 to shardTotal)
    if (shardIndex < 1 || shardIndex > shardTotal) {
      return ErrorHandler.logAndThrow(
        "WorkerAllocator",
        `Invalid shard config: SHARD_INDEX (${shardIndex}) must be between 1 and SHARD_TOTAL (${shardTotal}).`,
      );
    }

    if (shardTotal < 1) {
      return ErrorHandler.logAndThrow(
        "WorkerAllocator",
        `Invalid shard config: SHARD_TOTAL must be at least 1, got ${shardTotal}.`,
      );
    }

    // Calculate base workers per shard
    const baseWorkersPerShard = Math.floor(this.totalCores / shardTotal);
    const remainingCores = this.totalCores % shardTotal;

    // Convert to 0-indexed for calculation (subtract 1 from shardIndex)
    const zeroBasedIndex = shardIndex - 1;

    // Distribute remaining cores to first shards
    const workersForThisShard =
      zeroBasedIndex < remainingCores
        ? baseWorkersPerShard + 1
        : baseWorkersPerShard;

    return Math.max(this.MIN_WORKERS, workersForThisShard);
  }

  /**
   * Worker count for local development based on the given allocation strategy.
   */
  private static getWorkersForLocalStrategy(strategy: AllocatorType): number {
    switch (strategy) {
      case "all-cores":
        return this.totalCores;
      case "75-percent":
        return Math.max(this.MIN_WORKERS, Math.ceil(this.totalCores * 0.75));
      case "50-percent":
        return Math.max(this.MIN_WORKERS, Math.ceil(this.totalCores * 0.5));
      case "25-percent":
        return Math.max(this.MIN_WORKERS, Math.ceil(this.totalCores * 0.25));
      case "10-percent":
        return Math.max(this.MIN_WORKERS, Math.ceil(this.totalCores * 0.1));
      default:
        // Exhaustive check - this should never be reached
        const _exhaustive: never = strategy;
        return ErrorHandler.logAndThrow(
          "WorkerAllocator",
          `Unknown allocation strategy: ${strategy}. Valid strategies: all-cores, 75-percent, 50-percent, 25-percent, 10-percent.`,
        );
    }
  }
}
