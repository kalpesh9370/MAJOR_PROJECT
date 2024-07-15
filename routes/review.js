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
const {isLoggedIn,isOwner,isReviewAurthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js")



//Reviews
//post route
router.post("/",
  isLoggedIn,
  
  wrapAsync(reviewController.createReview ));
  
  //Delete review route
  router.delete("/:reviewId",
    isLoggedIn,
    isReviewAurthor,
    wrapAsync(reviewController.deleteReview)
  )

  module.exports = router;