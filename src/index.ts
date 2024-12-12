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

interface AuthParams {
  clientId: string;
  scopes: AuthScope[];
  redirectUri: string;
  state?: object;
}

interface ExchangeTokenParams {
  code: string;
  clientId: string;
  clientSecret: string;
  scopes: AuthScope[];
  redirectUri: string;
}

interface ExchangeCodeRes {
  access_token: string;
}

export const authTickTick = ({
  clientId,
  scopes,
  redirectUri,
  state,
}: AuthParams) => {
  return buildUrl(`${TICKTICK_AUTH_URL}`, {
    client_id: clientId,
    scope: encodeURIComponent(scopes.join(" ")),
    redirect_uri: redirectUri,
    response_type: "code",
    ...(state ? { state } : {}),
  });
};

export const exchangeToken = async ({
  code,
  clientId,
  clientSecret,
  scopes,
  redirectUri,
}: ExchangeTokenParams) => {
  const response = await axios.post(
    TICKTICK_TOKEN_URL,
    {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      scope: encodeURIComponent(scopes.join(" ")),
      redirect_uri: redirectUri,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const data = response.data as ExchangeCodeRes;
  return data;
};

export class TickTickNode {
  private token: string | null = null;
  private axiosInstance: AxiosInstance;

  constructor(token: string) {
    this.token = token;
    this.axiosInstance = axios.create({
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
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
