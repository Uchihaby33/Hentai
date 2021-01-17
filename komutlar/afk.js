const Discord = require("discord.js");
const db = require("quick.db");

exports.run = (client, message, args, kyoya) => {
  let sebep = args.slice(0).join(" ");
  if (!sebep) return message.reply(`Neden klavyeden uzaklaşıcaksın?`);

  db.set(`afks_${message.author.id}`, sebep);

  return message.reply(
    `<a:8703_KingproteaGao1:762969620437008385> Artık klavye başında değil.`
  );
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["afke", "AFK"],
  permLevel: 0
};

exports.help = {
  name: "afk",
  description:
    "AFK olursunuz. (Birisi sizi etiketlediğinde AFK olduğunuzu söyler.)",
  usage: "afk <sebep>"
};