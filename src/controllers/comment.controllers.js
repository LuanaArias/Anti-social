require('dotenv').config();
const Comment = require('../db/models/comment');
const Post = require('../db/models/post')
const redisClient = require('../db/config/redis.js');
const TTL = process.env.TTL || 60

const getComment = async (req, res) => {
  try {
    const cacheKey = `comment:${req.params.id}`
    const cached = await redisClient.get(cacheKey)
    if(cached){
      return res.status(200).json(JSON.parse(cached))
    }
    const data = await Comment.findById(req.params.id).select('-__v').populate('user');
    await redisClient.set(cacheKey, JSON.stringify(data), { EX: TTL })
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllComments = async (req, res) => {
    try {
      const cacheKey = 'comment:all'
      const cached = await redisClient.get(cacheKey)
      if(cached){
        return res.status(200).json(JSON.parse(cached))
      }
      const data = await Comment.find().select('-__v');
      await redisClient.set(cacheKey, JSON.stringify(data), { EX: TTL })
      res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const createComment = async (req, res) => {
  try {
    const postId = req.params.id; 
    const { comentario } = req.body;  
    if (!comentario) {
      return res.status(400).json({ error: 'El contenido del comentario es obligatorio.' });
    }
    const post = await Post.findById(postId).populate('user').select('-__v');
    const newComment = new Comment({
      comentario,
      post: post._id,
      user: post.user._id, 
    });
    await newComment.save();
    post.comment.push();
    await redisClient.del('comment:all')
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateComment = async (req, res) => {
  try {
    const commentBuscado = await Comment.findByIdAndUpdate(
      req.params.id,
      { comentario: req.body.comentario },
      { new: true, runValidators: true }
    ).select('-__v');
    await redisClient.del(`comment:${req.params.id}`)
    await redisClient.del('comment:all')
    res.status(200).json({ message: "Comentario modificado con éxito", comment: commentBuscado });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteComment = async (req, res) => {
  try {
    const id = req.params.id
    const commentBuscado = await Comment.findByIdAndDelete(id);
    
    await Post.findByIdAndUpdate(commentBuscado.post, {
      $pull: { comments: commentBuscado._id }
    });
    await redisClient.del(`comment:${id}`)
    await redisClient.del('comment:all')
    res.status(200).json({ message: "Comentario borrado con éxito" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllPostComment = async (req, res) => {
  try {
    const cacheKey = 'comment:all'
    const cached = await redisClient.get(cacheKey)

    if(cached){
      return res.status(200).json(JSON.parse(cached)).filter( element => element.post == req.params.id)
    } 
    const comments = await Comment.find({ post: req.params.id }).select('-__v').populate('user');
    await redisClient.set(cacheKey, JSON.stringify(comments), { EX: TTL })
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {getComment,createComment,updateComment,deleteComment, getAllPostComment, getAllComments};