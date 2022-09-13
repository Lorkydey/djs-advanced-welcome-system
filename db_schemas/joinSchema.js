const { Schema, model } = require("mongoose");
const userWelcomeSchema = new Schema({
  guildId: String,
  channelId: String,
  welcometext: String,
  welcomesubtext: String,
});

module.exports = model("welcomeSchema", userWelcomeSchema, "userJoinSchema");