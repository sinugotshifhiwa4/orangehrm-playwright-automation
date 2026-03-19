/**
 * Interface for Sidebar Menu Options
 */
export interface SidebarMenuOptions {
  state: "collapsed" | "expanded";
}

/**
 * Interface for About Dialog Label Options
 */
export interface AboutDialogLabelOptions {
  companyName?: string;
  version?: string;
  activeEmployees?: string;
  employeesTerminated?: string;
}

/**
 * Interface for About Dialog Values Options
 */
export interface AboutDialogValuesOptions {
  companyName?: string;
  version?: string;
  activeEmployees?: number;
  employeesTerminated?: number;
}
