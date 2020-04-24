const { admin, db } = require('./admin');

module.exports = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ') //Conventional olarak token, "Bearer " ile basliyor
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(() => {
      return next();
    })
    .catch((err) => {
      console.error('Error while verifying token ', err);
      return res.status(403).json(err);
    });
};
