"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickTickNode = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
const utils_1 = require("./utils");
class TickTickNode {
    constructor(clientId, clientSecret) {
        this.scopes = [];
        this.redirectUri = "";
        this.token = null;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.axiosInstance = axios_1.default.create();
    }
    auth({ scopes, redirectUri, state }) {
        this.scopes = scopes;
        this.redirectUri = redirectUri;
        return (0, utils_1.buildUrl)(`${constants_1.TICKTICK_AUTH_URL}`, Object.assign({ client_id: this.clientId, scope: scopes.join(" "), redirect_uri: redirectUri, response_type: "code" }, (state ? { state } : {})));
    }
    async exchangeCode(code) {
        try {
            const response = await axios_1.default.post(constants_1.TICKTICK_TOKEN_URL, {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code,
                grant_type: "authorization_code",
                scope: this.scopes,
                redirect_uri: this.redirectUri,
            }, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            const data = response.data;
            this.token = data.access_token;
            this.axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
            return data;
        }
        catch (error) {
            console.error("Error exchanging code for token:", error);
            throw error;
        }
    }
    async callTickTickAppApi(endpoint, method, config) {
        if (!this.token) {
            throw new Error("No token available. Please authenticate first.");
        }
        const response = await this.axiosInstance(Object.assign(Object.assign({}, config), { url: `${constants_1.TICKTICK_API_BASE_URL}/${endpoint}`, params: config === null || config === void 0 ? void 0 : config.params, method }));
        return response.data;
    }
    async fetchUserInfo() {
        const user = (await this.callTickTickAppApi("/user/info", "GET"));
        return user;
    }
    async fetchProjects() {
        const projects = (await this.callTickTickAppApi("/project", "GET"));
        return projects;
    }
    async fetchProjectById(projectId) {
        const project = (await this.callTickTickAppApi(`/project/${projectId}`, "GET"));
        return project;
    }
    async fetchProjectWithTasks(projectId) {
        const project = (await this.callTickTickAppApi(`/project/${projectId}/data`, "GET"));
        return project;
    }
    async createProject(project) {
        const newProject = (await this.callTickTickAppApi("/project", "POST", {
            data: project,
        }));
        return newProject;
    }
    async updateProject(projectId, newProject) {
        const updatedProject = (await this.callTickTickAppApi("/project/" + projectId, "POST", { data: newProject }));
        return updatedProject;
    }
    async deleteProject(projectId) {
        await this.callTickTickAppApi(`/project/${projectId}`, "DELETE");
        return { success: true };
    }
    async fetchTaskById(projectId, taskId) {
        const task = (await this.callTickTickAppApi(`/project/${projectId}/task/${taskId}`, "GET"));
        return task;
    }
    async createTask(newTask) {
        const task = (await this.callTickTickAppApi("/task", "POST", {
            data: newTask,
        }));
        return task;
    }
    async updateTask(taskId, newTask) {
        const updatedTask = (await this.callTickTickAppApi(`/task/${taskId}`, "POST", { data: newTask }));
        return updatedTask;
    }
    async completeTask(projectId, taskId) {
        await this.callTickTickAppApi(`/project/${projectId}/task/${taskId}/complete`, "POST");
        return { success: true };
    }
    async deleteTask(projectId, taskId) {
        await this.callTickTickAppApi(`/project/${projectId}/task/${taskId}`, "DELETE");
        return {
            success: true,
        };
    }
}
exports.TickTickNode = TickTickNode;
__exportStar(require("./types"), exports);
