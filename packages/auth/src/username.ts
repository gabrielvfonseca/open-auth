import "server-only";
import type { DatabaseAdapter } from "@open-auth/core";

export class UsernameService {
  constructor(private readonly adapter: DatabaseAdapter) {}

  public async checkUsernameAvailability(username: string): Promise<boolean> {
    const user = await this.adapter.getUserFromUsername(username);
    return user === null;
  }

  public async updateUsername(userId: string, username: string): Promise<void> {
    const available = await this.checkUsernameAvailability(username);
    if (!available) {
      throw new Error("Username is already taken");
    }

    await this.adapter.updateUser(userId, { username });
  }
}
