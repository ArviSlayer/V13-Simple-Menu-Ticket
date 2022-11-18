const Discord = require("discord.js"); //ArviS#0011
const config = require("./config.json"); 
const Enmap = require("enmap");
//ArviS#0011
const client = new Discord.Client({
  allowedMentions: {
    parse: ["roles"],
    repliedUser: false,
  },
  partials: ['MESSAGE', 'CHANNEL'],
  intents: [ 
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
  ],
});

client.settings = new Enmap({name: "settings"});//ArviS#0011

client.on("ready", () => {//ArviS#0011
    console.log(`[ArviS#0011] Aktif: ${client.user.tag}`);
})

client.on("messageCreate", async (message) => {
    if(!message.guild || message.author.bot) return;

    let args = message.content.slice(config.prefix.length).trim().split(" ");//ArviS#0011
    let cmd = args.shift()?.toLowerCase();

    if(!message.content.startsWith(config.prefix) || !cmd || cmd.length == 0) return;

    client.settings.ensure(message.guildId, {
        TicketSystem1: {
            channel: "",
            message: "",
            category: "",
        }//ArviS#0011
    })

    if(cmd == "kapat") {
        let TicketUserId = client.settings.findKey(d => d.channelId == message.channelId);

        if(!client.settings.has(TicketUserId)){
            return message.reply({
                content: `**ArviS#0011:** Bu Kanal Bir Ticket Değil`
            })
        }
        client.settings.delete(TicketUserId);
        message.reply("**ArviS#0011:** Kanal `3 Saniye` İçinde Silinecek");
        setTimeout(() => {
            message.channel.delete().catch(()=>{});
        }, 3000)
    }
    //ArviS#0011
    if(cmd == "kur") {//ArviS#0011
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]); 
        if(!channel) return message.reply("**ArviS#0011:** Kanal Etiketlemen Gerekiyor");

        let TicketEmbed = new Discord.MessageEmbed()
            .setColor("#2f3136")//ArviS#0011
            .setTitle("🎫・Destek Oluştur")
            .setDescription("Aşağıdaki Menüden Destek Almak İstediğin Konuyu Seçebilirsin")//ArviS#0011
            .setFooter("Made by ❤️ ArviS#0011")
            .setImage("https://media.discordapp.net/attachments/997105193256747028/1043158198212886538/ArviS_Imza_BEYAZ.png?width=1440&height=288")
            .setThumbnail("https://media.discordapp.net/attachments/997105193256747028/1043158198212886538/ArviS_Imza_BEYAZ.png?width=1440&height=288");
        
            let Menu = new Discord.MessageSelectMenu()
            .setCustomId("FirstTicketOpeningMenu")
            .setPlaceholder("Kategori Seç")
            .setMaxValues(1) 
            .setMinValues(1)
            .addOptions([ 
                {
                    label: "Genel Yardım".substr(0, 25), 
                    value: "genel_yardım".substr(0, 25), 
                    description: "Yetkililerden Genel Yardım Alabilirsin".substr(0, 50), //ArviS#0011
                    emoji: "<:ticket_arvis0011:1043246389628502046>", 
                },//ArviS#0011
                {
                    label: "Diğer Yardım".substr(0, 25), 
                    value: "diğer_yardım".substr(0, 25), 
                    description: "Yetkililere Sorun Bildirebilirsin".substr(0, 50), 
                    emoji: "<:ticket_arvis0011:1043246389628502046>", 
                },
                {
                    label: "Made by ❤️ ArviS#0011".substr(0, 25), 
                    value: "arvis_0011".substr(0, 25), 
                    description: "İzinsiz Paylaşılması/Kullanılması Yasaktır".substr(0, 50), 
                    emoji: "<a:patlayankalp_arvis0011:997610154545655921>", 
                }
            ])
        let row = new Discord.MessageActionRow().addComponents();
        
        channel.send({//ArviS#0011
            embeds: [TicketEmbed],
            components: [row]
        }).then((msg) => {//ArviS#0011
            client.settings.set(message.guildId, channel.id, "TicketSystem1.channel")
            client.settings.set(message.guildId, msg.id, "TicketSystem1.message")
            client.settings.set(message.guildId, channel.parentId, "TicketSystem1.category")
            return message.reply("<:tik_arvis:1035231831815106611> **ArviS#0011:** Destek Sistemi Kuruldu");
        }).catch((e) => {
            console.log(e);
            return message.reply("Hata! Daha Sonra Tekrar Dene");
        })
    }
})

