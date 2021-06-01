const Discord = require('discord.js');
const moment = require('moment');
require("moment-duration-format");
const db = require("quick.db");
const tdb = new db.table("kayitlar");
const kb = new db.table('kullanıcı')
const kdb = new db.table("Kayıt");
const Config = require("../../Configuration/Settings.json");

exports.run = async (client, message, args) => {
moment.locale("tr")
let salvoembed = new Discord.MessageEmbed().setColor(Config.Embed.Color).setFooter(Config.Embed.Footer).setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true}))
if (!message.member.roles.cache.has(Config.Roles.Register_Permission) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(salvoembed.setDescription(`Bu Yetkiyi Kullanabilmen İçin <@&${Config.Roles.Register_Permission}> Rolüne Sahip Olmalısın`)).then(x => x.delete({timeout: Config.Embed.Timeout}));
let kullanici = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
let uye = message.guild.member(kullanici);
let kayıtsayısı = kdb.fetch(`kayitsayisi.${uye.id}`);
let kayıt = kdb.get(`kullanici.${uye.id}.kayıt`) || [];
let isimler = kayıt.length > 0 ? kayıt.map((value, index) => `\`${index + 1}.\` \`${value.kayıtAdı}\` \`${value.kayıtTarih}\` [\`${value.kayıtTuru}\`]`).join("\n") : "Kullanıcının Geçmiş Kayıt Bilgisi Bulunmamakta.";

message.channel.send(salvoembed.setDescription(`${uye} İsimli Kullanıcı Sunucuya \`${kayıtsayısı}\` Kere Kayıt Olmuş.

${isimler}`)).then(x => x.delete({timeout: Config.Embed.Timeout}));
message.react(Config.Emojis.Check);

};
exports.conf = {
  aliases: ['isimler', 'kayıt-geçmişi', 'kayıtlar'],
  permLevel: 0
};

exports.help = {
  name: 'isimler',
  description: 'Geçmiş Kayıt Listesini Gösterir / Salvatore was here',
  usage: 'isimler'
};