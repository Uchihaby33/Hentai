const Discord = require("discord.js");
const bot = new Discord.Client();
const ayarlar = require("../ayarlar.json");

module.exports.run = async (bot, message, args) => {
  if (message.author.id !== ayarlar.sahip)
    return message.channel.send(
      "Geliştiricim Değilsin Bu Komutu kullanamazsın.!"
    );

  message.channel.sendMessage(` <a:hrktlitac:764507992359305217> \`AniGameTR Kuralları\` <a:hrktlitac:764507992359305217> \n \n <a:8703_KingproteaGao1:762969620437008385> Küfür, Argo ve Jargon yasaktır. \n \n <a:hypecute:764522158184464385> Reklam (Sunucu, youtube, insta ve çekiliş gibi...) yasaktır. \n \n <a:HyperNeko:764522158147633202> Irkçı, Dini ve Siyasi sohbetler yasaktır. \n \n <a:6799_komi:764522132201275453> +18 (Kan, cinsellik) içerikler paylaşmak yasaktır. \n \n <a:4605_LoliTantrum:764522124622692363> Spam ve Flood yasaktır. \n \n <a:glchkedi:764515554958508083> Kavga, Tartışma çıkarmak yasaktır.\n   
<a:renklicizgi:764507905302200340><a:renklicizgi:764507905302200340><a:renklicizgi:764507905302200340><a:renklicizgi:764507905302200340><a:renklicizgi:764507905302200340><a:renklicizgi:764507905302200340><a:renklicizgi:764507905302200340><a:renklicizgi:764507905302200340><a:renklicizgi:764507905302200340><a:renklicizgi:764507905302200340> \n \n <:haa:764217480298102827> \`Kısa Not\`\n **Bu Kurallar sesli sohbettede geçerliliğini korumaktadır.** \n **Herkez kuralları okumuş ve kabul etmiş sayılır.** \n**Herkez kendi yaptığından sorumludur.** `);

  message.delete(60).then(msg => {
    console.log(`✅ | Bot Yeniden Başlatıldı...`);

    process.exit(0);
  });
};
module.exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["r", "reboot", "yenile", "yeniden başlat"],
  permLevel: 0
};

module.exports.help = {
  name: "reboot",
  description: "",
  usage: "reboot"
};
