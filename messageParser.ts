import { query, SDKMessage } from "claude-code";
import { Message, OmitPartialGroupDMChannel } from "discord.js";

const toolMap: {
  [id: string]: {
    name: string;
    input: { [name: string]: string };
    messageId: string;
  };
} = {};

const checkLength = (text: string) => {
  if (text.length >= 1999) console.log(`over:${text}`);
  return text.substring(0, 1500);
};

export const processEvent = async (
  event: OmitPartialGroupDMChannel<Message>,
) => {
  const messages: SDKMessage[] = [];
  for await (
    const msg of query({
      prompt: event.content,
      abortController: new AbortController(),
      options: { permissionMode: "acceptEdits" },
    })
  ) {
    console.log(msg);
    if (msg.type === "system") {
      const result = msg.subtype;
      await event.channel.send(checkLength(result));
    } else if (msg.type === "user") {
      for (const cnt of msg.message.content) {
        switch (cnt.type) {
          case "tool_result": {
            const tool = toolMap[cnt.tool_use_id];
            const target = await event.channel.messages.fetch(tool.messageId);
            if (target.editable) {
              if (tool.name === "Read") {
                target.edit(
                  checkLength(`Finish ${tool.name}: ${tool.input.file_path}`),
                );
              } else {
                target.edit(checkLength(`Finish ${tool.name}: ${cnt.content}`));
              }
            } else {
              await event.channel.send(checkLength("user: " + cnt.content));
            }
            break;
          }
          default:
            await event.channel.send(checkLength("user: " + cnt.type));
        }
      }
    } else if (msg.type === "assistant") {
      for (const cnt of msg.message.content) {
        switch (cnt.type) {
          case "text":
            await event.channel.send(checkLength(`\`\`\`${cnt.text}\`\`\``));
            break;
          case "tool_use": {
            let txt = "";
            if (cnt.name === "Read") {
              txt = `Start to ${cnt.name} ${cnt.input.file_path}`;
            } else if (cnt.name === "LS") {
              txt = `Start to ${cnt.name} ${cnt.input.path}`;
            } else {
              txt = `Start to ${cnt.name} ${JSON.stringify(cnt.input)}`;
            }
            const sended = await event.channel.send(checkLength(txt));
            toolMap[cnt.id] = {
              name: cnt.name,
              input: cnt.input,
              messageId: sended.id,
            };
            break;
          }
          default:
            await event.channel.send(checkLength("assistant: " + cnt.type));
        }
      }
    } else if (msg.type === "result") {
      if (msg.subtype === "success") {
        await event.channel.send(checkLength(`${msg.result}`));
      } else {
        const result = msg.subtype;
        await event.channel.send(checkLength(`${result}`));
      }
    } else {
      const result = `unknown type ${JSON.stringify(msg)}`;
      await event.channel.send(checkLength(result));
    }

    messages.push(msg);
  }
  console.log(messages.map((v) => JSON.stringify(v)));
};
