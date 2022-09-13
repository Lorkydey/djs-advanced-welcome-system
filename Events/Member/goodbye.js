const {
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
    AttachmentBuilder,
  } = require("discord.js");

const Canvas = require('@napi-rs/canvas')
const { join } = require("path")
const leaveSchema = require("../../db_schemas/leaveSchema");


module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
     async execute(interaction, client) {
        const { user, guild } = interaction;


        leaveSchema.findOne({ guildId: guild.id }, async (err, data) => {
        if (!data) {
            return;
        } else {
        
            const channelSendWelcome = client.channels.cache.get(data.channelId)

            const canvas = Canvas.createCanvas(1770, 635)
            const ctx = canvas.getContext('2d')
            const background = await Canvas.loadImage(join(__dirname, '../../img/', 'left.png'))
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

            var left = `${data.leavetext}`
            ctx.font = 'bold 60px Sans'
            ctx.fillStyle = '#C60000' // It's supposed to be red, I'm sorry if it's not red I'm color blind
            ctx.fillText(left, 680, canvas.height / 2 + 70)

            ctx.beginPath()
            ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true) // rounding Avatar Of User
            ctx.closePath()
            ctx.clip()

            const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'png' })) // Get User Avatar
            ctx.drawImage(avatar, 65, canvas.height / 2- 250, 500 , 500)

            const attachment = new AttachmentBuilder(canvas.toBuffer(), 'left.png') // Send As Attachment

            const embed = new EmbedBuilder()
            .setDescription(`<@${user.id}> Left\n ${data.leavesubtext}`)
            .setColor('BLUE')
            channelSendWelcome.send({ embeds: [embed], files: [attachment] })
            }
        })
    }
}