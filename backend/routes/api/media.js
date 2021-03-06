// backend/routes/api/media.js
const express = require('express');
const aws = require('aws-sdk');


const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Medium } = require('../../db/models');

const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = 'us-east-1';

const router = express.Router();

router.get('/sign-s3', asyncHandler(async (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };
  
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      // console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.json(returnData)
  });
}));

router.post('/save-details', (req, res) => {
  // TODO: Read POSTed form data and do something useful
  res.json("success!");
});

router.post('/',
  // requireAuth,
  asyncHandler(async (req, res) => {
    const mediumDataObj = req.body.medium;
    // console.log('mediumDataObj', mediumDataObj);
    // if (req.user.id !== mediumDataObj.userId) {
    //   return res.status(401).json({ error: "Unauthorized user" });
    // }
    //TODO: implement backend medium validation before attempting to create a row in database
    try{
      const medium = await Medium.create(mediumDataObj);
      res.json({ medium });
    } catch (error) {
      return res.status(401).json({ error });
    }
  })
);

module.exports = router;