const { admin, db } = require('../util/admin');
const config = require('../util/config'); //fonksiyon olmadiginda config ve benzeri seyler {config}  seklinde degil de config diye parantezsiz olarak yaziliyor

exports.getContents = (req, res) => {
  db.collection('content')
    .orderBy('orderNo', 'desc')
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
          thumbnail: doc.data().thumbnail,
          mainImage: doc.data().mainImage,
          imageList: doc.data().imageList,
          createdAt: doc.data().createdAt,
          orderNo: doc.data().orderNo,
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
    })

    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
};

exports.get2d3d = (req, res) => {
  db.collection('content')
    .where('type', '==', 2)
    .orderBy('orderNo', 'desc')
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
          thumbnail: doc.data().thumbnail,
          mainImage: doc.data().mainImage,
          imageList: doc.data().imageList,
          createdAt: doc.data().createdAt,
          orderNo: doc.data().orderNo,
        });
      });
      return res.json(content);
    })
    .catch((err) => console.error(err));
};

exports.getSocialMedia = (req, res) => {
  db.collection('content')
    .where('type', '==', 1)
    .orderBy('orderNo', 'desc')
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
          thumbnail: doc.data().thumbnail,
          mainImage: doc.data().mainImage,
          imageList: doc.data().imageList,
          createdAt: doc.data().createdAt,
          orderNo: doc.data().orderNo,
        });
      });
      return res.json(content);
    })
    .catch((err) => console.error(err));
};

exports.getVideos = (req, res) => {
  db.collection('content')
    .where('type', '==', 3)
    .orderBy('orderNo', 'desc')
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
          thumbnail: doc.data().thumbnail,
          mainImage: doc.data().mainImage,
          imageList: doc.data().imageList,
          createdAt: doc.data().createdAt,
          orderNo: doc.data().orderNo,
        });
      });
      return res.json(content);
    })
    .catch((err) => console.error(err));
};

exports.postContent = (req, res) => {
  let errors = {};
  if (req.body.title.trim() === '') {
    errors.title = 'title must not be empty';
  }

  if (req.body.type === null) {
    errors.type = 'type must not be empty';
  }

  if (req.body.description.trim() === '') {
    errors.description = 'description must not be empty';
  }

  // if (req.body.thumbnail.trim() === '') {
  //   errors.thumbnail = 'thumbnail must not be empty';
  // }

  if (req.body.orderNo === null) {
    errors.orderNo = 'orderNo must not be empty';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors: errors });
  }

  const newContent = {
    title: req.body.title,
    subtitle: req.body.subtitle,
    type: req.body.type,
    description: req.body.description,
    videoUrl: req.body.videoUrl,
    thumbnail: req.body.thumbnail,
    mainImage: req.body.mainImage,
    imageList: req.body.imageList,
    createdAt: new Date().toISOString(),
    orderNo: req.body.orderNo,
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

// app.post('/image/:contentId/:imageType/:imageFileName/:index', FBAuth, updateContentWithImageLinks,);

exports.updateContentImageLinks = async (req, res) => {
  const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${req.params.contentId}%2F${req.params.imageFileName}?alt=media`; // burada path'in sonuna alt=media eklemeyince o media'yi browser'da gosterebiliyoruz. Eklemezsek, browser onu indiriyor

  if (req.params.imageType === 'thumbnail') {
    try {
      await db
        .doc(`/content/${req.params.contentId}`)
        .update({ thumbnail: imageUrl });
      return res.json({
        message: 'Thumbnail Image uploaded successfully',
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.code });
    }
  } else if (req.params.imageType === 'mainImage') {
    try {
      await db
        .doc(`/content/${req.params.contentId}`)
        .update({ mainImage: imageUrl });
      return res.json({
        message: 'mainImage uploaded successfully',
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.code });
    }
  } else {
    try {
      await db
        .doc(`/content/${req.params.contentId}`)
        .update({ imageList: admin.firestore.FieldValue.arrayUnion(imageUrl) });
      return res.json({
        message: 'mainImage uploaded successfully',
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.code });
    }
  }
};

exports.deleteContent = (req, res) => {
  const document = db.doc(`/content/${req.params.contentId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(200).json({ message: 'Content not found' });
      }
      return document.delete();
    })
    .then(async () => {
      const bucket = admin.storage().bucket();
      await bucket.deleteFiles({
        prefix: `${req.params.contentId}/`,
      });
    })
    .then(() => {
      db.collection('content')
        .orderBy('orderNo', 'desc')
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
              thumbnail: doc.data().thumbnail,
              mainImage: doc.data().mainImage,
              imageList: doc.data().imageList,
              createdAt: doc.data().createdAt,
              orderNo: doc.data().orderNo,
            });
          });
          return res.json(content);
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};
