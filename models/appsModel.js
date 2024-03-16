const mongoose = require("mongoose");

const appsSchema = new mongoose.Schema({
  logo: String,
  name: {
    type:String,
    required:true,
  },
  userId:{
    type:String,
    required:true,
  },
  appFile: String,
  rating: Number,
  developerName: String,
  type: String,
  description: String,
  whatsNew: String,
  createdAt: {
    type:Date,
    default:Date.now,
  },
  categories: [String],
  photos: [String],
});

const apps = new mongoose.model("Apps", appsSchema);

module.exports = apps;