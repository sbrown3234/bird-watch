(function() {
  var spicedPg = require('spiced-pg');
  var db = spicedPg('postgres:postgres:postgres:psql@localhost:5432/images');
  const config = require('./config.json');

  exports.getRecent = () => {
    return db.query('SELECT * FROM images;').then((results) => {
      results.rows.forEach((row) => {
        row.image = config.s3Url + row.image;
      })
      return results.rows;
    }).catch((err) => {
      console.log('getRecent err: ', err);
    });
  };

  exports.insertPic = (data, file) => {
    const q = `INSERT INTO images (title, username, observations, image) VALUES ($1, $2, $3, $4) RETURNING *`
    const params = [data.title, data.username, data.observations, file];
    return db.query(q,params).then((results) => {
      return results.rows
    }).catch((err) => {
      console.log('insertPic err: ', err);
    })
  }

  exports.getImage = (id) => {
    const q = `SELECT * FROM images WHERE id=$1;`
    const params = [id];
    return db.query(q,params).then((results) => {
      return results.rows[0]
    }).catch((err) => {
      console.log('getImage err: ', err);
    })
  }

  exports.insertComment = (data, id) => {
    const q = `INSERT INTO comments (username, comment, pic_id) VALUES ($1, $2, $3) RETURNING *;`;
    const params = [data.username, data.comment, id];
    return db.query(q,params).then((results) => {
      return results.rows[0]
    }).catch((err) => {
      console.log('insertComm err: ', err);
    })
  }

  exports.getComments = (id) => {
    const q = `SELECT * FROM comments
    WHERE pic_id=$1
    ORDER BY created_at DESC;`
    const params = [id];
    return db.query(q, params).then((results) => {
      return results.rows
    }).catch((err) => {
      console.log('getComm err: ', err);
    })
  }

})()
