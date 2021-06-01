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
kisi.setNickname(Config.Server.Register_Name)
kisi.roles.set(kisi.roles.cache.has(Config.Roles.Booster) ? [Config.Roles.Unregistered, Config.Roles.Booster] : [Config.Roles.Unregistered]).catch(error => console.error("Hata Oluştu:", error));
if (kisi.voice.channel) kisi.voice.kick();
message.channel.send(salvoembed.setDescription(`${kisi} İsimli Kullanıcı Kayıtsıza Atıldı.`)).then(x => x.delete({timeout: Config.Embed.Timeout}));
message.react(Config.Emojis.Check);

};
exports.conf = {
  aliases: ['kayıtsız', 'unregister'],
  permLevel: 0
};

exports.help = {
  name: 'kayıtsız',
  description: 'Kullanıcıyı Kayıtsıza Gönderir / Salvatore was here',
  usage: 'kayıtsız'
};