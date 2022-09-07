const express = require('express');
const app = express();
const session = require('express-session');
const blogData = require('./data/blogs');

const configRoutes = require('./routes');

app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}))

app.use('/blog', async (req, res, next) => {
  if (req.method == 'POST' && req.originalUrl !== '/blog/login' && req.originalUrl !== '/blog/signup'){
    if(!req.session.user) {
      return res.status(500).json({error: 'not logged in'});
    }else{
      next();
    }
  }else{
    next();
  }
});

app.use('/blog/:id', async (req, res, next) => {
  if (req.method == 'PUT' || req.method == 'PATCH'){
    if(!req.session.user) {
      return res.status(500).json({error: 'not logged in'});
    }else {
      try {
        await blogData.checkBlogUserId(req.params.id, req.session.user._id.toString());
        next();
      } catch (e) {
        return res.status(500).json({error: e});
      }
    }
  }else{
    next();
  }
});

app.use('/blog/:blogId/:commentId', async (req, res, next) => {
  
  if(req.method === 'DELETE'){
    if(!req.session.user) {
      return res.status(500).json({error: 'not logged in'});
    }else {
      try {
        await blogData.checkCommentUserId(req.params.blogId, req.params.commentId, req.session.user._id.toString());
      } catch (e) {
        return res.status(500).json({error: e});
      }
      next();
    }
  }else{
    next();
  }
});

app.use(express.json());

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});