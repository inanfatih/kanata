const { db } = require('../util/admin');

exports.getAllVideos = (req, res) => {
  db.collection('videos')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      let videos = [];
      data.forEach((doc) => {
        videos.push({
          videoId: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          videoUrl: doc.data().videoUrl,
          image: doc.data().image,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(videos);
    })
    .catch((err) => console.error(err));
};
