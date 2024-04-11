// ===================== Express - Uptime ==============================//
const express = require('express');
const app = express();
app.listen(() => console.log(('General Progs Help you every time ↗️ ')));
app.use('/', (req, res) => {  res.send("<center><h1>Bot online 24H</h1></center>");
});
//======================================================================//
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  ButtonBuilder,
  ButtonStyle,
  userMention,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ModalSubmitInteraction,
  permissionOverwrites
} = require("discord.js");
const Discord = require('discord.js')
const { Probot } = require("discord-probot-transfer");

const client = new Client({
  intents: 131071,
});

const db = require('pro.db')

//======================= معلومات البوت ====================//


const prefix = "$"; // البريفكس
const owner = "1085285361237905409"; // ايدي الاونر

//=========================================================//

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!
    Index.js  ✅
    `);
    const st = db.get('client_status') || 'idle'
    const act = db.get('client_activtie_name') || `${prefix}stock`
    const type = db.get('client_activtie_type') || 5
    client.user.setPresence({status: `${st}`,activities: [{name: `${act}`,type: `${type}` , url : 'https://www.twitch.tv/onlydark1.'}]})
  // client.user.setActivity("General Progs ON TOP", { type: 3 });
  // client.user.setStatus("idle");
});

//====================================== جميع الاكواد هنا ===================================================//

client.on("messageCreate" , (message) => {
  if(message.content == prefix + "add"){
    const admins = db.get('admins') || [];
    if(!admins.includes(message.author.id)) return message.reply('❌ | عذرا انت لست ادمن في البوت')
    if(message.author.bot) return;
    const btn = new ButtonBuilder()
                      .setCustomId('addproject')
                      .setLabel('اضافة بروجكت')
                      .setStyle(ButtonStyle.Primary)
                      .setEmoji('➕');
    const row = new ActionRowBuilder().addComponents(btn);

    message.reply({content : 'لاضافة بروجكت للبيع اضغط على الزر واملا البيانات' , components : [row]});
    return;
  }
})

client.on("interactionCreate" , async(interaction) => {
  if(interaction.customId == "addproject"){
    const admins = db.get('admins') || [];
    if(!admins.includes(interaction.user.id)) return interaction.reply('❌ | عذرا انت لست ادمن في البوت')
    const modal = new ModalBuilder()
                      .setTitle('اضافة بروجكت')
                      .setCustomId('addprojectmodal');
    const inp1 = new TextInputBuilder()
                      .setLabel('اسم البروجكت')
                      .setCustomId('inp1')
                      .setStyle(TextInputStyle.Short)
                      .setRequired(true)
                      .setMaxLength(25);
    const inp2 = new TextInputBuilder()
                      .setLabel('وصف البروجكت')
                      .setCustomId('inp2')
                      .setRequired(true)
                      .setStyle(TextInputStyle.Paragraph)
                      .setMaxLength(55);
    const inp3 = new TextInputBuilder()
                      .setLabel('ايموجي للبروجكت(لازم من جهازك ليس من سيرفر)')
                      .setCustomId('inp3')
                      .setRequired(false)
                      .setStyle(TextInputStyle.Short)
                      .setMaxLength(1);
    const inp4 = new TextInputBuilder()
                      .setLabel('سعر البروجكت')
                      .setCustomId('inp4')
                      .setRequired(true)
                      .setStyle(TextInputStyle.Short)
                      .setMaxLength(7);
      const inp5 = new TextInputBuilder()
                      .setLabel('رابط البروجكت')
                      .setCustomId('inp5')
                      .setRequired(true)
                      .setStyle(TextInputStyle.Short)
                      .setMaxLength(60);
    const row1 = new ActionRowBuilder().addComponents(inp1)
    const row2 = new ActionRowBuilder().addComponents(inp2)
    const row3 = new ActionRowBuilder().addComponents(inp3)
    const row4 = new ActionRowBuilder().addComponents(inp4)
    const row5 = new ActionRowBuilder().addComponents(inp5)

    modal.addComponents(row1 , row5 ,row2 , row3 , row4)
    interaction.showModal(modal);
  }else if(interaction.customId == "addprojectmodal"){
    const gg = db.get('projects') || 1;
    const btn = new ButtonBuilder()
    .setCustomId('addprojectdis')
    .setLabel('تم اضافة البروجكت')
    .setStyle(ButtonStyle.Success)
    .setDisabled(true)
    .setEmoji('✔️');
    const row = new ActionRowBuilder().addComponents(btn);
    const v1 = interaction.fields.getTextInputValue("inp1")  // name
    const v2 = interaction.fields.getTextInputValue("inp2") // desc
    const v3 = interaction.fields.getTextInputValue("inp3") // emoji
    const v4 = interaction.fields.getTextInputValue("inp4") // price
    const v5 = interaction.fields.getTextInputValue("inp5") // link

    // Create the project object
    const projectData = {
      'id' : parseInt(gg) + parseInt(1),
      'name': v1,
      'desc': v2,
      'emoji': v3,
      'price': v4,
      'link': v5
    };

    // Push the project data into the 'stock_data' array using pro.db
     await db.add('projects' , 1)
    await db.push(`stock_data`, projectData);
    await interaction.update({content : `تم اضافة البروجكت \`${v1}\` بنجاح` , components : [row]})
  }
})





