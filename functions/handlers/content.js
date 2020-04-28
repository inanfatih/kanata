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
          subtitle: doc.data().subtitle,
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

exports.getContent = (req, res) => {
  let contentData = {};
  db.doc(`/content/${req.params.contentId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Content Not Found' });
      }
      contentData = doc.data();
      contentData.contentId = doc.id;
      return res.json(contentData);
      // return db
      //   .collection('content')
      //   .orderBy('createdAt', 'desc')
      //   .where('contentId', '==', req.params.contentId)
      //   .get();
    })
    // .then(() => {
    //   return res.json(contentData);
    // })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
};

exports.postContent = (req, res) => {
  if (req.body.title.trim() === '') {
    return res.status(400).json({ body: 'title must not be empty' });
  }

  if (req.body.description.trim() === '') {
    return res.status(400).json({ body: 'description must not be empty' });
  }
  if (req.body.image.trim() === '') {
    return res.status(400).json({ body: 'image must not be empty' });
  }

  const newContent = {
    title: req.body.title,
    subtitle: req.body.subtitle,
    type: req.body.type,
    description: req.body.description,
    videoUrl: req.body.videoUrl,
    image: req.body.image,
    createdAt: new Date().toISOString(),
  };
  db.collection('content')
    .add(newContent)
    .then((doc) => {
      const content = newContent;
      content.contentId = doc.id;
      return res.json({ content });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err });
    });
};
