require('dotenv').config();
const Post = require('../db/models/post');
const User = require('../db/models/user');
const Comment = require('../db/models/comment');
const Post_Image = require('../db/models/post_image');
const Tag = require('../db/models/tag');
const redisClient = require('../db/config/redis.js');
const TTL = process.env.TTL || 60

const getPost = async (req,res) => {
  try {
    const cacheKey = `post:${req.params.id}`
    const cached = await redisClient.get(cacheKey)
    if(cached){
      return res.status(200).json(JSON.parse(cached))
    }
    const id = req.params.id
    const postBuscado = await Post.findById(id).select('-__v').populate('comment').populate('image').populate('tags');
    await redisClient.set(cacheKey, JSON.stringify(postBuscado), { EX: TTL })
    res.status(200).json(postBuscado);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener el post', error: error.message });
  }
};

const getAllPosts = async (req,res) => {
  try {
    const cacheKey = 'post:all'
    const cached = await redisClient.get(cacheKey)
    if(cached){
      return res.status(200).json(JSON.parse(cached))
    }
    const posts = await Post.find().select('-__v').populate('comment').populate('image').populate('tags');
    if(posts.length > 0){
      await redisClient.set(cacheKey, JSON.stringify(posts), { EX: TTL })
      res.status(200).json(posts);
    } else {
      res.status(400).json({error: 'No existen posteos'});
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los posts', error: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { contenido, nickName } = req.body;
    const user = await User.findOne({ nickName }).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado con ese nickName' });
    }
    const newPost = new Post({
      contenido,
      user: user._id
    });
    await newPost.save();
    await redisClient.del('post:all')
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({
      message: 'Hubo un error al crear el post',
      error: error.message
    });
  }
};

const updatePost = async (req, res) =>{
  try {
    const id = req.params.id
    const postBuscado = await Post.findByIdAndUpdate(id, req.body, { new: true }).select('-__v');
    await redisClient.del(`post:${req.params.id}`)
    await redisClient.del('post:all')
    res.status(200).json({message: "Post actualizado con exito", post: postBuscado});
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el post', error: error.message });
  }
}

const deletePost = async (req, res) =>{
  try {
    const id = req.params.id
    const postBuscado = await Post.findByIdAndDelete(id)
    await redisClient.del(`post:${id}`)
    await redisClient.del('post:all')
    res.status(200).json({ message: 'Post eliminado con éxito' }); 
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const getAllUserPost = async (req, res) => {
  try {
    const cacheKey = 'post:all'
    const cached = await redisClient.get(cacheKey)
    if(cached){
      return res.status(200).json(JSON.parse(cached)).filter( element => element.post == req.params.id)
    } 
    const idUser = req.params.id;
    const posts = await Post.find({ user: idUser }).populate('tags');
    if(posts){
      await redisClient.set(cacheKey, JSON.stringify(posts), { EX: TTL })
      res.status(200).json(posts);
    } else {
      res.status(400).json({message:`No existen post del usuario ${idUser}`})
    }
      
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {getPost, createPost, updatePost,deletePost, getAllUserPost, getAllPosts};