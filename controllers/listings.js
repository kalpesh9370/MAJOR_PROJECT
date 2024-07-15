const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }

  module.exports.renderNewForm = (req, res) => {
    console.log("User:", req.user); // Check if user is properly populated
    console.log("Is Authenticated:", req.isAuthenticated()); // Check authentication status
  
    res.render("listings/new.ejs");
  }
  module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path:"reviews",
      populate:{
        path:"aurthor"
      },
    })
    .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }

  module.exports.createListing =async (req, res, next) => {
    let url= req.file.path;
    let filename= req.file.filename;
    console.log(url,"..",filename);

    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }
    const newListing = new Listing(req.body.listing);
    if (!newListing.title) {
      throw new ExpressError(400, "Title is Missing");
    }
    if (!newListing.description) {
      throw new ExpressError(400, "Description is Missing");
    }
    if (!newListing.price) {
      throw new ExpressError(400, "Price is Missing");
    }
    if (!newListing.country) {
      throw new ExpressError(400, "Country is Missing");
    }
    if (!newListing.location) {
      throw new ExpressError(400, "Location is Missing");
    }
  
    newListing.owner = req.user._id;    
    newListing.image = {url, filename};
    await newListing.save();
    req.flash('success', "New listing created!");
    res.redirect("/listings");
  }
  module.exports.editListing =async (req, res) => {
    let { id } = req.params;
     
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  }
  module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params;
    
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
    let url= req.file.path;
    let filename= req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
  }
  module.exports.deleteListing =async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  }
 