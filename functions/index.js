const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/FbAuth.js');

const cors = require('cors');
app.use(cors());

const { getContents, getContent, postContent } = require('./handlers/content');

const { login } = require('./handlers/users');

app.get('/content/:contentId', getContent);
app.get('/content', getContents);
app.post('/content', FBAuth, postContent);

app.post('/login', login);

exports.api = functions.https.onRequest(app);
