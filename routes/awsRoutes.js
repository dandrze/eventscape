const AWS = require("aws-sdk");
const express = require("express");

const router = express.Router();

const requireAuth = require("../middlewares/requireAuth");

// Create S3 service object
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const bucketParams = {
  Bucket: "eventscape-assets",
};

router.get("/api/aws/s3/background-images", async (req, res, next) => {
  const { userId } = req.query;

  console.log(userId);

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

        // filter based on images in the folder: user-uploads/user-{userid}
        const userImageKeys = imageKeys.filter(
          (key) =>
            key.split("/")[0] === `user-uploads` &&
            key.split("/")[1] === `user-${userId}`
        );

        // append the aws s3 link to the start of the key to create a complete url
        const freeImageUrls = freeImageKeys.map(
          (key) => `https://eventscape-assets.s3.amazonaws.com/${key}`
        );

        const userImageUrls = userImageKeys.map(
          (key) => `https://eventscape-assets.s3.amazonaws.com/${key}`
        );

        //first item in the free array is the root of the folder so only return images
        res.json({
          freeImages: freeImageUrls.slice(1),
          userImages: userImageUrls,
          all: imageKeys,
        });
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
