"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
async function main() {
    const clientId = "your_client_id";
    const clientSecret = "your_client_secret";
    const ticktick = new src_1.TickTickNode(clientId, clientSecret);
    // AUTH ====
    const authUrl = ticktick.auth({
        scopes: ["projects:write"],
        redirectUri: "http://localhost:3000/auth/callback",
    });
    const tokens = await ticktick.exchangeCode("your_code_from_callback");
    // PROJECT ====
    const project = await ticktick.fetchProjects();
    // USER ===
    const user = await ticktick.fetchUserInfo();
    // TASK ===
    const tasks = await ticktick.fetchTaskById("project_id", "task_id");
}
