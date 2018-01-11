(function() {
  const express = require('express');
  const app = express();
  const bodyParser = require('body-parser');
  const multer = require('multer');
  const uidSafe = require('uid-safe');
  const path = require('path');
  const db = require('./db')
  const s3 = require('./s3')
  const config = require('./config')

  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json())

  app.use(express.static(__dirname + '/public'));

  app.use(express.static(__dirname + '/uploads'));

  var diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, __dirname + '/uploads');
    },
    filename: (req, file, callback) => {
      uidSafe(24).then((uid) => {
        callback(null, uid + path.extname(file.originalname))
      })
    }
  })

  var uploader = multer({
    storage: diskStorage,
    limits: {
      fileSize: 2097152
    }
  });

  app.post('/images/:picId/comments', (req,res) => {
    const picId = req.params.picId;

    db.insertComment(req.body, picId)
  })

  app.get('/images/:picId', (req, res) => {
    const picId = req.params.picId;

    db.getImage(picId).then((image) => {

      db.getComments(picId).then((results) => {
        let comments = results
        res.json({image, comments})
      })
    }).catch((err) => {
      console.log('getImage err: ', err);
    })
  })


  app.get('/images', (req, res)=> {
    db.getRecent().then((results) => {
      res.json(results)
    }).catch((err) => {
      console.log('get err: ', err);
    })
  })



  app.post('/upload', uploader.single('file'), (req, res) => {
    if(req.file) {

      s3.upload(req.file).then(
        db.insertPic(req.body, req.file.filename).then((results) => {
          res.json(results)
        })
      ).catch((err) => {
        console.log('upload err: ', err);
      })
    }
});

  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(404).send('Page Not Found...Sorry!');
  })

  app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
  })


  app.listen(process.env.PORT || 8080, () => {
    console.log(`listening at: ${process.env.PORT} || 8080`)
  })

})()
