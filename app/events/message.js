const db = require("quick.db");
const chalk = require("chalk");
const discord = require("discord.js");
const ayarlar = require("../ayarlar.json");

module.exports = async message => {
  let client = message.client;
  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || ayarlar.prefix;
  let cfxkaralistededb = await db.fetch(
    `cfxkaralistededb_${message.author.id}`
  );
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  let command = message.content.split(" ")[0].slice(prefix.length);
  command = command.toLowerCase();
  let args = message.content.split(" ").slice(1);
  let perms = client.elevation(message);
  let cmd;

  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
 cmd.run(client, message, args);
  };