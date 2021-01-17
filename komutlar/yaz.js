const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');

var prefix = ayarlar.prefix;

exports.run = (client, message, args) => {
    const mesaj = args.slice(0).join(' ');
   if (message.author.id !== "693697816375328840") return message.channel.send("Bunu sahibim kullana bilir!")
    if(mesaj.length < 1) return message.reply("Özelden Atılacak Mesajı Yazın")
      try {
        message.guild.members.forEach(m=> {
         
        m.send(`https://cdn.discordapp.com/attachments/744503593490448415/764054674802081803/giphy.gif`)
        console.log(`${m.user.tag} Kişisine Attım.`)
         
          }) 
        message.channel.send("Özelden Mesajlar Gönderildi")
          }
        catch(e) {
        return console.log(`Bir Kişiye Atamadım`)
       
      } 
    
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["dm"],
  permLevel: 2
};

exports.help = {
  name: 'dmduyuru',
  description: 'dm mesajı atar.',
  usage: 'dmduyuru'
};

