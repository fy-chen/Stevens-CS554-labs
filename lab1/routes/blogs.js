const express = require('express');
const router = express.Router();
const data = require('../data');
const blogData = data.blogs;
const userData = data.users;

router.get('/logout', async (req, res) => {
  req.session.destroy();
  res.json({ logout: true });
});

router.get('/', async (req, res) => {
  try {
    const bloglist = await blogData.getAllBlogs();
    if(req.query.skip) {
      let skip = Number(req.query.skip);
      if(isNaN(skip)){
        res.status(500).json({error: "skip should be a number"});
        return;
      }
      res.json(bloglist.slice(skip, skip + 20));
      return;
    }else if(req.query.take) {
      let take = Number(req.query.take);
      if(isNaN(take)){
        res.status(500).json({error: "take should be a number"});
        return;
      }
      res.json(bloglist.slice(0, take));
      return;
    }
    res.json(bloglist.slice(0, 20));
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await blogData.getBlogById(req.params.id);
    res.json(blog);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.post('/', async (req, res) => {
  let body = req.body;

  try {
    blogData.isAppropriateString(body.title, 'title');
    blogData.isAppropriateString(body.body, 'body');
    if(!req.session.user) throw 'not logged in';
  } catch (e) {
    res.status(500).json({error: e});
  }

  try {
    const blog = await blogData.createBlogs(body.title, body.body, req.session.user._id.toString());
    res.json(blog);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.put('/:id', async (req, res) => {
  let body = req.body;

  try {
    if(!req.session.user) throw 'not logged in';
    await blogData.getBlogById(req.params.id);
    blogData.isAppropriateString(body.title, 'title');
    blogData.isAppropriateString(body.body, 'body');
    await blogData.checkBlogUserId(req.params.id, req.session.user._id.toString());
  } catch (e) {
    res.status(500).json({error: e});
  }

  try {
    const updatedBlog = await blogData.updateBlogs(req.params.id, body.title, body.body, req.session.user._id.toString());
    res.json(updatedBlog);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.patch('/:id', async (req, res) => {
  let body = req.body;

  let blog = {};

  let title = '';
  let blogBody = '';

  try {
    if(!req.session.user) throw 'not logged in';

    blog = await blogData.getBlogById(req.params.id);

    title = blog.title;
    blogBody = blog.body;

    if(body.title){
      blogData.isAppropriateString(body.title, 'title');
      title = body.title;
    }
    if(body.body){
      blogData.isAppropriateString(body.body, 'body');
      blogBody = body.body;
    }

    await blogData.checkBlogUserId(req.params.id, req.session.user._id.toString());
  } catch (e) {
    res.status(500).json({error: e});
  }

  try {
    const updatedBlog = await blogData.updateBlogs(req.params.id, title, blogBody, req.session.user._id.toString());
    res.json(updatedBlog);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.post('/:id/comments', async (req, res) => {
  let body = req.body;

  try {
    blogData.isAppropriateString(body.comment, 'comment');
    if(!req.session.user) throw 'not logged in';
    await blogData.getBlogById(req.params.id);
  } catch (e) {
    res.status(500).json({error: e});
  }

  try {
    const blog = await blogData.createComments(req.params.id, req.session.user._id.toString(), body.comment);
    res.json(blog);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.delete('/:blogId/:commentId', async (req, res) => {
  try {
    if(!req.session.user) throw 'not logged in';
    await blogData.getBlogById(req.params.blogId);
    await blogData.checkCommentUserId(req.params.blogId, req.params.commentId, req.session.user._id.toString());
  } catch (e) {
    res.status(500).json({error: e});
  }

  try {
    const deleteInfo = await blogData.deleteComments(req.params.blogId, req.params.commentId, req.session.user._id.toString());
    res.json(deleteInfo);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.post('/signup', async (req, res) => {
  let body = req.body;

  try {
    userData.areAppropriateParameters(body.username, body.password);

    if(!body.name){
      throw "name not provided";
    }else if(typeof(body.name) !== 'string'){
      throw "provided name is not a string";
    }else if(body.name.trim().length === 0){
      throw "provided name cannot be empty";
    }

  } catch (e) {
    res.status(500).json({errors: e});
  }

  try {
    const user = await userData.createUser(body.name, body.username, body.password);
    res.json(user);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.post('/login', async (req, res) => {

  let body = req.body;

  try{
    if(req.session.user) throw "Already logged in";
    userData.areAppropriateParameters(body.username, body.password);
  } catch (e) {
    res.status(500).json({error: e});
  }

  try {
    const user = await userData.checkUser(body.username, body.password);
    if(user) {
      req.session.user = { username: user.username, _id: user._id };
    }
    res.status(500).json(user);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

module.exports = router;
