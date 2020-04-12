const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/FbAuth.js');

const cors = require('cors');
app.use(cors());
const { db } = require('./util/admin');

const { getAllVideos } = require('./handlers/videos');

app.get('/videos', getAllVideos);

exports.api = functions.https.onRequest(app);
