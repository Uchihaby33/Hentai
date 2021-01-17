const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const moment = require("moment");
var Jimp = require("jimp");
const { Client, Util } = require("discord.js");
const weather = require("weather-js");
const fs = require("fs");
const db = require("quick.db");
const http = require("http");
const express = require("express");
require("./util/eventLoader")(client);
const path = require("path");
const request = require("request");
const snekfetch = require("snekfetch");
const queue = new Map();
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");

const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping tamamdır.");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});
//aaa

client.on("guildMemberRemove", async member => {
  //let resimkanal = JSON.parse(fs.readFileSync("./ayarlar/gç.json", "utf8"));
  //const canvaskanal = member.guild.channels.get(resimkanal[member.guild.id].resim);

  if (db.has(`gçkanal_${member.guild.id}`) === false) return;
  var canvaskanal = member.guild.channels.get(
    db.fetch(`gçkanal_${member.guild.id}`)
  );
  if (!canvaskanal) return;

  const request = require("node-superfetch");
  const Canvas = require("canvas"),
    Image = Canvas.Image,
    Font = Canvas.Font,
    path = require("path");

  var randomMsg = ["Sunucudan Ayrıldı."];
  var randomMsg_integer =
    randomMsg[Math.floor(Math.random() * randomMsg.length)];

  let msj = await db.fetch(`cikisM_${member.guild.id}`);
  if (!msj) msj = `{uye}, ${randomMsg_integer}`;

  const canvas = Canvas.createCanvas(640, 360);
  const ctx = canvas.getContext("2d");

  const background = await Canvas.loadImage(
    "https://i.hizliresim.com/Wrn1XW.jpg"
  );
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#74037b";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = `#D3D3D3`;
  ctx.font = `37px "Warsaw"`;
  ctx.textAlign = "center";
  ctx.fillText(`${member.user.username}`, 300, 342);

  let avatarURL = member.user.avatarURL || member.user.defaultAvatarURL;
  const { body } = await request.get(avatarURL);
  const avatar = await Canvas.loadImage(body);

  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.arc(250 + 55, 55 + 55, 55, 0, 2 * Math.PI, false);
  ctx.clip();
  ctx.drawImage(avatar, 250, 55, 110, 110);

  const attachment = new Discord.Attachment(
    canvas.toBuffer(),
    "ro-BOT-güle-güle.png"
  );

  canvaskanal.send(attachment);
  canvaskanal.send(
    msj.replace("{uye}", member).replace("{sunucu}", member.guild.name)
  );
  if (member.user.bot)
    return canvaskanal.send(`🤖 Bu bir bot, ${member.user.tag}`);
});

