const mongoose = require('mongoose');
const ItemService = require('./item');

class ListService {
  constructor() {
    this.listSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      items: [ItemService.itemSchema],
    });

    this.List = mongoose.model('List', this.listSchema);
  }

  async findCustomList(listName) {
    return await this.List.findOne({ name: listName });
  }

  async createCustomList(customListName) {
    if (customListName !== 'favicon.ico') {
      const list = new this.List({
        name: customListName,
        items: ItemService.initializeDefaultItems(),
      });
      console.log('Custom list created successfully!');
      return await list.save();
    }
  }

  async renderCustomList(res, customListName) {
    try {
      const foundList = await this.findCustomList(customListName);
      if (!foundList) {
        await this.createCustomList(customListName);
        res.redirect('/' + customListName);
      } else {
        res.render('list', {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async addItemToCustomList(item, listTitle) {
    const foundList = await this.findCustomList(listTitle);
    const foundListArray = foundList.items;
    foundListArray.push(item);
    await foundList.save();
  }

  async deleteItemByIdFromCustomList(listName, checkedItemId) {
    try {
      await this.List.findOneAndUpdate(
        {
          name: listName,
        },
        {
          $pull: { items: { _id: checkedItemId } },
        }
      );
    } catch (error) {
      console.error(`Failed to delete custom item by ID`, error);
    }
  }
}

module.exports = new ListService();
