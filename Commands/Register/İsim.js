const Discord = require('discord.js');
const moment = require('moment')
require("moment-duration-format");
const db = require('quick.db');
const tdb = new db.table("kayitlar");
const kb = new db.table('kullanıcı')
const kdb = new db.table("kayıt");
const Config = require("../../Configuration/Settings.json");

exports.run = async (client, message, args) => {
moment.locale("tr")
let salvoembed = new Discord.MessageEmbed().setColor(Config.Embed.Color).setFooter(Config.Embed.Footer).setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true}))
if (!message.member.roles.cache.has(Config.Roles.Register_Permission) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(salvoembed.setDescription(`Bu Yetkiyi Kullanabilmen İçin <@&${Config.Roles.Register_Permission}> Rolüne Sahip Olmalısın`)).then(x => x.delete({timeout: Config.Embed.Timeout}));
let kisi = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if(!kisi) return message.channel.send(salvoembed.setDescription(`Lütfen Bir Kullanıcı Etiketleyiniz.`)).then(m => m.delete({timeout: Config.Embed.Timeout}));
if(message.member.roles.highest.position <= kisi.roles.highest.position) return message.channel.send(salvoembed.setDescription(`Belirtilen Kullanıcı Sizden Daha Yetkili veya Sizinle Aynı Yetkide.`)).then(m => m.delete({timeout: Config.Embed.Timeout}));
args = args.filter(a => a !== "" && a !== " ").splice(1);
let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
let yas = args.filter(arg => !isNaN(arg))[0] || undefined;
if(!isim) return message.channel.send(salvoembed.setDescription(`Lütfen Bir İsim Belirtin.`)).then(m => m.delete({timeout: Config.Embed.Timeout}));
if(!yas) return message.channel.send(salvoembed.setDescription(`Lütfen Bir Yaş Belirtin.`)).then(m => m.delete({timeout: Config.Embed.Timeout}));
if(yas <= Config.Limits.Age_Limit) return message.channel.send(salvoembed.setDescription(`Belirtilen Yaş Limitin Altında. Limit: ${Config.Limits.Age_Limit}`)).then(m => m.delete({timeout: Config.Embed.Timeout}));
kisi.setNickname(`${kisi.user.username.includes(Config.Server.Tag) ? Config.Server.Tag : (Config.Server.Tag || "")} ${isim} | ${yas}`);

kdb.push(`kullanici.${kisi.id}.kayıt`, {
kayıtAdı: `${kisi.user.username.includes(Config.Server.Tag) ? Config.Server.Tag : (Config.Server.Tag || "")} ${isim} | ${yas}`,
kayıtIsim: isim,
kayıtYas: yas,
kayıtTarih: moment(message.createdAt).format("Do MMMM YYYY - hh:mm"),
kayıtId: kayitID,
kayıtYetkili: message.author.id,
kayıtTuru: "İsim Düzenleme",
});

message.channel.send(salvoembed.setDescription(`${kisi} İsimli Kullanıcının Adı Başarılı Bir Şekilde ${message.author} Tarafından Değiştirildi`)).then(m => m.delete({timeout: Config.Embed.Timeout}));
message.react(Config.Emojis.Check);

};
exports.conf = {
  aliases: ['isim', 'i', 'nick', 'name'],
  permLevel: 0
};

exports.help = {
  name: 'isim',
  description: 'Kullanıcının Adını Değiştirir / Salvatore was here',
  usage: 'isim'
};