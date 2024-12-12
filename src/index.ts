import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  TICKTICK_API_BASE_URL,
  TICKTICK_AUTH_URL,
  TICKTICK_TOKEN_URL,
} from "./constants";
import {
  AuthScope,
  CreateProjectArg,
  CreateTaskArg,
  Project,
  ProjectData,
  Task,
  UpdateProjectArg,
  UserInfo,
} from "./types";
import { buildUrl } from "./utils";

interface AuthParam {
  scopes: AuthScope[];
  redirectUri: string;
  state?: object;
}

interface ExchangeCodeRes {
  access_token: string;
}

export class TickTickNode {
  private clientId: string;
  private clientSecret: string;
  private scopes: AuthScope[] = [];
  private redirectUri: string = "";
  private token: string | null = null;
  private axiosInstance: AxiosInstance;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.axiosInstance = axios.create();
  }

  public auth({ scopes, redirectUri, state }: AuthParam): string {
    this.scopes = scopes;
    this.redirectUri = redirectUri;

    return buildUrl(`${TICKTICK_AUTH_URL}`, {
      client_id: this.clientId,
      scope: scopes.join(" "),
      redirect_uri: redirectUri,
      response_type: "code",
      ...(state ? { state } : {}),
    });
  }

  public async exchangeCode(code: string) {
    try {
      const response = await axios.post(
        TICKTICK_TOKEN_URL,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          grant_type: "authorization_code",
          scope: this.scopes,
          redirect_uri: this.redirectUri,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const data = response.data as ExchangeCodeRes;
      this.token = data.access_token;
      this.axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${this.token}`;

      return data;
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      throw error;
    }
  }

  private async callTickTickAppApi(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    config?: AxiosRequestConfig
  ) {
    if (!this.token) {
      throw new Error("No token available. Please authenticate first.");
    }

    const response = await this.axiosInstance({
      ...config,
      url: `${TICKTICK_API_BASE_URL}/${endpoint}`,
      params: config?.params,
      method,
    });

    return response.data;
  }

  public async fetchUserInfo() {
    const user = (await this.callTickTickAppApi(
      "/user/info",
      "GET"
    )) as UserInfo;
    return user;
  }

  public async fetchProjects() {
    const projects = (await this.callTickTickAppApi(
      "/project",
      "GET"
    )) as Project[];
    return projects;
  }

  public async fetchProjectById(projectId: string) {
    const project = (await this.callTickTickAppApi(
      `/project/${projectId}`,
      "GET"
    )) as Project;
    return project;
  }

  public async fetchProjectWithTasks(projectId: string) {
    const project = (await this.callTickTickAppApi(
      `/project/${projectId}/data`,
      "GET"
    )) as ProjectData;
    return project;
  }

  public async createProject(project: CreateProjectArg) {
    const newProject = (await this.callTickTickAppApi("/project", "POST", {
      data: project,
    })) as Project;
    return newProject;
  }

  public async updateProject(projectId: string, newProject: UpdateProjectArg) {
    const updatedProject = (await this.callTickTickAppApi(
      "/project/" + projectId,
      "POST",
      { data: newProject }
    )) as Project;

    return updatedProject;
  }

  public async deleteProject(projectId: string) {
    await this.callTickTickAppApi(`/project/${projectId}`, "DELETE");
    return { success: true };
  }

  public async fetchTaskById(projectId: string, taskId: string) {
    const task = (await this.callTickTickAppApi(
      `/project/${projectId}/task/${taskId}`,
      "GET"
    )) as Task;
    return task;
  }

  public async createTask(newTask: CreateTaskArg) {
    const task = (await this.callTickTickAppApi("/task", "POST", {
      data: newTask,
    })) as Task;
    return task;
  }

  public async updateTask(taskId: string, newTask: Task) {
    const updatedTask = (await this.callTickTickAppApi(
      `/task/${taskId}`,
      "POST",
      { data: newTask }
    )) as Task;
    return updatedTask;
  }

  public async completeTask(projectId: string, taskId: string) {
    await this.callTickTickAppApi(
      `/project/${projectId}/task/${taskId}/complete`,
      "POST"
    );
    return { success: true };
  }

  public async deleteTask(projectId: string, taskId: string) {
    await this.callTickTickAppApi(
      `/project/${projectId}/task/${taskId}`,
      "DELETE"
    );
    return {
      success: true,
    };
  }
}

export * from "./types";
