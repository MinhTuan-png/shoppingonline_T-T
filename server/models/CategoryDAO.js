require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose');

const CategoryDAO = {
  async insert(category) {
    category._id = new mongoose.Types.ObjectId();
    return await Models.Category.create(category);
  },

  async selectAll() {
    return await Models.Category.find();
  },

  async updateById(id, category) {
    return await Models.Category.findByIdAndUpdate(
      id,
      category,
      { new: true } 
    );
  },

  async selectByID(_id) {
  const category = await Models.Category.findById(_id).exec();
  return category;
 },

  async delete(id) {
    return await Models.Category.findByIdAndDelete(id);
  }
};

module.exports = CategoryDAO;
