
// Controller to handle CRUD operations for menu items
// 

import menus from "../models/menus.js";
  
    
  
  

//Create a new menu item
export const menuController = {
     createMenuItem: async (req, res) => {
         console.log("this is calling");

       try {
         console.log(req.body);
       
         const newItem = new menus(req.body);
         await newItem.save();
         res.status(201).json({ message: 'Menu item created successfully', data: newItem });
       } catch (error) {
         res.status(500).json({ message: 'Error creating menu item', error });
       }
     },

     //Get all menu items
    getAllMenuItems: async (req, res) => {
      try {
        const menuItems = await menus.find();
        res.status(200).json({ data: menuItems });
      } catch (error) {
        res.status(500).json({ message: 'Error retrieving menu items', error });
      }
    },

    //    Get a single menu item by ID
    getMenuItemById: async (req, res) => {
      try {
        const menuItem = await menus.findById(req.params.id);
        if (!menuItem) {
          return res.status(404).json({ message: 'Menu item not found' });
        }
        res.status(200).json({ data: menuItem });
      } catch (error) {
        res.status(500).json({ message: 'Error retrieving menu item', error });
      }
    },
  
       //Update a menu item by ID
    updateMenuItem: async (req, res) => {
      try {
        const { dish, ingridients, price, category } = req.body;
        const menuItem = await menus.findByIdAndUpdate(
          req.params.id,
          { dish, ingridients, price, category},
          { new: true } // return the updated document
        );
        if (!menuItem) {
          return res.status(404).json({ message: 'Menu item not found' });
        }
        res.status(200).json({ message: 'Menu item updated successfully', data: menuItem });
      } catch (error) {
        res.status(500).json({ message: 'Error updating menu item', error });
      }
    },
  
    // Delete a menu item by ID
    deleteMenuItem: async (req, res) => {
      try {
        const menuItem = await menus.findByIdAndDelete(req.params.id);
        if (!menuItem) {
          return res.status(404).json({ message: 'Menu item not found' });
        }
        res.status(200).json({ message: 'Menu item deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting menu item', error });
      }
    },
  };
  
  

    
