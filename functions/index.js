const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/FbAuth.js');

const cors = require('cors');
app.use(cors());
const { db } = require('./util/admin');

const { getContents, postContent } = require('./handlers/videos');

app.get('/content', getContents);
app.post('/content', FBAuth, postContent);

exports.api = functions.https.onRequest(app);
