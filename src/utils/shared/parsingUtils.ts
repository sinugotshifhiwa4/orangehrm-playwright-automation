import ErrorHandler from "../errorHandling/errorHandler.js";

export default class ParsingUtils {
  /**
   * Normalizes a string by replacing non-breaking spaces with regular spaces, collapsing multiple whitespace characters into a single space, and trimming leading and trailing whitespace.
   * @param {string} value - The string to normalize.
   * @returns {string} The normalized string.
   */
  public static normaliseString(this: void, value: string): string {
    return ParsingUtils.normalise(value);
  }

  /**
   * Parses a string by normalizing it (replacing non-breaking spaces with regular spaces, collapsing multiple whitespace characters into a single space, and trimming leading and trailing whitespace).
   * @param {string} value - The string to parse.
   * @returns {string} The parsed string.
   */
  public static parseString(this: void, value: string): string {
    return ParsingUtils.normalise(value);
  }

  /**
   * Parses a string to a number by removing all non-breaking spaces and commas.
   * @param {string} value - The string to parse.
   * @returns {number} The parsed number.
   */
  public static parseNumber(this: void, value: string): number {
    return Number(ParsingUtils.baseNumeric(value));
  }

  /**
   * Parses a string to a number by extracting the leading numeric value.
   * If no match is found, returns 0.
   * @param {string} value - The string to parse.
   * @returns {number} The parsed number, or 0 if no match is found.
   */
  public static parseLeadingNumber(this: void, value: string): number {
    const match = ParsingUtils.normalise(value).match(/[\d,]+/);
    return match ? Number(ParsingUtils.stripCommas(match[0])) : 0;
  }

  /**
   * Parses a string percentage value to a number.
   * The function removes all commas, whitespace and the percentage sign from the given string before parsing it to a number.
   * @param {string} value - The string percentage value to parse.
   * @returns {number} The parsed number value.
   */
  public static parsePercentage(this: void, value: string): number {
    return Number(ParsingUtils.baseNumeric(value).replace("%", "").trim());
  }

  /**
   * Parses a string currency value to a number.
   * The function removes all non-numeric characters (except for decimal points and minus signs) from the given string before parsing it to a number.
   * @param {string} value - The string currency value to parse.
   * @returns {number} The parsed number value.
   */
  public static parseCurrency(this: void, value: string): number {
    return Number(ParsingUtils.baseNumeric(value).replace(/[^\d.-]/g, ""));
  }

  /**
   * Parses a string CBM value to a number.
   * If the value is empty, returns 0.
   * The function removes all non-breaking spaces and commas, and matches the value against a regular expression to extract the leading numeric value.
   * If a match is found, the function returns the parsed number; otherwise, it returns 0.
   * @param {string} value - The string CBM value to parse.
   * @returns {number} The parsed number value.
   */
  public static parseCbm(this: void, value: string): number {
    if (!value) return 0;
    const match = ParsingUtils.baseNumeric(value).match(/^(\d+(?:\.\d+)?)/);
    return match ? Number(match[1]) : 0;
  }

  /**
   * Parses an array of string numbers to an array of numbers.
   * The function uses the parseNumber function to parse each string value in the array.
   * @param {string[]} values - The array of string numbers to parse.
   * @returns {number[]} The parsed number array.
   */
  public static parseToNumbers(this: void, values: string[]): number[] {
    return values.map(ParsingUtils.parseNumber);
  }

  /**
   * Parses an array of string currency values to an array of numbers.
   * The function uses the parseCurrency function to parse each string value in the array.
   * @param {string[]} values - The array of string currency values to parse.
   * @returns {number[]} The parsed number array.
   */
  public static parseCurrencyArray(this: void, values: string[]): number[] {
    return values.map(ParsingUtils.parseCurrency);
  }

  /**
   * Sums an array of numbers.
   * @param {number[]} values - The array of numbers to sum.
   * @returns {number} The sum of the numbers in the array.
   */
  public static sumNumbers(this: void, values: number[]): number {
    return values.reduce((sum, n) => sum + n, 0);
  }

