const mongoose = require("mongoose");

const appsSchema = new mongoose.Schema({
  logo: String,
  appName: {
    type:String,
    required:true,
  },
  userId:{
    type:String,
    required:true,
  },
  packageName: {
    type:String,
    required:true,
    unique:true,
  },
  appFile: String,
  rating: Number,
  developerName: String,
  type: String,
  shortDescription: String,
  description: String,
  whatsNew: String,
  createdAt: String,
  categories: [String],
  photos: [String],
  totalDownloads: Number,
  version: String,
});

const apps = new mongoose.model("Apps", appsSchema);

module.exports = apps;