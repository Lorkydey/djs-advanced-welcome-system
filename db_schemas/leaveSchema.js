const { Schema, model } = require("mongoose");
const userLeaveSchema = new Schema({
  guildId: String,
  channelId: String,
  leavetext: String,
  leavesubtext: String,
});

module.exports = model("leaveSchema", userLeaveSchema, "userLeaveSchema");