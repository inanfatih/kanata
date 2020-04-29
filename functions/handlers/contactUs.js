const { db } = require('../util/admin');

const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

exports.contactUs = (req, res) => {
  if (req.body.message.trim() === '') {
    return res.status(400).json({ message: 'message must not be empty' });
  }

  if (req.body.name.trim() === '') {
    return res.status(400).json({ name: 'name must not be empty' });
  }

  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!req.body.email.match(regEx)) {
    return res.status(400).json({ email: 'email is not valid' });
  }

  const newMessage = {
    createdAt: new Date().toISOString(),
    name: req.user.name.trim(),
    email: req.user.email.trim(),
    phone: req.user.phone.trim(),
    message: req.user.message.trim(),
  };

  db.collection('contactUsMessages')
    .add(newMessage)
    .then((doc) => {
      const message = newMessage;
      message.messageId = doc.id;
      return res.json({ message });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err });
    });
};