client.on('messageCreate', async (message) => {
  if (message.content.startsWith(prefix + 'stock')) {
    // Retrieve the JSON data from pro.db
    const data = db.get('stock_data');
    const noembed = new EmbedBuilder()
    .setTitle('**البروجكتات المتوفرة**')
    .setColor('#00ff00')
    .setDescription('### لا يوجد بروجكتات موجودة حاليا')
    .setAuthor({
      name: message.guild.name,
      iconURL: message.guild.iconURL({ dynamic: true }),
    });

    if (!data || data.length <= 0) {
      await message.channel.send({embeds : [noembed]});
      return;
    }

    // Create an embed to display the JSON data
    const embed = new EmbedBuilder()
      .setTitle('**البروجكتات المتوفرة**')
      .setColor('#00ff00')
      .setAuthor({
        name: message.guild.name,
        iconURL: message.guild.iconURL({ dynamic: true }),
      });

    for (const [projectName, projectData] of Object.entries(data)) {
      const { desc, emoji, price, link , id , name} = projectData;

      // Add fields to the embed
      embed.addFields(
        {
          name : `------[ **${name.toUpperCase()}** ]------`,
          value :`> **${desc}**\n - السعر : ${price} 💰 \n - للشراء اكتب : \`${prefix}buy ${id}\``,
        }
      );
    }
    const btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel(`${message.guild.name}`).setCustomId('guildname').setStyle(ButtonStyle.Success).setDisabled(true))
    // Send the embed message
    await message.channel.send({embeds : [embed] , components : [btn]});
  }
});

