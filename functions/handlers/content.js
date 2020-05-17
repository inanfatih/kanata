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

// postMainImage,
// postImageList,

// app.post('/image/:contentId/thumbnail', FBAuth, postThumbnail);
// postThumbnail,
exports.postThumbnail = (req, res) => {
  const BusBoy = require('busboy');
  const path = require('path'); //default package that is installed in any node project
  const os = require('os');
  const fs = require('fs'); //file system

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname);
    console.log(filename);
    console.log(mimetype);

    if (
      mimetype !== 'image/jpg' &&
      mimetype !== 'image/png' &&
      mimetype !== 'image/jpeg'
    ) {
      return res.status(400).json({ error: 'Wrong file type' });
    }

    //image.png
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    imageFileName = `${req.params.contentId}-thumbnail.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on('finish', () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`; // burada path'in sonuna alt=media eklemeyince o media'yi browser'da gosterebiliyoruz. Eklemezsek, browser onu indiriyor

        return db
          .doc(`/content/${req.params.contentId}`)
          .update({ thumbnail: imageUrl });
      })
      .then(() => {
        return res.json({
          message: 'Thumbnail Image uploaded successfully',
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });

  busboy.end(req.rawBody);
};

// app.post('/image/:contentId/mainImage', FBAuth, postMainImage);
// postMainImage,
exports.postMainImage = (req, res) => {
  const BusBoy = require('busboy');
  const path = require('path'); //default package that is installed in any node project
  const os = require('os');
  const fs = require('fs'); //file system

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname);
    console.log(filename);
    console.log(mimetype);

    if (
      mimetype !== 'image/jpg' &&
      mimetype !== 'image/png' &&
      mimetype !== 'image/jpeg'
    ) {
      return res.status(400).json({ error: 'Wrong file type' });
    }

    //image.png
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    imageFileName = `${req.params.contentId}-main.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on('finish', () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`; // burada path'in sonuna alt=media eklemeyince o media'yi browser'da gosterebiliyoruz. Eklemezsek, browser onu indiriyor

        return db
          .doc(`/content/${req.params.contentId}`)
          .update({ mainImage: imageUrl });
      })
      .then(() => {
        return res.json({
          message: 'Main Image uploaded successfully',
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });

  busboy.end(req.rawBody);
};

// app.post('/image/:contentId/imageList/:index', FBAuth, postImageList);
exports.postImageList = (req, res) => {
  const BusBoy = require('busboy');
  const path = require('path'); //default package that is installed in any node project
  const os = require('os');
  const fs = require('fs'); //file system

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname);
    console.log(filename);
    console.log(mimetype);

    if (
      mimetype !== 'image/jpg' &&
      mimetype !== 'image/png' &&
      mimetype !== 'image/jpeg'
    ) {
      return res.status(400).json({ error: 'Wrong file type' });
    }

    //image.png
    // const imageExtension = filename.split('.')[filename.split('.').length - 1];
    // imageFileName = `${Math.round(Math.random() * 10000000)}.${imageExtension}`;
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    imageFileName = `${req.params.contentId}-list${req.params.index}.${imageExtension}`;

    // imageFileName = req.params.contentId + '.list' + req.params.index;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on('finish', () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`; // burada path'in sonuna alt=media eklemeyince o media'yi browser'da gosterebiliyoruz. Eklemezsek, browser onu indiriyor

        let contentRef = db.collection('content').doc(req.params.contentId);

        return contentRef.update({
          imageList: admin.firestore.FieldValue.arrayUnion(imageUrl),
        });
      })
      .then(() => {
        return res.json({
          message: 'Image List uploaded successfully',
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });

  busboy.end(req.rawBody);
};

exports.deleteContent = (req, res) => {
  const document = db.doc(`/content/${req.params.contentId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(400).json({ error: 'Content not found' });
      }
      return document.delete();
    })
    .then(async () => {
      const bucket = admin.storage().bucket();
      await bucket.deleteFiles({
        prefix: `${req.params.contentId}/`,
      });

      // // Create a reference to the file to delete
      // var imageRef = firebase.storage().child('example.jpg');

      // // Delete the file
      // imageRef
      //   .delete()
      //   .then(function () {
      //     // File deleted successfully
      //   })
      //   .catch(function (error) {
      //     // Uh-oh, an error occurred!
      //   });
      res.json({ message: 'Content deleted successfuly' });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};
