const express = require('express'),
      app = express(),
      port = process.env.PORT || 8080,
      db = require('./src/server/db'),
      jsontoxml = require('jsontoxml');

app.set('view engine', 'ejs');
app.set('views', './src/server/views');

app.use(express.static('public'));

app.use(function(req, res, next) {
  console.log(req.url);
  next();
});

const renderPage = function(res, page = 'home', data = {}) {
  let pages = db.getPages(),
      currentPage = (typeof page === 'string' ?  pages[page] : page),
      context = {
        social: db.getSocial(),
        latest: db.getLatest(),
        pages: pages,
        currentPage,
        ...data
      };
  
  if(!res && currentPage.compiled) {
    return currentPage.compiled(context);
  } else if(res) {
    res.render('index', context);
  }  
};

app.get('/', (req, res) => {
  renderPage(res);
});

app.get('/post/:slug', (req, res) => {
  db.getPost(req.params.slug, (err, post) => {
    if(err) {
      console.log(err);
      return renderPage(res);
    }

    delete post._id;

    post.content = renderPage(null, 'post', {post});

    if(req.query.hasOwnProperty('json')) {
      res.send(post);
    } else if(req.query.hasOwnProperty('xml')) {
      res.send(jsontoxml({post}));
    } else {
      renderPage(res, 'post', {post});
    }
  });
});

app.get('/:page', (req, res) => {
  let page = db.getPage(req.params.page),
      content = page.content;

  if(page.compiled) {
    content = renderPage(null, page);
  }

  if(req.query.hasOwnProperty('json')) {
    res.send({
      ...page,
      content
    });
  } else if(req.query.hasOwnProperty('xml')) {
      res.send(jsontoxml({page}));
  } else {
    renderPage(res, page);
  }
});

app.get('*', (req, res) => {
  res.send('404');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));