client.on("messageCreate" , async(message) => {
      if(message.content.startsWith(prefix + "buy")){
        const logch = db.get('log');
        const role = db.get('client_role');
        const buyroom = db.get('buyroom')
        const buyst = db.get('buy_status');
        console.log(buyst)
        if(buyroom && message.channelId !== buyroom){
          return message.reply(`**❌ | عذرا هذه ليست الغرفة المناسبة للشراء . توجه الى <#${buyroom}>**`)
        }

        if(buyst && buyst == '0') return message.reply('**❌ | عذرا البيع مقفل**')
        const gg = db.get("stock_data");
        const args = message.content.split(' ');
        const itemId = parseInt(args[1]);
        const receipient = db.get('receipient');
        const probot = db.get('probot')

        if(!probot) return message.reply('**❌ | عذرا ايدي البروبوت غير محدد**')
        if(!receipient) return message.reply('**❌ | عذرا مستلم الكريدت غير محدد**')
        if(!itemId) return message.reply("**❌ | عذرا قم بتحديد ايدي البروجكت المراد شراءه**")

        const selectedItem = gg.find((stockItem) => stockItem.id === itemId);
        if (isNaN(itemId) || itemId <= 0 || !selectedItem) {
          message.reply('❌ | لا يوجد بروجكت بهذا الايدي');
          return;
        }

        client.probot = Probot(client, {
          fetchGuilds: true,
          data: [

              {
                  fetchMembers: true,
                  guildId: message.guild.id,
                  probotId: probot,
                  owners: receipient,
              },
          ],
      });

        const pricetr = selectedItem.price
        .replace("k", "000")
        .replace("K", "000")
        .replace("m", "000000")
        .replace("M", "000000")
        .replace("b", "000000000000")
        .replace("B", "000000000000");
      const Tax1 = Math.floor((pricetr * 20) / 19 + 1);
        const purchaseEmbed = new EmbedBuilder()
                                    .setColor('#FFCC00')
                                    .setAuthor({
                                      name : message.author.username,
                                      iconURL : message.author.displayAvatarURL({ dynamic: true })
                                    }
                                    )
                                    .setTimestamp()
                                    .addFields({
                                      name : `__**شراء ${selectedItem.name}**__`,
                                      value :`- ** 💰 السعر :** \`${Tax1}\` كريدت\n> **لديك 60 ثانية للتحويل**\n> **من فضلك تحقق من فتح خاصك** :warning:\n\n**للشراء اكتب :**\`\`\`#credit ${receipient} ${Tax1}\`\`\`
                                      `
                                    });
        //const purchaseEmbed = `**قم بتحويل المبلغ التالي 💰 ${Tax1} الى <@${receipient}> للحصول على بروجكت  ${selectedItem.name}** \n \`#credit ${receipient} ${Tax1}\` `
                        const ggg = await message.channel.send({content : `<@${message.author.id}>` , embeds : [purchaseEmbed]})
                            var check = await client.probot.collect(message, {
                              probotId: probot,
                              owners: receipient,
                              time: 1000 * 60 * 1,
                              max : 1,
                              userId: message.author.id,
                              price: Tax1,
                              fullPrice: false,
                          });
                          if (check.status) {
                            const embed = new EmbedBuilder()
                                              .setTitle(`✅ تم شراء بروجكت ${selectedItem.name} بنجاح`)
                                              .setDescription(`**طريقة تشغيله : موجود ملف اسمه readme.md فيه شرح كامل للبوت** \n \`\`\` ${selectedItem.link} \`\`\``)
                                              .setColor('Green');
                            const logembed = new EmbedBuilder()
                                              .setDescription(`**تم شراء \`${selectedItem.name}\` بواسطة : <@${message.author.id}>**`)
                                              .setColor('Yellow');
                            const channel = await client.channels.cache.get(logch)
                            if(logch && channel){
                              await channel.send({embeds : [logembed]})
                            }

                            if(role){
                              await message.member.roles.add(role)
                            }

                            await ggg.delete();
                            await message.author.send({embeds : [embed]}).then(async() => {

                              await message.reply('✅ تم شراء البروجكت بنجاح تحقق من خاصك ولا تنسى تقييمنا <#1131540337526059139>')

                            }).catch(() => {return message.reply(':) خاصك مغلق')})
                          } else if (check.error) {
                            ggg.delete();
                              return message.channel.send(`[x] الوقت قد انتهي لا تقم بالتحويل<@${message.author.id}>`).catch(err =>{})
                          } else {
                              return message.channel.send(`**❌ اعد المحاوله.**`);
                          }
      }
})

client.on("messageCreate", async (message) => {
  if (message.content.startsWith(prefix + "remove")) {
    const logch = db.get('log');
    const admins = db.get('admins')
    if(!admins.includes(message.author.id)) return message.reply('❌ | عذرا انت لست ادمن في البوت')
    const gg = db.get("stock_data");
    const args = message.content.split(' ');
    const itemId = parseInt(args[1]);
    const selectedItem = gg.find((stockItem) => stockItem.id === parseInt(itemId));

    if (isNaN(itemId) || itemId <= 0 || !selectedItem) {
      message.channel.send('[x] لا يوجد بروجكت بهذا الايدي');
      return;
    }

    const logembed = new EmbedBuilder()
                        .setDescription(`**تم حذف \`${selectedItem.name}\` \n بواسطة : <@${message.author.id}>**`)
                        .setColor('Yellow')
                        .setTimestamp();
            const channel = client.channels.cache.get(logch)
      if(logch && channel){
      channel.send({embeds : [logembed]})
      }

    // Save the updated array back to the database if needed
    const filtered = gg.filter((ad) => ad.id != selectedItem.id);
      db.set('stock_data' , filtered)
     db.add('projects' , 1)
    message.reply('[✔] تم حذف البروجكت بنجاح');
  }
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith(prefix + "give")) {
    const logch = db.get('log');
    const admins = db.get('admins')
    if(!admins.includes(message.author.id)) return message.reply('❌ | عذرا انت لست ادمن في البوت')
    const gg = db.get("stock_data");
    const args = message.content.split(' ');
    const itemId = parseInt(args[1]);
    const user = message.mentions.users.first() || (await message.client.users.fetch(args[1]).catch(() => {}));

    if(!itemId) return message.reply('**❌ | عذرا قم بتحديد ايدي البروجكت**')
    if(!user) return message.reply('**❌ | عذرا قم بمنشن الشخص**')

    const selectedItem = gg.find((stockItem) => stockItem.id === parseInt(itemId));

    if (isNaN(itemId) || itemId <= 0 || !selectedItem) {
      message.reply('[x] لا يوجد بروجكت بهذا الايدي');
      return;
    }

    const logembed = new EmbedBuilder()
                              .setDescription(`**تم اعطاء \`${selectedItem.name}\` \n بواسطة : <@${message.author.id}> \n الى : ${user}**`)
                              .setColor('Yellow')
                              .setTimestamp();
      if(logch){
      const channel = client.channels.cache.get(logch)
      channel.send({embeds : [logembed]})
      }

    user.send({embeds : [
      new EmbedBuilder()
      .setTitle('✅ تم اعطاءك البروجكت بنجاح')
      .setDescription(`**طريقة تشغيله : موجود ملف امسه readme.md فيه شرح كامل للبوت** \n \`\`\` ${selectedItem.link} \`\`\``)
      .setColor('Green')
    ]}).then(() => {
      message.reply(`**☑️ | تم اعطاء بروجكت ${selectedItem.name} بنجاح**`)
    }).catch(() => {
      return message.reply(`**❌ | عذرا خاص هذا الشخص \`مغلق\`**`)
    })
  }
});

