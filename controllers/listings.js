const Listing = require("../models/listing");

// module.exports.index = async (req , res) => {
//    const allListings = await Listing.find({});
//    res.render("listings/index.ejs" , { allListings });
// }; 

module.exports.index = async (req, res) => {
    const { category , search } = req.query;
    let filter = {};
    if(category && category !== "all") {
        filter.category = category;
    } 
    if(search && search.trim() !== "") {
        filter.title = new RegExp(search.trim(), "i");
    }

    const allListings = await Listing.find(filter);

    res.render("listings/index.ejs" , { allListings, selectedCategory: category || "all" , searchQuery: search || "",});
};

module.exports.renderNewForm = (req , res) => {
    const categories = Listing.schema.path("category").enumValues; 
    res.render("listings/new.ejs" , { categories });
};

module.exports.showListing = async (req , res ) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews",populate: { path: "author"},}).populate("owner").populate("category");
    if(!listing) {
        req.flash("error" , "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}; 

module.exports.createListing = async (req , res, next) => {
    let url = req.file.path;
    const fullfilename = req.file.filename;
    const actualFilename = fullfilename.split("/").pop();
    const { listing } = req.body;

    const validCategories = Listing.schema.path("category").enumValues;
    
    if(!validCategories.includes(listing.category)) {
        req.flash("error" ,"Invalid category selected!");
        return res.redirect("/listings/new");
    }

    console.log(req.body.listing);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url , filename: actualFilename };
    await newListing.save();
    console.log("Saved listing:", newListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req , res) => { 
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error" , "Listing you requested for does not exist!");
       return res.redirect("/listings");
    }
    const categories = Listing.schema.path("category").enumValues;
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing , originalImageUrl , categories });
};


module.exports.updateListing = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing });
    
    if( typeof req.file !== "undefined") { 
    let url = req.file.path;
    let fullfilename = req.file.filename;
    const actualFilename = fullfilename.split("/").pop();
    listing.image = { url, filename: actualFilename };
    await listing.save();
    }
    req.flash("success", "Listing Updated successfully!");
    if(!listing) {
    req.flash("error" , "Listing you requested for does not exist!");
       return res.redirect("/listings");
    }
    res.redirect(`/listings/${id}`);
};


//delete Listing 

module.exports.destroyListing = async (req , res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};