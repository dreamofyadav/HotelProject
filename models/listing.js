const mongoose = require("mongoose");
const Schema =  mongoose.Schema;
const Review = require("./review.js");
const  listingSchema = new Schema({
    title:{
        type: String,
        required : true,
    },
    description : String,
    image:{
        url: String,
        filename: String,
        // type: String,
        // default: "https://images.unsplash.com/photo-1527604234320-e7f7bb99bc6c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE1fDZzTVZqVExTa2VRfHxlbnwwfHx8fHw%3D",
        // set: (v) => 
        //     v === ""
        // ?"https://images.unsplash.com/photo-1527604234320-e7f7bb99bc6c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE1fDZzTVZqVExTa2VRfHxlbnwwfHx8fHw%3D"
        //  : v,
    },
    price: Number,
        // required : true ,
    
    location: String,
    country: String,
    reviews: [
     {
        type: Schema.Types.ObjectId,
        ref: "Review",
     },
    ],
    owner: {
        type:Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
        enum: ["trending","rooms","mountains", "arctic","farms","iconic_city","castles","amazing_pools","camping"],
        default:"trending",
    },
});

//Post mongoose middleware 
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({_id : {$in: listing.reviews}});
    }
});

const Listing = mongoose.model ("Listing", listingSchema);
module.exports = Listing; 