client.on("messageCreate" , async(message) => {
  if(message.content.startsWith(prefix + "admin-add")){
      if(message.author.id !== owner) return;
      const args = message.content.split(' ');
      const user = message.mentions.users.first() || (await message.client.users.fetch(args[1]).catch(() => {}));

      const admins = db.get('admins') || [];
      if(admins.includes(user.id)) return message.reply(' ** ❌ | هذا الشخص ادمن بالفعل**')


      db.push('admins' , `${user.id}`)
      message.reply('> ** ☑️ | تم اضافة الادمن بنجاح **')
  }else if(message.content.startsWith(prefix + "admin-remove")){
    if(message.author.id !== owner) return;
    const args = message.content.split(' ');
    const user = message.mentions.users.first() || (await message.client.users.fetch(args[1]).catch(() => {}));

    const admins = db.get('admins') || [];
    if(!admins.includes(user.id)) return message.reply(' ** ❌ | هذا الشخص ليس ادمن **')


    const filter = db.get("admins").filter((admin) => admin != user.id);
    db.set('admins' , filter)
    message.reply('> ** ☑️ | تم حذف الادمن بنجاح **')
}if(message.content.startsWith(prefix + "admins")){
  if(message.author.id !== owner) return;

  const admins = db.get("admins");
  if(!admins) return message.reply("عذرا لايوجد ادمنز في البوت");
  const adminsarray = admins.map(admin => `<@${admin}>`).join('\n');

  const embed = new EmbedBuilder()
                    .setTitle('قائمة الادمنز 🤴🏻')
                    .setDescription(`${adminsarray}`)
                    .setColor("DarkButNotBlack");

                    message.reply({embeds : [embed]})
}else if(message.content.startsWith(prefix + "set-name")){
  if(message.author.id !== owner) return;
  let args = message.content.split(" ").slice(1).join(" ")
  if(!args)return message.reply("❌ | قم بكتابة الاسم الجديد")
  let gg = client.user.setUsername(args).then(() =>{
      message.reply(`** > ☑️ تم تغيير اسم البوت الى \`${args}\` **`)
  })
gg.catch(async err => await message.reply({content: `[x] حدث خطا`}))
}else if(message.content.startsWith(prefix + "set-avatar")){
  if(message.author.id !== owner) return;
  let args = message.content.split(" ")
  if(!args[1])return message.reply("Avatar Link required")
  let gg = client.user.setAvatar(args[1]).then(() =>{
      message.reply({embeds : [
        new EmbedBuilder()
                .setTitle('تم تغيير صورة البوت')
                .setImage(`${args[1]}`)
                .setColor('Green')
      ]})
  })
  gg.catch(err => message.reply({content:"** ❌ | عذرا تاكد من الرابط **"}))
}else if(message.content.startsWith(prefix + "set-status")){
  if(message.author.id !== owner) return;
  const args = message.content.split(" ").slice(1).join(" ")
  if(!args) return message.reply(`Type New Status\nLike: \`${prefix}set-status Hi\``)
  message.reply({embeds:[new EmbedBuilder().setColor("#df408c").setDescription(`[1] Playing\n[2] Listening\n[3] Streaming\n[4] Watching\n[0] Cancel`)]})
  let filter = m => m.author.id === message.author.id;
        message.channel.awaitMessages({ filter, max: 1, time: 90000, errors: ['time'] }).then(collected => {
        if (collected.first().content.toLowerCase() == '1') {
        message.reply({embeds:[new EmbedBuilder().setDescription('Done Changed to Playing').setColor("#df408c")]})
        db.set('client_status' , `idle`)
        db.set('client_activtie_name' , `${args}`)
        db.set('client_activtie_type' , 0)
        client.user.setPresence({status: 'idle',activities: [{name: args,type: Discord.ActivityType.Playing}]})
        } else if (collected.first().content.toLowerCase() == '2') {
        message.reply({embeds:[new EmbedBuilder().setDescription('Done Changed to Listening').setColor("#df408c")]})
        db.set('client_status' , `idle`)
        db.set('client_activtie_name' , `${args}`)
        db.set('client_activtie_type' , 2)
        client.user.setPresence({status: 'idle',activities: [{name: args,type: Discord.ActivityType.Listening}]})

        } else if (collected.first().content.toLowerCase() == '3') {
        message.reply({embeds:[new EmbedBuilder().setDescription('Done Changed to Streaming').setColor("#df408c")]})
        db.set('client_status' , `idle`)
        db.set('client_activtie_name' , `${args}`)
        db.set('client_activtie_type' , 1)
        client.user.setPresence({status: 'idle',activities: [{name: args,type:Discord.ActivityType.Streaming,url: "https://www.twitch.tv/onlydark"}]})

        } else if (collected.first().content.toLowerCase() == '4') {
        message.reply({embeds:[new EmbedBuilder().setDescription('Done Changed to Watching').setColor("#df408c")]})
        db.set('client_status' , `idle`)
        db.set('client_activtie_name' , `${args}`)
        db.set('client_activtie_type' , 3)
        client.user.setPresence({status: 'idle',activities: [{name: args,type:Discord.ActivityType.Watching}]})

        } else if (collected.first().content.toLowerCase() == '0') {
        message.reply({embeds:[new EmbedBuilder().setDescription('Done Deleted').setColor("Red")]})
        }
      })
}
})

