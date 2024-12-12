export type AuthScope =
  | "tasks:read"
  | "tasks:write"
  | "projects:read"
  | "projects:write";

export type ViewMode = "list" | "kanban" | "timeline";

export type Kind = "TASK" | "NOTE";

export interface UserInfo {
  name: string;
  avatarUrl?: string;
}

export interface Task {
  projectId: string;
  title: string;
  id: string;
  isAllDay?: boolean;
  completedTime?: string; // date-time in "yyyy-MM-dd'T'HH:mm:ssZ" format
  content?: string;
  desc?: string; // Task description of checklist
  dueDate?: string; // date-time in "yyyy-MM-dd'T'HH:mm:ssZ" format
  items?: ChecklistItem[]; // Subtasks of Task
  priority?: number; // integer (int32) - Values: None:0, Low:1, Medium:3, High:5
  reminders?: string[]; // List of reminder triggers
  repeatFlag?: string; // Recurring rules of task
  sortOrder?: number; // integer (int64)
  startDate?: string; // date-time in "yyyy-MM-dd'T'HH:mm:ssZ" format
  status?: number; // integer (int32) - Values: Normal: 0, Completed: 2
  timeZone?: string; // Task timezone
}

export interface ChecklistItem {
  id: string;
  title: string;
  status?: number; // integer (int32) - Values: Normal: 0, Completed: 1
  completedTime?: string; // date-time in "yyyy-MM-dd'T'HH:mm:ssZ" format
  isAllDay?: boolean;
  sortOrder?: number; // integer (int64)
  startDate?: string; // date-time in "yyyy-MM-dd'T'HH:mm:ssZ" format
  timeZone?: string;
}

export interface Column {
  id: string;
  projectId: string;
  name?: string;
  sortOrder?: number;
}

export interface Project {
  id: string;
  name: string;
  color?: string;
  closed?: boolean;
  groupId?: string;
  viewMode?: ViewMode;
  permission?: string;
  kind?: Kind;
}

export interface ProjectData {
  project: Project;
  tasks: Task[];
  columns: Column[];
}

export interface CreateProjectArg {
  name: string;
  color?: string;
  sortOrder?: number;
  viewMode?: ViewMode;
  kind?: Kind;
}

export type UpdateProjectArg = Partial<CreateProjectArg>;

export type CreateTaskArg = Omit<Task, "projectId">;
