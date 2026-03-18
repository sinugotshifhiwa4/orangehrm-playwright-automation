import type { TestInfo } from "@playwright/test";
import type { AuthRole } from "../authentication/storage/internal/authentication.constants.js";
import ErrorHandler from "../../utils/errorHandling/errorHandler.js";

/**
 * Mapping of project names to AuthUserRoles.
 */
const PROJECT_ROLE_MAP: Record<string, AuthRole> = {
  "setup-admin-user": "ADMIN",
  "setup-general-user": "GENERAL",
  "admin-user": "ADMIN",
  "general-user": "GENERAL",
};

/**
 * Resolves the AuthRole corresponding with a given TestInfo object based on the project name.
 * @param testInfo - The TestInfo object containing the project name
 * @returns The AuthRole associated with the project name
 * @throws Error - If no AuthRole is mapped for the given project name
 */
export function resolveRoleFromProject(testInfo: TestInfo): AuthRole {
  const role = PROJECT_ROLE_MAP[testInfo.project.name];

  if (!role) {
    ErrorHandler.logAndThrow(
      "resolveRoleFromProject",
      `No role mapped for project: "${testInfo.project.name}". Expected one of: ${Object.keys(PROJECT_ROLE_MAP).join(", ")}`,
    );
  }

  return role;
}