client.on("messageCreate" , (message) => {
  if(message.content.startsWith(prefix + 'buy-status')){
    const args = message.content.split(' ');
    if(args[1] == "on"){
      const buyst = db.get('buy_status');
      if(buyst && buyst == "1") return message.reply('❌ | عذرا البيع مفتوح بالفعل')
      db.set('buy_status' , '1')
      message.reply('**✅ | تم فتح البيع**')
    }else if(args[1] == "off"){
      const buyst = db.get('buy_status');
      if(buyst && buyst == "0") return message.reply('❌ | عذرا البيع مقفل بالفعل')
      db.set('buy_status' , '0')
      message.reply('**✅ | تم قفل البيع**')
    }else{
      message.reply(`استخدام الامر خاطئ \n \`${prefix}buy-status on/off\``)
    }
  }else if(message.content.startsWith(prefix + "set-buy")){
    const admins = db.get('admins') || []
    if(!admins.includes(message.author.id)) return message.reply('❌ | عذرا انت لست ادمن في البوت')

    let args = message.content.split(' ')

    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);

    if(!channel) return message.reply('**❌ عذرا قم بتحديد روم البيع**')

    db.set('buyroom' , `${channel.id}`)
    message.reply(`** > ✅ تم تحديد ${channel} كروم بيع **`)

  }else if(message.content.startsWith(prefix + "set-log")){
    if(message.author.id !== owner)return;

    let args = message.content.split(' ')

    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);

    if(!channel) return message.reply('**❌ عذرا قم بتحديد روم اللوج**')

    db.set('log' , `${channel.id}`)
    message.reply(`** > ✅ تم تحديد ${channel} كروم لوج **`)

  }else if(message.content.startsWith(prefix + "set-price")){
    const admins = db.get('admins') || [];
    if(!admins.includes(message.author.id)) return message.reply('❌ | عذرا انت لست ادمن في البوت')
    const args = message.content.split(' ');
    const type = args[1]; // id of the project
    const price = args[2]; // price of the project

    if(!type || !price) return message.reply(`❌ | عذرا استخدام الامر خاطئ \n \`${prefix}set-price [project ID] [price]\``);
    if(isNaN(price)) return message.reply('❌ | عذرا السعر يجب ان يكون ارقام فقط');

    const gg = db.get('stock_data')
    if(!gg) return message.reply('❌ | عذرا لايوجد بروجكتات متوفرة')
    const selectedItemIndex = gg.findIndex((stockItem) => stockItem.id === parseInt(type));
    const selectedItem = gg.find((stockItem) => stockItem.id === parseInt(type));
    if (isNaN(type) || type <= 0 || !selectedItem) {
      message.reply('**[x] لا يوجد بروجكت بهذا الايدي**');
      return;
    }

    gg[selectedItemIndex].price = price;
    db.set("stock_data", gg);
    message.reply(`✅ | تم تغيير سعر بروجكت ${selectedItem.name}`)
  }
})

