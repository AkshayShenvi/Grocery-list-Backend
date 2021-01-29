const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itemSchema = {
  item_id: mongoose.Schema.ObjectId,
  item: String,
  listtype: String,
  addedby: String,
  addedon: Date,
};

const users = { name: String };

const listSchema = new Schema({
  listname: String,
  listUsers: [users],
  items: [itemSchema],
});

module.exports = mongoose.model("List", listSchema);