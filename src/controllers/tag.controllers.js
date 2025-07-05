require('dotenv').config();
const Tag = require('../db/models/tag');
const Post = require('../db/models/post');
const redisClient = require('../db/config/redis.js');
const TTL = process.env.TTL || 60

const getTag = async (req, res) =>{
  try {
    const cacheKey = `tag:${req.params.id}`
    const cached = await redisClient.get(cacheKey)
    if(cached){
      return res.status(200).json(JSON.parse(cached))
    }
    const id = req.params.id
    const tag = await Tag.findById(id).select('-__v');
    await redisClient.set(cacheKey, JSON.stringify(tag), { EX: TTL })
    res.status(200).json(tag);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener la etiqueta', error: error.message });
  }
}

const getAllTags = async (req,res) => {
  try {
    const cacheKey = `tag:${req.params.id}`
    const cached = await redisClient.get(cacheKey)
    if(cached){
      return res.status(200).json(JSON.parse(cached))
    }
    const tags = await Tag.find().select('-__v');
    await redisClient.set(cacheKey, JSON.stringify(tags), { EX: TTL })
    res.status(200).json(tags)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}

const createTag = async (req, res) =>{
    try {
        const newTag = new Tag(req.body)
        await newTag.save()
        await redisClient.del('tag:all')
        res.status(201).json(newTag);
      } catch (error) {
        res.status(400).json({ message: 'Error al crear el tag', error: error.message });
      }
}

const updateTag = async (req, res) =>{
    try {
        const tagActualizado = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-__v');
        await redisClient.del(`tag:${req.params.id}`)
        await redisClient.del('tag:all')
        res.status(200).json(tagActualizado);
      } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el tag', error: error.message });
      }
}

const deleteTag = async (req, res) =>{
    try {
      const tagId = req.params.id;
      const tagBorrado = await Tag.findByIdAndDelete(tagId);
      await redisClient.del(`tag:${req.params.id}`)
      await redisClient.del('tag:all')
      res.status(200).json({ message: 'Tag eliminado con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el tag', error: error.message });
    }
}


const addAllTagsToPost = async (req, res) => {
  try {
    const idPostABuscar = req.params.id;
    const post = await Post.findById(idPostABuscar).select('-__v');
    const tagIdsToAdd = [];
    for (const element of req.body) {
      const tag = await Tag.findById(element.id).select('-__v');
      if (tag && !post.tags.includes(tag._id)) {
        tagIdsToAdd.push(tag);
      }
    }
    post.tags.push(...tagIdsToAdd);
    await post.save();
    await redisClient.del(`tag:${req.params.id}`)
    await redisClient.del('tag:all')
    res.status(201).json(post);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const getTagsToPost = async (req,res) => {
  try {
    const cacheKey = `tag:all`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached)).filter(element => element.post == req.params.id)
    }
    const idPost = req.params.id
    const tags = await (Post.findById(idPost).populate('tags')).select('-__v');
    await redisClient.set(cacheKey, JSON.stringify(tags), { EX: TTL})
    res.status(200).json(tags);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {createTag,updateTag,deleteTag,addAllTagsToPost, getTag, getAllTags, getTagsToPost};