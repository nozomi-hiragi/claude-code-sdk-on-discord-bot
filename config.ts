import { load } from "@std/dotenv";

export interface BotConfig {
  token: string;
  applicationId?: string;
}

export async function loadConfig(): Promise<BotConfig> {
  const env = await load();

  const token = env.BOT_TOKEN || Deno.env.get("BOT_TOKEN");
  if (!token) {
    throw new Error(
      "BOT_TOKEN is required. Please set it in .env file or environment variables.",
    );
  }

  return {
    token,
    applicationId: env.APPLICATION_ID || Deno.env.get("APPLICATION_ID"),
  };
}