// anouncments

client.on("messageCreate" , async(message) => {
  if(message.content.startsWith(prefix + 'set-announce')){
    if(message.author.id !== owner) return;

    const args = message.content.split(' ');
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);

    db.set('announce_channel' , channel.id);
    message.reply(`** > ✅ تم تحديد روم التحديثات ${channel}**`)

  }
  if(message.content.startsWith(prefix + 'announce')){
    const admins = db.get('admins') || [];
    if(!admins.includes(message.author.id)) return message.reply('❌ | عذرا انت لست ادمن في البوت')

    const args = message.content.split(' ');
    const itemId = args[1];

    const gg = db.get('stock_data')
    const selectedItem = gg.find((stockItem) => stockItem.id === parseInt(itemId));
    if (isNaN(itemId) || itemId <= 0 || itemId > gg.length || !selectedItem) {
      message.reply('❌ | لا يوجد بروجكت بهذا الايدي');
      return;
    }

    const ch = db.get('announce_channel');
    if(!ch) return message.reply(`❌ | عذرا قم بتحديد روم التحديثات اولا \n \`${prefix}set-announce [channel]\``)

    const buyroom = db.get('buyroom');
    if(buyroom){
      const embed = new EmbedBuilder()
      .setTitle(`🔔 تم اضافة بروجكت جديد`)
      .addFields({
        name : `📁 اسم البروجكت :`,
        value : `**${selectedItem.name}**`,
        inline : true
      },
      {
        name : `🗒️ وصف البروجكت :`,
        value : `__**${selectedItem.desc}**__`,
        inline : true
      },
      {
        name : `💰 سعر البروجكت`,
        value : `${selectedItem.price}`,
        inline : false
      },
      {
        name : `❓ لشراء البروجكت :`,
        value : `توجه الى <#${buyroom}> واستخدم امر \`buy ${selectedItem.id}${prefix}\``,
        inline : false
      }
      )
      .setColor('Random')
      const channel = client.channels.cache.get(ch)
      await channel.send({embeds : [embed]})
      await message.reply('✅ | تم النشر بنجاح')
    }else{
      const embed = new EmbedBuilder()
      .setTitle(`🔔 تم اضافة بروجكت جديد`)
      .addFields({
        name : `📁 اسم البروجكت :`,
        value : `**${selectedItem.name}**`,
        inline : true
      },
      {
        name : `🗒️ وصف البروجكت :`,
        value : `__**${selectedItem.desc}**__`,
        inline : true
      },
      {
        name : `💰 سعر البروجكت`,
        value : `${selectedItem.price}`,
        inline : false
      },
      {
        name : `❓ لشراء البروجكت :`,
        value : `استخدم امر \`buy ${selectedItem.id}${prefix}\``,
        inline : false
      }
      )
      .setColor('Random')
      const channel = client.channels.cache.get(ch)
      await channel.send({embeds : [embed]})
      await message.reply('✅ | تم النشر بنجاح')
    }

  }
})

client.on("messageCreate" , (message) => {
  if(message.content.startsWith(prefix + "set-client")){
    if(message.author.id !== owner)return;

    const args = message.content.split(' ');
    clientrole = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);

    db.set('client_role' , `${clientrole.id}`);
    message.reply(`** > ✅ تم تحديد رتبة العميل ${clientrole} **`);
  }
})

