const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const perkSchema = new Schema({
  name: String,
  characterId: String,
  icon: String,
  keywords: String,
  description: String,
});

module.exports = mongoose.model("Perk", perkSchema);
