const express = require("express");
const router= express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
// const {listingSchema} = require("./utils/schema.js");
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")
const app = express();
const Review = require("../models/review.js")

const listings =require("../routes/listing.js")
const reviews = require("../routes/review.js")




//Reviews
//post route
router.post("/", async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
  
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
  
    res.redirect(`/listings/${listing._id}`);
  });
  
  //Delete review route
  router.delete("/:reviewId",
    wrapAsync(async (req,res)=>{
      let{id,reviewId} = req.params;
  
      await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
      await Review.findByIdAndDelete(reviewId);
  
      res.redirect(`/listings/${id}`);
    })
  )

  module.exports = router;