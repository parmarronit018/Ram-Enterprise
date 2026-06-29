const mongoose = require('mongoose');

// Product ka naksha (Schema) taiyar karte hain
const ProductSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Product ka naam hona zaroori hai"] 
    },
    description: { 
        type: String, 
        required: [true, "Description dena padega"] 
    },
    price: { 
        type: Number, 
        required: [true, "Price likhna zaroori hai"] 
    },
    image: { 
        type: String, 
        required: [true, "Image URL chahiye"] 
    },
    category: { 
        type: String,
        default: "General"
    },
    stock: { 
        type: Number, 
        default: 0 
    }
}, { 
    timestamps: true // Isse 'createdAt' aur 'updatedAt' apne aap ban jayenge
});

// Is model ko export karte hain taaki routes mein use kar sakein
module.exports = mongoose.model('Product', ProductSchema);