const AWS = require("aws-sdk");
const express = require("express");

const router = express.Router();

const requireAuth = require("../middlewares/requireAuth");

// Create S3 service object
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const bucketParams = {
  Bucket: "eventscape-assets",
};

router.get("/api/aws/s3/free-images", async (req, res, next) => {
  //const { eventId } = req.query;

  try {
    // Call S3 to obtain a list of the objects in the bucket
    s3.listObjects(bucketParams, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        // extract all the image keys
        const imageKeys = data.Contents.map((obj) => obj.Key);

        // filter based on images in the folder: free-images
        const freeImageKeys = imageKeys.filter(
          (key) => key.split("/")[0] === "free-images"
        );

        // append the aws s3 link to the start of the key to create a complete url
        const freeImageUrls = freeImageKeys.map(
          (key) => `https://eventscape-assets.s3.amazonaws.com/${key}`
        );

        //first item in the array is the root of the folder so only return images
        res.json(freeImageUrls.slice(1));
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
