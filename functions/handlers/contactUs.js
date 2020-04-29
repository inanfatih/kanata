const { db } = require('../util/admin');

exports.contactUs = (req, res) => {
  if (req.body.message.trim() === '') {
    return res.status(400).json({ message: 'Please enter your message' });
  }

  if (req.body.name.trim() === '') {
    return res.status(400).json({ name: 'Please enter your name' });
  }

  if (req.body.phone.trim() === '') {
    return res.status(400).json({ phone: 'Please enter your phone' });
  }

  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!req.body.email.match(regEx)) {
    return res.status(400).json({ email: 'Email is not valid' });
  }

  const newMessage = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message,
    createdAt: new Date().toISOString(),
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
