require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Post_Image = require('../db/models/post_image');
const Post = require('../db/models/post');
const redisClient = require('../db/config/redis.js');
const TTL = process.env.TTL || 60

const getImg = async (req, res) => {
  try {
    const cacheKey = `image:${req.params.id}`
    const cached = await redisClient.get(cacheKey)
    if(cached){
      return res.status(200).json(JSON.parse(cached))
    }
    const id = req.params.id
    const image = await Post_Image.findById(id).select('-__v'); 
    await redisClient.set(cacheKey, JSON.stringify(image), { EX: TTL })
    res.status(200).json(image);
  } catch (error){
    res.status(500).json({ message: 'Error al buscar la imagen', error: error.message });
  }
};

const getAllImages = async (req,res) => {
  try {
    const cacheKey = 'image:all'
    const cached = await redisClient.get(cacheKey)
    if(cached){
      return res.status(200).json(JSON.parse(cached))
    }
    const images = await Post_Image.find().select('-__v');
    if(images.length > 0){
      await redisClient.set(cacheKey, JSON.stringify(images), { EX: TTL })
      res.status(200).json(images);
    } else {
      res.status(400).json({error: 'No existen imagenes'});
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las imagenes', error: error.message });
  }
};
 
const addImage = async (req, res) =>{
  try {
    const id = req.params.id
    const post = await Post.findById(id).select('-__v');
    const newImage = new Post_Image({ url: req.body.url });
    await newImage.save();
    post.image.push(newImage._id);
    await post.save();
    await redisClient.del('image:all')
    res.status(201).json(newImage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const addAllImages = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id).select('-__v');

    if (!Array.isArray(req.body)) {
      return res.status(400).json({ message: "El cuerpo de la petición debe ser un arreglo" });
    }

    const folderPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const savedImages = [];
    const failedImages = [];

    for (const element of req.body) {
      if (element.url && typeof element.url === "string") {
        try {
          const { fileName } = await downloadImage(element.url, folderPath);
          const relativePath = `/uploads/${fileName}`;
          const newImage = new Post_Image({ url: element.url });
          await newImage.save();
          post.image.push(newImage._id);
          savedImages.push(newImage);
        } catch (error) {
          failedImages.push({
            url: element.url,
            error: error.message,
          });
        }
      } else {
        failedImages.push({
          url: element.url,
          error: "URL inválida o no es string",
        });
      }
    }

    await post.save();
    await redisClient.del(`image:${req.params.id}`);
    await redisClient.del('image:all');

    return res.status(201).json({
      message: "Proceso de subida finalizado",
      exitosas: savedImages.length,
      fallidas: failedImages.length,
      errores: failedImages,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateImage = async (req, res) =>{
  try {
    const id = req.params.id
    const imageBuscada = await Post_Image.findByIdAndUpdate(id, req.body, { new:true }).select('-__v');
    await redisClient.del(`image:${req.params.id}`)
    await redisClient.del('image:all')
    res.status(201).json({message: "Imagen modificada con exito", image: imageBuscada});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
const deleteImage = async (req, res) =>{
  try {
    const id = req.params.id
    const imageBuscada = await Post_Image.findByIdAndDelete(id)
    await redisClient.del(`image:${id}`)
    await redisClient.del('image:all')
    res.status(201).json({message: "Imagen borrada con exito"});
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}
const getAllPostImage = async (req,res) => {
  try{
    const cacheKey = 'image:all'
    const cached = await redisClient.get(cacheKey)
    if(cached){
      return res.status(200).json(JSON.parse(cached)).filter( element => element.post == req.params.id)
    } 
    const idPost = req.params.id
    const postBuscado = await Post.findById(idPost).select('-__v').populate('image');
    await redisClient.set(cacheKey, JSON.stringify(postBuscado), { EX: TTL })
    res.status(201).json(postBuscado)
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};


const downloadImage = async (url, folderPath) => {
  const fileName = Date.now() + '-' + Math.floor(Math.random() * 10000) + path.extname(url.split('?')[0]);
  const filePath = path.join(folderPath, fileName);

  const response = await axios({
    method: 'GET',
    url,
    responseType: 'stream'
  });

  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve({ filePath, fileName }));
    writer.on('error', reject);
  });
};

module.exports = {getImg,addImage,addAllImages,updateImage,deleteImage,getAllPostImage, getAllImages  };