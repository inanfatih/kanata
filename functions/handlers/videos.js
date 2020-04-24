const { db } = require('../util/admin');

exports.getContents = (req, res) => {
  db.collection('content')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      let content = [];
      data.forEach((doc) => {
        content.push({
          contentId: doc.id,
          title: doc.data().title,
          subTitle: doc.data().subTitle,
          type: doc.data().type,
          description: doc.data().description,
          videoUrl: doc.data().videoUrl,
          image: doc.data().image,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(content);
    })
    .catch((err) => console.error(err));
};

exports.postContent = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ body: 'Body must not be empty' });
  }
  if (req.body.body.title() === '') {
    return res.status(400).json({ body: 'title must not be empty' });
  }
  if (req.body.body.type() === '') {
    return res.status(400).json({ body: 'type must not be empty' });
  }
  if (req.body.body.description() === '') {
    return res
      .status(400)
      .json({ description: 'description must not be empty' });
  }
  if (req.body.body.image() === '') {
    return res.status(400).json({ body: 'image must not be empty' });
  }

  const newContent = {
    title: req.body.title,
    subTitle: req.body.subTitle,
    type: req.body.type,
    description: req.body.description,
    videoUrl: req.body.videoUrl,
    image: req.body.image,
    createdAt: new Date().toISOString(),
  };
  db.collection('content')
    .add(newContent)
    .then((doc) => {
      const resContent = newContent;
      resContent.contentId = doc.id;
      res.json({ resContent });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
};
