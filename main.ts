import { Client, Events, GatewayIntentBits } from "discord.js";
import { loadConfig } from "./config.ts";
import { processEvent } from "./messageParser.ts";

async function main() {
  try {
    const config = await loadConfig();
    console.log("🤖 Discord Botを起動中...");

    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
      ],
    });

    client.once("ready", (client) => {
      console.log(`✅ ${client.user.username}としてログインしました!`);
      console.log(`🔗 サーバー数: ${client.guilds.cache.size}`);
    });

    client.login(config.token);

    client.on(Events.MessageCreate, (event) => {
      if (event.author.bot) return;
      console.log("start");
      processEvent(event);
    });
  } catch (error) {
    console.error("❌ ボットの起動に失敗しました:", error);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
