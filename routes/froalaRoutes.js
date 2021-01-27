const express = require("express");
const FroalaEditor = require("wysiwyg-editor-node-sdk/lib/froalaEditor.js");

const keys = require("../config/keys");

const router = express.Router();

router.get("/api/froala/get-s3-signature", async (req, res, next) => {
  const { accountId } = req.query;
  var configs = {
    // The name of your bucket.
    bucket: "eventscape-assets",

    // S3 region. If you are using the default us-east-1, it this can be ignored.
    region: "us-east-1",

    // The folder where to upload the images.
    keyStart: "froala-uploads/account-" + accountId + "/",

    // File access.
    acl: "public-read",

    // AWS keys.
    accessKey: keys.awsAccessKey,
    secretKey: keys.awsSecretKey,
  };

  var s3Hash = FroalaEditor.S3.getHash(configs);

  res.send(s3Hash);
});

router.post("/api/froala/delete-image", async (req, res, next) => {
  const { src } = req.body;

  // TODO: delete image from S3 using the AWS api
  // Froala doesn't have thea ability to do this
});

module.exports = router;
