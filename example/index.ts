import { TickTickNode, authTickTick, exchangeToken } from "../src";

async function main() {
  const clientId = "your_client_id";
  const clientSecret = "your_client_secret";

  // AUTH ====
  // const authUrl = authTickTick({
  //   clientId,
  //   scopes: ["tasks:write"],
  //   redirectUri: "http://localhost:3000/auth/callback",
  // });

  // const tokens = await exchangeToken({
  //   code: "your_code",
  //   clientId,
  //   clientSecret,
  //   scopes: ["tasks:write"],
  //   redirectUri: "http://localhost:3000/auth/callback",
  // });

  // PROJECT ====
  const ticktick = new TickTickNode("fda35be0-d05a-4951-bf44-64343a5fc657");
  const project = await ticktick.fetchProjects();

  console.log(project);

  // // USER ===
  // const user = await ticktick.fetchUserInfo();

  // // TASK ===
  // const tasks = await ticktick.fetchTaskById("project_id", "task_id");
}

main();
