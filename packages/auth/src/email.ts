import "server-only";
import type { DatabaseAdapter } from "@open-auth/core";

export class EmailService {
  constructor(private readonly adapter: DatabaseAdapter) {}

  public verifyEmailInput(email: string): boolean {
    return /^.+@.+\..+$/.test(email) && email.length < 256;
  }

  public async checkEmailAvailability(email: string): Promise<boolean> {
    const user = await this.adapter.getUserFromEmail(email);
    return user === null;
  }
}
