const Discord = require('discord.js');
const client = new Discord.Client({ restTimeOffset: 10 });       
const config = require("./Configuration/Config.json");
const settings = require("./Configuration/Settings.json");
const fs = require("fs");
const db = require("quick.db");
const moment = require("moment");
require("moment-duration-format");
const AsciiTable = require('ascii-table');
global.conf = config; 
global.client = client;
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
let Prefix = config.Bot.Prefix;


fs.readdirSync('./Commands').forEach(dir => {
const commandFiles = fs.readdirSync(`./Commands/${dir}/`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const salvo = require(`./Commands/${dir}/${file}`);
  var table = new AsciiTable('Salvatore Command Table');
  table.setHeading("Command", 'Status', "Aliases")
  if (salvo.help.name) {
  client.commands.set(salvo.help.name, salvo);
  table.addRow(salvo.help.name, "✔️", salvo.conf.aliases)
} else {
  table.addRow(salvo.help.name, "❌")
  continue;
    }
    salvo.conf.aliases.forEach(alias => {
      client.aliases.set(alias, salvo.help.name);
    });
    console.log(table.toString())
  }
})


client.on("message", message => {
  let client = message.client;
  if (message.author.bot) return;
  if (!message.content.startsWith(Prefix)) return;
  let command = message.content.split(' ')[0].slice(Prefix.length);
  let params = message.content.split(' ').slice(1);
  let perms = client.elevation(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }
});


client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === config) permlvl = 4;
  return permlvl;
};


client.on('ready', () => {
  console.log(`Bot ${client.user.tag} Kullanıcı Adıyla Giriş Yaptı!`);

});
client.on("ready", async () => {
  client.user.setPresence({ activity: { name: config.Bot.Activity }, status: config.Bot.Status }, {type: config.Bot.Status_Type});
  client.channels.cache.get(config.Bot.Voice_Channel).join().catch();
 });


const backup = () => {
  fs.copyFile('./json.sqlite', `./Database/Data • ${moment().format('D-M-YYYY • H.mm.ss')} • salvocode.sqlite`, err => {
      if (err) return console.log(err);
      console.log(`Database Yedeklendi. ${moment().format('D-M-YYYY - H.mm.ss')}`);
  });
};
client.on('ready', () => {
  setInterval(() => backup(), 1000 * 60 * 60 * 24); 
});


client.on("guildMemberAdd", member => {
require("moment-duration-format")
const kanal = settings.Channels.Welcome;
let user = client.users.cache.get(member.id);
const hesapkurulus = new Date().getTime() - user.createdAt.getTime();  
const gecengun = moment.duration(hesapkurulus).format(` YY **[Yıl]** DD **[Gün]** HH **[Saat]** mm **[Dakika]**`) 
var kisisayısı = member.guild.members.cache.size.toString().replace(/ /g, "    ")
var salvocuk = kisisayısı.match(/([0-9])/g)
kisisayısı = kisisayısı.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase()
if(salvocuk) {
kisisayısı = kisisayısı.replace(/([0-9])/g, d => {
return {
'0': "<a:sifir:839504846906327100>",
'1': "<a:bir:839504838135644190>",
'2': "<a:iki:839504847422488616>",
'3': "<a:uc:839504847136489513>",
'4': "<a:dort:839504846746943538>",                   
'5': "<a:bes:839504837238063144>",
'6': "<a:alti:839504835737026580>",
'7': "<a:yedi:839504846590705694>",
'8': "<a:sekiz:839504846914846730>",
'9': "<a:dokuz:839504839578091552>"}[d];
})
}
var hesapkontrol;
if (hesapkurulus < 1296000000)
hesapkontrol = `Tehlikeli ${settings.Emojis.Dangerous}`;
if (hesapkurulus > 1296000000)
hesapkontrol = `Güvenli ${settings.Emojis.Safe}`;
moment.locale("tr");
let salvokanal = client.channels.cache.get(kanal);
salvokanal.send(`${member} <@&${settings.Roles.Register_Permission}>`,new Discord.MessageEmbed()
.setColor(settings.Embed.Color)
.setDescription(`
${settings.Emojis.Emoji_1} **Sunucumuza Hoşgeldin <@${member.id}> Umarım İyi Vakit Geçirirsin.** 
  
${settings.Emojis.Emoji_2} **Seninle Beraber ${kisisayısı} Kişi Olduk.**

${settings.Emojis.Emoji_3} **Tagımızı (\`${settings.Server.Tag}\`) Kullanıcı Adına Alarak <@&${settings.Roles.Tagged}> Rolüne Sahip Olabilirsin.**
  
${settings.Emojis.Emoji_4} **Hesabın \`${gecengun}\` Önce Oluşturulmuş ve ${hesapkontrol} Gözüküyor.**

${settings.Emojis.Emoji_5} **Kurallar kanalına Göz Atmayı Unutma Kuralları Oku Lütfen.**
`)
);
});
  

client.on("guildMemberAdd", member => {
member.setNickname(settings.Server.Register_Name)
if (member.user.bot) {
member.roles.add(settings.Roles.Bots) 
} else {
member.roles.add(settings.Roles.Unregistered) 
};
});


client.login(config.Bot.Token);