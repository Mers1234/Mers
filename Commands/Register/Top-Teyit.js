const Discord = require('discord.js');
const moment = require('moment');
require("moment-duration-format");
const db = require('quick.db');
const kb = new db.table('kullanıcı')
const Config = require("../../Configuration/Settings.json");

exports.run = async (client, message, args) => {

let salvoembed = new Discord.MessageEmbed().setColor(Config.Embed.Color).setFooter(Config.Embed.Footer).setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true}))
if (!message.member.roles.cache.has(Config.Roles.Register_Permission) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(salvoembed.setDescription(`Bu Yetkiyi Kullanabilmen İçin <@&${Config.Roles.Register_Permission}> Rolüne Sahip Olmalısın`)).then(x => x.delete({timeout: Config.Embed.Timeout}));
let data = await kb.get("teyit") || {};
let salvo = Object.keys(data);
let listedMembers = salvo.filter(dat => message.guild.members.cache.has(dat)).sort((a,b) => Number((data[b].erkek || 0) + (data[b].kiz || 0)) - Number((data[a].erkek || 0) + (data[a].kiz || 0))).map((value, index) => `\`${index + 1}.\` <@${client.users.cache.get(value).id}> (\`Toplam: ${(data[value].erkek || 0) + (data[value].kiz || 0)}, Erkek: ${(data[value].erkek || 0)}, Kız: ${(data[value].kiz || 0)}\`)`).splice(0, 30);
message.channel.send(salvoembed.setDescription(`${listedMembers.join(`\n`) || "Listelenecek Teyit Verisi Bulunamadı."} `)).catch();  
message.react(Config.Emojis.Check);

};
exports.conf = {
  aliases: ['top-teyit', 'teyit-top', 'kayıt-top', 'top-kayıt'],
  permLevel: 0
};

exports.help = {
  name: 'top-teyit',
  description: 'Top Teyit Listesini Gösterir / Salvatore was here',
  usage: 'top-teyit'
};