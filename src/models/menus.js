// models/Customer.js
import { Schema, model } from 'mongoose';

const MenuSchema = new Schema({
    dish: {
        type: String,
        required: true
      },

      ingridients:{
        type: String
      },

      price:{
        type: Number,
        min: 0
      }, 
      
      category:{
        type: String
      },
      
      isVeg:{
        type: Boolean
      },
      
      imageUrl:{
        type: String
      }
    }
);

export default model('Menu', MenuSchema);
