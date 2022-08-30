const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
require("dotenv").config()

const redis = require('redis');
const redisUrl = process.env.REDIS_URL;
const client = redis.createClient(redisUrl);
const util = require('util');
const { channel } = require('diagnostics_channel');

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    // Do we have any cached data in redis related
    // to this query
    client.get = util.promisify(client.get)
    const cachedBlogs = await client.get(req.user.id);

    // if yes then respond to the request right away and return

    if(cachedBlogs){
      console.log('Serving from cache')
      return res.send(JSON.parse(cachedBlogs));
    }

    // if no, we need to respond to request and updated our cache to store the data

    const blogs = await Blog.find({ _user: req.user.id });
    console.log('Serving from mongo')

    res.send(blogs);

    client.set(req.user.id, JSON.stringify(blogs));
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
