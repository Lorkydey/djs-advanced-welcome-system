const {
    PermissionFlagsBits,
    SlashCommandBuilder,
    ChannelType,
    ChatInputCommandInteraction,
    EmbedBuilder,
  } = require("discord.js");
  const leaveSchema = require("../../db_schemas/leaveSchema");
  const joinSchema = require("../../db_schemas/joinSchema");

  module.exports = {
    data: new SlashCommandBuilder()
      .setName("event")
      .setDescription("Welcome/leave command setup")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
      .addSubcommand((subcommand) =>
        subcommand
          .setName("disable")
          .setDescription("disable and delete the data on this guild")
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("leave")
          .setDescription("Set or replace the leave message channel.")
          .addChannelOption((option) =>
            option
              .setName("channel")
              .setDescription("Channel to send the leave message to.")
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(true)
          )
          .addStringOption((option) =>
          option
            .setName("text") 
            .setDescription("image leave text (you can just say \"left\")")
            .setRequired(true)
          )
          .addStringOption((option) =>
          option
            .setName("subtext") 
            .setDescription("description leave text")
            .setRequired(false)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("welcome")
          .setDescription("Set or replace the welcome message channel.")
          .addChannelOption((option) =>
            option
              .setName("channel")
              .setDescription("Channel to send the message to.")
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(true)
          )
          .addStringOption((option) =>
          option
            .setName("text") 
            .setDescription("image welcome text (you can just say \"Welcome\")")
            .setRequired(true)
          )
          .addStringOption((option) =>
          option
            .setName("subtext") 
            .setDescription("description welcome text")
            .setRequired(false)
          )
      ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
      const sub = interaction.options.getSubcommand();
  
      switch (sub) {
        case "leave":
          {
            if (interaction.options.getSubcommand() === "leave") {
              const channel = interaction.options.getChannel("channel");
              const leavetext = interaction.options.getString("text");
              const leavesubtext = interaction.options.getString("subtext");
              const leaveSys = await leaveSchema.findOne({
                guildId: interaction.guild.id,
              });
  
              if (!leaveSys) {
                leaveChannel = new leaveSchema({
                  guildId: interaction.guild.id,
                  channelId: channel.id,
                  leavetext: leavetext,
                  leavesubtext: leavesubtext,
                });
  
                await leaveChannel.save().catch((err) => console.log(err));
                const successEmbed = new EmbedBuilder()
                  .setDescription(`Enabled leave message in **${channel.name}**\n\`Leave Text: ${leavetext}\`\n\`Leave Description Text: ${leavesubtext}\``)
                  .setColor("Blurple");
                await interaction.reply({
                  embeds: [successEmbed],
                  ephemeral: true,
                });
              }
              if (leaveSys) {
                await leaveSchema.findOneAndUpdate(
                  { guildId: interaction.guild.id },
                  { channelId: channel.id },
                  { leavetext: leavetext },
                  { leavesubtext: leavesubtext }
                );
                const successEmbed = new EmbedBuilder()
                  .setDescription(`Leave Data Updated`)
                  .setColor("Blurple");
  
                await interaction.reply({
                  embeds: [successEmbed],
                  ephemeral: true,
                });
              }
            }
          }
          break;
        case "welcome":
          {
            if (interaction.options.getSubcommand() === "welcome") {
              const channel = interaction.options.getChannel("channel");
              const welcometext = interaction.options.getString("text")
              const welcomesubtext = interaction.options.getString("subtext");
              const joinSys = await joinSchema.findOne({
                guildId: interaction.guild.id,
              });
  
              if (!joinSys) {
                joinChannel = new joinSchema({
                  guildId: interaction.guild.id,
                  channelId: channel.id,
                  welcometext: welcometext,
                  welcomesubtext: welcomesubtext
                });
  
                await joinChannel.save().catch((err) => console.log(err));
                const successEmbed = new EmbedBuilder()
                  .setDescription(`Enabled welcome message in **${channel.name}**\n\`Welcome Text: ${welcometext}\`\n\`Welcome Description Text: ${welcomesubtext}\``)
                  .setColor("Blurple");
                await interaction.reply({
                  embeds: [successEmbed],
                  ephemeral: true,
                });
              }
              if (joinSys) {
                await joinSchema.findOneAndUpdate(
                  { guildId: interaction.guild.id },
                  { channelId: channel.id },
                  { welcometext: welcometext },
                  { welcomesubtext: welcomesubtext }
                );
                const successEmbed = new EmbedBuilder()
                  .setDescription(`Welcome Data Updated !`)
                  .setColor("Blurple");
  
                await interaction.reply({
                  embeds: [successEmbed],
                  ephemeral: true,
                });
              }
            }
          }
          break;
        case "disable":
          {
            if (interaction.options.getSubcommand() === "disable") {
              await joinSchema.findOneAndDelete({
                guildId: interaction.guild.id,
              });
              await leaveSchema.findOneAndDelete({
                guildId: interaction.guild.id,
              });
  
              const successEmbed = new EmbedBuilder()
                .setDescription(`Successfully deleted the data in this guild.`)
                .setColor("Blurple");
              await interaction.reply({
                embeds: [successEmbed],
                ephemeral: true,
              });
            }
          }
          break;
      }
    },
  };