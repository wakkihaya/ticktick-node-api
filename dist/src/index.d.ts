import { AuthScope, CreateProjectArg, CreateTaskArg, Project, ProjectData, Task, UpdateProjectArg, UserInfo } from "./types";
interface AuthParam {
    scopes: AuthScope[];
    redirectUri: string;
    state?: object;
}
interface ExchangeCodeRes {
    access_token: string;
}
export declare class TickTickNode {
    private clientId;
    private clientSecret;
    private scopes;
    private redirectUri;
    private token;
    private axiosInstance;
    constructor(clientId: string, clientSecret: string);
    auth({ scopes, redirectUri, state }: AuthParam): string;
    exchangeCode(code: string): Promise<ExchangeCodeRes>;
    private callTickTickAppApi;
    fetchUserInfo(): Promise<UserInfo>;
    fetchProjects(): Promise<Project[]>;
    fetchProjectById(projectId: string): Promise<Project>;
    fetchProjectWithTasks(projectId: string): Promise<ProjectData>;
    createProject(project: CreateProjectArg): Promise<Project>;
    updateProject(projectId: string, newProject: UpdateProjectArg): Promise<Project>;
    deleteProject(projectId: string): Promise<{
        success: boolean;
    }>;
    fetchTaskById(projectId: string, taskId: string): Promise<Task>;
    createTask(newTask: CreateTaskArg): Promise<Task>;
    updateTask(taskId: string, newTask: Task): Promise<Task>;
    completeTask(projectId: string, taskId: string): Promise<{
        success: boolean;
    }>;
    deleteTask(projectId: string, taskId: string): Promise<{
        success: boolean;
    }>;
}
export * from "./types";
