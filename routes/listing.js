const express = require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
// const {listingSchema} = require("./utils/schema.js");
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")
const app = express();

// ../MAJOR PROJECT/models/listing.js



//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }));
  
  //New Route
  router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
  });
  
  //Show Route
  router.get("/:id",wrapAsync( async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  }));
  
  //Create Route
  router.post("/", wrapAsync (async (req, res,next) => {
  
    if(!req.body.listing){
      throw new ExpressError(400, "Send valid data for listing");
    }
      const newListing = new Listing(req.body.listing);
       
      if(!newListing.title){
        throw new ExpressError(400, "Title is Missing");
      }
      if(!newListing.description){
        throw new ExpressError(400, "description is Missing");
      }
      if(!newListing.price){
        throw new ExpressError(400, "price is Missing");
      }
      if(!newListing.country){
        throw new ExpressError(400, "country is Missing");
      }
      if(!newListing.location){
        throw new ExpressError(400, "location is Missing");
      }
  
      await newListing.save();
      res.redirect("/listings");
    } 
    ));
  
  //Edit Route
  router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }));
  
  //Update Route
  router.put("/:id", wrapAsync(async (req, res) => {
    if(!req.body.listing){
      throw new ExpressError(400, "Send valid data for listing");
    }
  
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  }));
  
  //Delete Route
  router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  }));
  
  

  module.exports = router;