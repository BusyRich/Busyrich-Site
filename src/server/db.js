const fs = require('fs'),
      mongo = require('mongodb').MongoClient,
      ejs = require('ejs'),
      marked = require('marked');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/busyrich';

module.exports = db = {};

const models = {},
      cache = {};

const setCache = function(cacheKey, data, timeout = 0) {
  cache[cacheKey] = {
    timeout,
    data
  };
};

const setCacheId = function(cacheKey, dataId, data) {
  cache[cacheKey].data[dataId] = data;
};

const getCachdeById = function(cacheKey, dataId) {
  return cache[cacheKey].data[dataId];
};

const getCachedAll = function(cacheKey) {
  return cache[cacheKey].data;
};
  
db.refreshSite =  function() {
  models.pages.find().sort({order:1}).toArray((err, docs) => {
    if(err) {
      return console.log(err);
    }

    setCache('pages', docs.reduce((map, page) => {
      let p = {...page};
      delete p._id;

      if(p.content) {
        p.content = marked(p.content.replace(/\\n/g, '\n'));
      } else {
        let file = './src/server/views/pages/' + p.slug + '.ejs';

        if(fs.existsSync(file)) {
          p.file = 'pages/' + p.slug;
          p.compiled = ejs.compile(fs.readFileSync(file, 'utf8'));
        }
      }
    
      map[p.slug] = p;
    
      return map;
    }, {}));
  });

  models.social.find().sort({order:1}).toArray((err, docs) => {
    if(err) {
      return console.log(err);
    }

    setCache('social', docs);
  });

  models.post.find().sort({posted:-1}).limit(5).toArray((err, posts) => {
    if(err) {
      return console.log(err);
    }

    const now = Date.now();
    posts.forEach(post => {
      let d = new Date(post.posted);

      post.date = d.getMonth() + '/' + (d.getFullYear().toString().substring(2));
    });

    setCache('latest', posts);
  });

  console.log('Data Refresh Requested.');
};

db.getPost = function(slug, callback) {
  let cached = getCachdeById('posts', slug);
  if(cached) {
    return callback(null, cached);
  }

  models.post.findOne({slug}, (err, post) => {
    if(!err) {
      post.content = marked(post.content);
      setCacheId('posts', post.slug, post);
    }

    callback(err, post);
  });
};

db.getPages = function() {
  return getCachedAll('pages');
};

db.getPage = function(slug) {
 return getCachdeById('pages', slug);
};

db.getSocial = function() {
  return getCachedAll('social');
};

db.getLatest = function() {
  return getCachedAll('latest');
};

mongo.connect(mongoURI, {useNewUrlParser:true},  (error, client) => {
  if(error) {
    return console.log(error);
  }

  console.log('Mongo Connected to %s!', mongoURI);
  const bdb = client.db(mongoURI.split('/').pop());
  models.pages = bdb.collection('pages');
  models.social = bdb.collection('social');
  models.post = bdb.collection('posts');

  setCache('posts', {});

  db.refreshSite();
});
