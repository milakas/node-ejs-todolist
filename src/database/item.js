const mongoose = require('mongoose');

class ItemService {
  constructor() {
    this.itemSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
    });

    this.Item = mongoose.model('Item', this.itemSchema);
  }

  initializeDefaultItems() {
    const defaultItems = [];

    const item1 = new this.Item({
      name: 'Welcome to your todoList!',
    });

    const item2 = new this.Item({
      name: 'Hit the + button to add a new item.',
    });

    const item3 = new this.Item({
      name: 'Hit this to delete an item --->',
    });

    defaultItems.push(item1, item2, item3);
    return defaultItems;
  }

  async addDefaultItems() {
    try {
      await this.Item.insertMany(this.initializeDefaultItems());
      console.log('Default items saved successfully!');
    } catch (err) {
      console.error('Error saving', err);
    }
  }

  async renderDefaultList(res) {
    try {
      const items = await this.Item.find({});
      if (items.length === 0) {
        await this.addDefaultItems();
        res.redirect('/');
      } else {
        res.render('list', { listTitle: 'todos', newListItems: items });
      }
    } catch (error) {
      console.error(`Failed to get data: ${error.message}`);
    }
  }

  async deleteItemByIdFromDefaultList(checkedItemId) {
    try {
      await this.Item.findByIdAndRemove(checkedItemId);
    } catch (error) {
      console.error(`Failed to delete item by ID`, error);
    }
  }

  async addItemToDefaultList(item) {
    await item.save();
  }
}

module.exports = new ItemService();