client.on("interactionCreate", async (interaction) => {
    if(!interaction.isSelectMenu() || !interaction.guildId || interaction.message.author.id != client.user.id) return
    
    client.settings.ensure(interaction.guildId, {//ArviS#0011
        TicketSystem1: {//ArviS#0011
            channel: "",
            message: "",
            category: "",
        }
    })

    let data = client.settings.get(interaction.guildId)//ArviS#0011
    if(!data.TicketSystem1.channel || data.TicketSystem1.channel.length == 0) return//ArviS#0011


    if(interaction.channelId == data.TicketSystem1.channel && interaction.message.id == data.TicketSystem1.message) {  //ArviS#0011      
        switch(interaction.values[0]){
            case "genel_yardım": {
                let channel = await CreateTicket({
                    OpeningMessage: "**ArviS#0011:** Genel Kategorisinde Destek Açılıyor...",
                    ClosedMessage: `**ArviS#0011:** Destek Talebi Açıldı (<#{channelId}>)`,
                    embeds: [ new Discord.MessageEmbed().setColor("#2f3136").setTitle("Sana Nasıl Yardımcı Olabiliriz?").setFooter("Made by ❤️ ArviS#0011").setImage("https://media.discordapp.net/attachments/997105193256747028/1043158198212886538/ArviS_Imza_BEYAZ.png?width=1440&height=288").setThumbnail("https://media.discordapp.net/attachments/997105193256747028/1043158198212886538/ArviS_Imza_BEYAZ.png?width=1440&height=288").setDescription("Destek Talebini Kapatmak İçin `a.kapat` Yazabilirsin")]
                }).catch(e=>{
                    return console.log(e)//ArviS#0011
                })
                console.log(channel); 
            } break;
            case "diğer_yardım": {
                let channel = await CreateTicket({
                    OpeningMessage: "**ArviS#0011:** Diğer Kategorisinde Destek Açılıyor...",
                    ClosedMessage: `**ArviS#0011:** Destek Talebi Açıldı (<#{channelId}>)`,
                    embeds: [ new Discord.MessageEmbed().setColor("#2f3136").setTitle("Sana Nasıl Yardımcı Olabiliriz?").setFooter("Made by ❤️ ArviS#0011").setImage("https://media.discordapp.net/attachments/997105193256747028/1043158198212886538/ArviS_Imza_BEYAZ.png?width=1440&height=288").setThumbnail("https://media.discordapp.net/attachments/997105193256747028/1043158198212886538/ArviS_Imza_BEYAZ.png?width=1440&height=288").
                    setDescription("Destek Talebini Kapatmak İçin `a.kapat` Yazabilirsin")]
                }).catch(e=>{
                    return console.log(e)//ArviS#0011
                })
                console.log(channel.name); //ArviS#0011
            } break;
        }
        
        async function CreateTicket(ticketdata) {
            return new Promise(async function(resolve, reject) {
                await interaction.reply({
                    ephemeral: true,
                    content: ticketdata.OpeningMessage
                })
                let { guild } = interaction.message;
                let category = guild.channels.cache.get(data.TicketSystem1.category);
                if(!category || category.type != "GUILD_CATEGORY") category = interaction.message.channel.parentId || null; //ArviS#0011
                let optionsData = {
                    type: "GUILD_TEXT",
                    topic: `${interaction.user.tag} | ${interaction.user.id}`,
                    permissionOverwrites: [],
                }
                if(client.settings.has(interaction.user.id)){
                    let TicketChannel = guild.channels.cache.get(client.settings.get(interaction.user.id, "channelId"))
                    if(!TicketChannel) {
                        client.settings.delete(interaction.user.id)
                    } else {//ArviS#0011
                        return interaction.editReply({
                            ephemeral: true,
                            content: `**ArviS#0011:** Halihazırda Bir Destek Talebin Bulunuyor (<#${TicketChannel.id}>)`
                        })//ArviS#0011
                    }//ArviS#0011
                }//ArviS#0011
                optionsData.permissionOverwrites = [...guild.roles.cache.values()].sort((a, b) => b?.rawPosition - a.rawPosition).map(r => {
                    let Obj = {}
                    if(r.id){
                        Obj.id = r.id;
                        Obj.type = "role";
                        Obj.deny = ["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "ADD_REACTIONS", "ATTACH_FILES"]//ArviS#0011
                        Obj.allow = [];
                        return Obj;
                    } else {
                        return false;
                    }
                }).filter(Boolean);
                
                optionsData.permissionOverwrites.push({
                    id: interaction.user.id,
                    type: "member",
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "ADD_REACTIONS", "ATTACH_FILES"],
                    deny: [],
                })
                
                while (optionsData.permissionOverwrites.length >= 99){
                optionsData.permissionOverwrites.shift();
                }
                if(category) optionsData.parent = category;
                guild.channels.create(`ticket-${interaction.user.username.split(" ").join("-")}`.substr(0, 32), optionsData).then(async channel => {
                    await channel.send({
                        content: `<@${interaction.user.id}>`,
                        embeds: ticketdata.embeds
                    }).catch(()=>{});
                    client.settings.set(interaction.user.id, {
                        userId: interaction.user.id,
                        channelId: channel.id,
                    })
                    await interaction.editReply({//ArviS#0011
                        ephemeral: true,
                        content: ticketdata.ClosedMessage.replace("{channelId}", channel.id)
                    }).catch(()=>{});//ArviS#0011
                    resolve(channel);//ArviS#0011
                }).catch((e)=>{
                    reject(e)//ArviS#0011
                });
            })//ArviS#0011
            
        }//ArviS#0011

    } //ArviS#0011
})//ArviS#0011

client.login("")//ArviS#0011









//ArviS#0011