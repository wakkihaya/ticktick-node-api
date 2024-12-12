import { TickTickNode, authTickTick, exchangeToken } from "../src";

async function main() {
  const clientId = "your_client_id";
  const clientSecret = "your_client_secret";

  // AUTH ====
  const authUrl = authTickTick({
    clientId,
    scopes: ["projects:write"],
    redirectUri: "http://localhost:3000/auth/callback",
  });

  const tokens = await exchangeToken({
    code: "your_code",
    clientId,
    clientSecret,
    scopes: ["projects:write"],
    redirectUri: "http://localhost:3000/auth/callback",
  });

  // PROJECT ====
  const ticktick = new TickTickNode("your_access_token");
  const project = await ticktick.fetchProjects();

  // USER ===
  const user = await ticktick.fetchUserInfo();

  // TASK ===
  const tasks = await ticktick.fetchTaskById("project_id", "task_id");
}