  /**
   * Calculates the sum of an array of cell values representing CBM values.
   * The cell values are first normalized by removing any whitespace and currency symbols,
   * and then parsed to a number. The resulting numbers are then summed and rounded to 3
   * decimal places.
   * @param cellValues - An array of cell values as strings.
   * @returns The sum of the cell values as a number.
   */
  public static calculateCbmSum(this: void, cellValues: string[]): number {
    return Number(
      ParsingUtils.sumNumbers(cellValues.map(ParsingUtils.parseCbm)).toFixed(3),
    );
  }

  /**
   * Rounds a given number to two decimal places.
   * @param {number} value - The number to round.
   * @returns {number} The rounded number.
   */
  public static roundToTwoDecimals(this: void, value: number): number {
    return Number(value.toFixed(2));
  }

  /**
   * Asserts that the given value is a valid number.
   * Throws an error if the value is not a number or is NaN.
   * @param value The value to check.
   * @param fieldName The name of the field being checked.
   * @param context The context in which the field is being checked.
   */
  public static assertValidNumber(
    this: void,
    value: unknown,
    fieldName: string,
    context: string,
  ): asserts value is number {
    if (typeof value !== "number" || Number.isNaN(value)) {
      ErrorHandler.logAndThrow(
        "assertValidNumber",
        `${fieldName} must be a valid number for "${context}".`,
      );
    }
  }

  /**
   * Checks whether a string represents a valid date in format: dd MMM yyyy (e.g. 24 Feb 2026).
   * @param value - The string to validate.
   * @returns true if valid, otherwise false.
   */
  public static isValidDate(this: void, value: string): boolean {
    return ParsingUtils.parseDate(value) !== null;
  }

  /**
   * Parses a string to a Date object in the format "dd MMM yyyy".
   * If the string is not in the correct format, or if the date is invalid, returns null.
   * @param value - The string to parse.
   * @returns {Date | null} The parsed date, or null if the string is invalid.
   */
  private static parseDate(this: void, value: string): Date | null {
    const normalised = ParsingUtils.normalise(value);
    if (!normalised) return null;

    const match = normalised.match(/^(\d{1,2})\s([A-Za-z]{3})\s(\d{4})$/);
    if (!match) return null;

    const [, dayStr, monthStr, yearStr] = match;

    const months: Record<string, number> = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const monthIndex = months[monthStr];
    if (monthIndex === undefined) return null;

    const day = Number(dayStr);
    const year = Number(yearStr);

    const date = new Date(year, monthIndex, day);

    // strict validation (prevents 32 Feb 2026 from passing)
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== monthIndex ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }

  /**
   * Replaces non-breaking space characters (\\u00A0) with regular space characters.
   * @param {string} value - The string to replace non-breaking spaces in.
   * @returns {string} The string with all non-breaking spaces replaced with regular spaces.
   */
  private static replaceNbsp(value: string): string {
    return value.replace(/\u00A0/g, " ");
  }

  /**
   * Replaces all commas with empty strings.
   * @param {string} value - The string to strip commas from.
   * @returns {string} The string with all commas removed.
   */
  private static stripCommas(value: string): string {
    return value.replace(/,/g, "");
  }

  /**
   * Replaces non-breaking spaces with regular spaces, collapses multiple whitespace characters into a single space, and trims leading and trailing whitespace.
   * @param {string} value - The string to normalize.
   * @returns {string} The normalized string.
   */
  private static normalise(value: string): string {
    return ParsingUtils.replaceNbsp(value).replace(/\s+/g, " ").trim();
  }

  /**
   * Removes all whitespace and commas from a string, then normalizes it.
   * @param {string} value - The string to normalize and strip.
   * @returns {string} The normalized and stripped string.
   */
  private static baseNumeric(value: string): string {
    return ParsingUtils.stripCommas(ParsingUtils.normalise(value));
  }
}
