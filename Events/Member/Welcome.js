const {
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
    AttachmentBuilder,
  } = require("discord.js");

const Canvas = require('@napi-rs/canvas')
const { join } = require("path")
const joinSchema = require("../../db_schemas/joinSchema");


module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
     async execute(interaction, client) {
        const { user, guild } = interaction;


        joinSchema.findOne({ guildId: guild.id }, async (err, data) => {
        if (!data) {
            return;
        } else {
        
            const channelSendWelcome = client.channels.cache.get(data.channelId)

            const canvas = Canvas.createCanvas(1770, 635)
            const ctx = canvas.getContext('2d')
            const background = await Canvas.loadImage(join(__dirname, '../../img/', 'welcome.png'))
            ctx.drawImage(background, 0 ,0, canvas.width, canvas.height)
            ctx.strokeStyle = '#FFFFFF'

            ctx.strokeRect(0, 0, canvas.width, canvas.height)
            var name = `${user.username}` 
            if(name.length >= 16) {
                ctx.font = 'bold 100px Sans'
                ctx.fillStyle = '#0FEEF3'
                ctx.fillText(name, 680, canvas.height / 2 - 1)
            } else {
                ctx.font = 'bold 130px Sans'
                ctx.fillStyle = '#0FEEF3'
                ctx.fillText(name, 680, canvas.height / 2 - 1)
            }

            var discrim = `#${user.discriminator}`
            ctx.font = 'bold 60px Sans'
            ctx.fillStyle = '#3498DB'
            ctx.fillText(discrim, 680, canvas.height / 2 + 70)

            var text = `${data.welcometext}`
            ctx.font = 'bold 80px Sans'
            ctx.fillStyle = '#55FBFE'
            ctx.fillText(text, 670, canvas.height / 2 - 150)

            var count = `is the ${guild.memberCount} members` 
            ctx.font = 'bold 60px Sans'
            ctx.fillStyle = '#7ECAFD'
            ctx.fillText(count, 680, canvas.height / 2 + 160)

            ctx.beginPath()
            ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true) // rounding Avatar Of User
            ctx.closePath()
            ctx.clip()

            const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'png' })) // Get User Avatar
            ctx.drawImage(avatar, 65, canvas.height / 2- 250, 500 , 500)

            const attachment = new AttachmentBuilder(canvas.toBuffer(), 'welcome.png') // Send As Attachment

            const embed = new EmbedBuilder()
            .setDescription(`Welcome <@${user.id}> 😎\n ${data.welcomesubtext}`)
            .setColor('BLUE')
            channelSendWelcome.send({ embeds: [embed], files: [attachment] })
            }
        })
    }
}