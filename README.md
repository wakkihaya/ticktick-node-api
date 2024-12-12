# Overview

This is a Node.js wrapper for the TickTick API. It allows you to interact with your TickTick tasks programmatically. It follows _OAuth2_ flow based on [their offical open API doc](https://developer.ticktick.com/api#/openapi)

## Installation

```bash
npm install ticktick-node-api
yarn add ticktick-node-api
```

## Usage

Here is an example of how to use the TickTick Node API:

```javascript
import TickTick from "ticktick-node-api";

// Initialize the TickTick client
const clientId = "your_client_id";
const clientSecret = "your_client_secret";

const ticktick = new TickTickNode(clientId, clientSecret);

// Authenticate the client
const authUrl = ticktick.auth({
  scopes: ["projects:write"],
  redirectUri: "http://localhost:3000/auth/callback",
});

const tokens = await ticktick.exchangeCode("your_code_from_callback");

// Get projects
const project = await ticktick.fetchProjects();

## License

This project is licensed under the MIT License.
```
