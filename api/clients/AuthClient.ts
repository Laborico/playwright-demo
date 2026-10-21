import { APIRequestContext, APIResponse } from "@playwright/test";

export class AuthClient {
  constructor(private readonly request: APIRequestContext) {}

  async login(username: string, password: string): Promise<APIResponse> {
    return await this.request.post("/auth", {
      data: { username, password },
    });
  }
}
