export type AuthScope = "tasks:read" | "tasks:write" | "projects:read" | "projects:write";
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
    completedTime?: string;
    content?: string;
    desc?: string;
    dueDate?: string;
    items?: ChecklistItem[];
    priority?: number;
    reminders?: string[];
    repeatFlag?: string;
    sortOrder?: number;
    startDate?: string;
    status?: number;
    timeZone?: string;
}
export interface ChecklistItem {
    id: string;
    title: string;
    status?: number;
    completedTime?: string;
    isAllDay?: boolean;
    sortOrder?: number;
    startDate?: string;
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
