# Overview

This is a Node.js wrapper for the TickTick API. It allows you to interact with your TickTick tasks programmatically. It follows _OAuth2_ flow based on [their offical open API doc](https://developer.ticktick.com/api#/openapi)

## Installation

```bash
npm install ticktick-node-api-oauth2
yarn add ticktick-node-api-oauth2
```

## Usage

Here is an example of how to use the TickTick Node API:

```javascript
import TickTick from "ticktick-node-api-oauth2";

const clientId = "your_client_id";
const clientSecret = "your_client_secret";

// AUTH ====
const authUrl = authTickTick({
  clientId,
  scopes: ["tasks:write"],
  redirectUri: "http://localhost:3000/auth/callback",
});

const tokens = await exchangeToken({
  code: "your_code",
  clientId,
  clientSecret,
  scopes: ["tasks:write"],
  redirectUri: "http://localhost:3000/auth/callback",
});

// PROJECT ====
const ticktick = new TickTickNode("your_access_token");
const project = await ticktick.fetchProjects();
```

## License

This project is licensed under the MIT License.