client.on("guildMemberAdd", async member => {
  if (db.has(`gçkanal_${member.guild.id}`) === false) return;
  var canvaskanal = member.guild.channels.get(
    db.fetch(`gçkanal_${member.guild.id}`)
  );

  if (!canvaskanal || canvaskanal === undefined) return;
  const request = require("node-superfetch");
  const Canvas = require("canvas"),
    Image = Canvas.Image,
    Font = Canvas.Font,
    path = require("path");

  var randomMsg = ["Sunucuya Katıldı."];
  var randomMsg_integer =
    randomMsg[Math.floor(Math.random() * randomMsg.length)];

  let paket = await db.fetch(`pakets_${member.id}`);
  let msj = await db.fetch(`cikisM_${member.guild.id}`);
  if (!msj) msj = `{uye}, ${randomMsg_integer}`;

  const canvas = Canvas.createCanvas(640, 360);
  const ctx = canvas.getContext("2d");

  const background = await Canvas.loadImage(
    "https://i.hizliresim.com/UyVZ4f.jpg"
  );
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#74037b";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = `#D3D3D3`;
  ctx.font = `37px "Warsaw"`;
  ctx.textAlign = "center";
  ctx.fillText(`${member.user.username}`, 300, 342);

  let avatarURL = member.user.avatarURL || member.user.defaultAvatarURL;
  const { body } = await request.get(avatarURL);
  const avatar = await Canvas.loadImage(body);

  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.arc(250 + 55, 55 + 55, 55, 0, 2 * Math.PI, false);
  ctx.clip();
  ctx.drawImage(avatar, 250, 55, 110, 110);

  const attachment = new Discord.Attachment(
    canvas.toBuffer(),
    "ro-BOT-hosgeldin.png"
  );

  canvaskanal.send(attachment);
  canvaskanal.send(
    msj.replace("{uye}", member).replace("{sunucu}", member.guild.name)
  );
  if (member.user.bot)
    return canvaskanal.send(`🤖 Bu bir bot, ${member.user.tag}`);
});
client.on("message", message => {
  const yasak = [
    "discord.gg",
    "discord.app",
    "discord.app",
    "discordapp",
    "discordgg",
    ".net",
    ".xyz",
    ".tk",
    ".pw",
    ".io",
    ".gg",
    ".gl",
    ".me",
    ".org",
    ".biz",
    ".party",
    ".rf.gd",
    ".az"
  ];
  if (yasak.some(word => message.content.includes(word))) {
    if (!message.member.hasPermission("BAN_MEMBERS")) {
      try {
        message.reply("Reklam? Peki <@&718537452326879300>");
        message.delete();
      } catch (err) {
        console.log(err);
      }
    }
  }
});
client.on("messageUpdate", (old, nev) => {
  if (old.content != nev.content) {
    const yasak = [
      "discord.app",
      "discord.gg",
      "invite",
      "discordapp",
      "discordgg",
      ".net",
      ".xyz",
      ".me",
      ".tk",
      ".pw",
      ".io",
      ".gg",
      ".gl",
      ".org",
      ".biz",
      ".party",
      ".rf.gd",
      ".az"
    ];
    if (yasak.some(banned => nev.content.includes(banned))) {
      if (!nev.member.hasPermission("BAN_MEMBERS")) {
        try {
          nev.reply("Reklam? Peki <@&718537452326879300>");
          nev.delete();
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
});
//Bil atına komut
client.on("message", message => {
  let afk_kullanici = message.mentions.users.first() || message.author;
  if (message.content.startsWith(ayarlar.prefix + "afk")) return; //
  if (message.author.bot === true) return;

  //let afk_kullanici = message.mentions.users.first() || message.author;
  //var p = denetim[member.guild.id] ? denetim[member.guild.id].prefix : "*"
  //if (!denetim[member.guild.id]) return;
  //  if(message.content.startsWith(p+"afk")) return; //! yazan yeri kendi botunuzun prefixi ile değiştirin.
  //if (message.author.bot === true) return;
  let i = message.mentions.users.first();
  if (i) {
    if (db.has(`afks_${afk_kullanici.id}`)) {
      const afksuan = new Discord.RichEmbed();
      return message.channel.send(
        `\`${
          client.users.get(afk_kullanici.id).tag
        }\` <a:6799_komi:764522132201275453> Şu anda klavyenin başında değil.\n 
**Sebep:** ${db.fetch(`afks_${afk_kullanici.id}`)}`
      );
      message.channel.send(afksuan);
      //message.channel.send(`**${bot.users.get(afk_kullanici.id).tag}** adlı kullanıcı şuanda AFK! \n**Sebep:** \n${db.fetch(`afks_${afk_kullanici.id}`)}`)
    }
  }
});
client.on("message", async message => {
  if (db.fetch(`afks_${message.author.id}`)) {
    message.reply(
      `Klavyenin başına tekrar geçti. <a:glchkedi:764515554958508083>`
    );
    db.delete(`afks_${message.author.id}`);
    return;
  }
});
client.on("message", async message => {
  let kuikdebe = await db.fetch(`saas_${message.guild.id}`);
  if (!kuikdebe) return;
  if (
    message.content.toLowerCase() === "sa" ||
    message.content.toLowerCase() === "selam" ||
    message.content.toLowerCase() === "selaam" ||
    message.content.toLowerCase() === "s.a" ||
    message.content.toLowerCase() === "sea" ||
    message.content.toLowerCase() === "selamun aleyküm" ||
    message.content.toLowerCase() === "slm" ||
    message.content.toLowerCase() === "selamün aleyküm"
  )
    return message.channel.send(
      `**Aleyüm Selam.** <a:HyperNeko:764522158147633202>`
    );
});
client.on("message", async message => {
  let kuikdebe = await db.fetch(`saas_${message.guild.id}`);
  if (!kuikdebe) return;
  if (
    message.content.toLowerCase() === "mrb" ||
    message.content.toLowerCase() === "merhaba" ||
    message.content.toLowerCase() === "meraba" ||
    message.content.toLowerCase() === "marhaba" ||
    message.content.toLowerCase() === "maraba"
  )
    return message.channel.send(
      `**Merhaba ^^** `
    );
});
client.on("message", async message => {
  let kuikdebe = await db.fetch(`saas_${message.guild.id}`);
  if (!kuikdebe) return;
  if (
    message.content.toLowerCase() === "naber" ||
    message.content.toLowerCase() === "nbr" ||
    message.content.toLowerCase() === "nasılsınız" ||
    message.content.toLowerCase() === "nslsnz" ||
    message.content.toLowerCase() === "nassınız"
  )
    return message.channel.send(
      `**İyidir seni sormalı <a:ceti:764849566091575336>** `
    );
});
client.login(ayarlar.token);
