const Discord = require('discord.js');
const Config = require("../../Configuration/Settings.json");

exports.run = async (client, message, args) => {

let salvoembed = new Discord.MessageEmbed().setColor(Config.Embed.Color).setFooter(Config.Embed.Footer).setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true}))
if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(salvoembed.setDescription(`Bu Yetkiyi Kullanabilmen İçin Yönetici Yetkisine Sahip Olmalısın`)).then(x => x.delete({timeout: Config.Embed.Timeout}));
if(!args[0] || (args[0] && isNaN(args[0])) || Number(args[0]) < 1 || Number(args[0]) > 100) return message.channel.send(salvoembed.setDescription(`1-100 Arasında Silinecek Bir Değer Giriniz`)).then(m => m.delete({timeout: Config.Embed.Timeout}));
message.channel.bulkDelete(Number(args[0])).then(mesajlar => message.channel.send(salvoembed.setDescription(`Başarılı Bir Şekilde ${mesajlar.size} Adet Mesaj Silindi`))).then(m => m.delete({timeout: Config.Embed.Timeout}));

};
exports.conf = {
  aliases: ["sil","temizle"],
  permLevel: 0
};

exports.help = {
  name: 'sil',
  description: 'Salvatore was here',
  usage: 'sil'
};