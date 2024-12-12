import axios from "axios";
import { TICKTICK_AUTH_URL, TICKTICK_TOKEN_URL } from "./constants";
import { AuthScope } from "./types";
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
  private scopes: AuthScope[];
  private redirectUri: string;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
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
            "Content-Type": " application/x-www-form-urlencoded",
          },
        }
      );

      return response.data as ExchangeCodeRes;
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      throw error;
      return;
    }
  }
}