client.on("messageCreate" , async(message) => {
  if(message.content.startsWith(prefix + "set-probot")){
    if(message.author.id !== owner)return;

    const args = message.content.split(' ');
    const user = await message.mentions.users.first() || (await message.client.users.fetch(args[1]).catch(() => {}));

    db.set('probot' , `${user.id}`);
    message.reply(`** > ✅ تم تحديد البروبوت ${user} **`);
  }
})

client.on("messageCreate" , async(message) => {
  if(message.content.startsWith(prefix + "set-bank")){
    if(message.author.id !== owner)return;

    const args = message.content.split(' ');
    const user = await message.mentions.users.first() || (await message.client.users.fetch(args[1]).catch(() => {}));

    db.set('receipient' , `${user.id}`);
    message.reply(`** > ✅ تم تحديد حساب البنك ${user} **`);
  }
})

client.on("messageCreate" , async(message) => {
  if(message.content == prefix + "help"){
    const embed = new EmbedBuilder()
                      .setDescription('> قائمة اوامر البوت')
                      .setColor('DarkButNotBlack');

    const btn1 = new ButtonBuilder()
                      .setLabel('اوامر الاونر')
                      .setCustomId('btn1')
                      .setStyle(ButtonStyle.Danger)
                      .setEmoji('👑')
    const btn2 = new ButtonBuilder()
                      .setLabel('اوامر ادارية')
                      .setCustomId('btn2')
                      .setStyle(ButtonStyle.Primary)
                      .setEmoji('🛠️')
    const btn3 = new ButtonBuilder()
                      .setLabel('اوامر عامة')
                      .setCustomId('btn3')
                      .setStyle(ButtonStyle.Success)
                      .setEmoji('🌍')
    const row = new ActionRowBuilder().addComponents(btn1 , btn2 , btn3)
    message.reply({embeds : [embed] , components : [row]})
  }
})


client.on('interactionCreate' , async(interaction) => {
  if(interaction.customId == "btn1"){
    interaction.reply({content : `**> 👑 اوامر الاونر \n \`اعدادات البوت\`\n \`*\` ${prefix}set-name [الاسم]\n لتغيير اسم البوت\n \`*\` ${prefix}set-status [الكلام الذي تريده]\n لتغيير حالة البوت\n \`*\` ${prefix}set-avatar [رابط الصورة]\n لتغيير صورة البوت\n\`تسطيبات البوت\`\n \`*\` ${prefix}set-probot [منشن البروبوت]\n لتحديد البروبوت\n \`*\` ${prefix}set-bank [منشن الحساب]\n لتحديد حساب البنك\n \`*\` ${prefix}set-client [منشن الرتبة]\n لتحديد رتبة العميل\n \`*\` ${prefix}set-announce [منشن الروم]\n لتحديد روم اخبار البروجكتات\n \`اوامر الادمنز\`\n \`*\` ${prefix}admin-add [منشن العضو] \n اضافة ادمن في البوت \n \`*\` ${prefix}admin-remove [منشن العضو]\n لحذف ادمن من البوت\n\`*\` ${prefix}admins\n لرؤية قائمة الادمنز في البوت**` , ephemeral : true})
  }else if(interaction.customId == "btn2"){
    interaction.reply({content : `**> 🛠️ الاوامر الادارية :
    \`*\` ${prefix}add
    لاضافة بروجكت
    \`*\` ${prefix}remove
    لحذف بروجكت
    \`*\` ${prefix}give [ايدي البروجكت] [منشن العضو]
    لاعطاء بروجكت لعضو
    \`*\` ${prefix}set-price [ايدي البروجكت] [السعر الجديد]
    لتغيير سعر البروجكت
    \`*\` ${prefix}set-buy [منشن الروم]
    لتحديد روم البيع
    \`*\` ${prefix}buy-status [on / off]
    لاطفاء off البيع / تشغيل on البيع
   **`, ephemeral : true})
  }else if(interaction.customId == "btn3"){
    interaction.reply({content : `**> 🌍 الاوامر العامة :
    \`*\` ${prefix}stock
    لرؤية البروجكتات متوفرة
    \`*\` ${prefix}buy [ايدي البروجكت]
    لشراء بروجكت
   **` , ephemeral : true})
  }
})
//===================================== جميع الاكواد هنا ====================================================//
client.login(process.env.token); // توكن البوت 
