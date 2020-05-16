const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/FbAuth.js');

const cors = require('cors');
app.use(cors());

const {
  getContents,
  getContent,
  postContent,
  get2d3d,
  getSocialMedia,
  getVideos,
  postThumbnail,
  postMainImage,
  postImageList,
} = require('./handlers/content');
const { contactUs } = require('./handlers/contactUs');

const { login } = require('./handlers/users');

app.get('/content/:contentId', getContent);
app.get('/content', getContents);
app.get('/2d3d', get2d3d);
app.get('/social-media', getSocialMedia);
app.get('/videos', getVideos);
app.post('/contact', contactUs);
app.post('/content', FBAuth, postContent);
app.post('/image/:contentId/thumbnail', FBAuth, postThumbnail);
app.post('/image/:contentId/mainImage', FBAuth, postMainImage);
app.post('/image/:contentId/imageList/:index', FBAuth, postImageList);

app.post('/login', login);

exports.api = functions.https.onRequest(app);
