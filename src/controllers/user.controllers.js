require('dotenv').config();
const User = require('../db/models/user');
const redisClient = require('../db/config/redis.js');
const TTL = process.env.TTL || 60

const getUsers = async (req,res) => {
  try {
    const cacheKey = `user:${req.params.id}`
    const cached = await redisClient.get(cacheKey)
    if(cached){
      return res.status(200).json(JSON.parse(cached))
    }
    const id = req.params.id
    const user = await User.findById(id).select('-__v');
    await redisClient.set(cacheKey, JSON.stringify(user), { EX: TTL })
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
  }
};

const getAllUser = async (req,res) => {
  try {
    const cacheKey = 'user:all'
    const cached = await redisClient.get(cacheKey)
    if(cached){
      return res.status(200).json(JSON.parse(cached))
    }
    const users = await User.find()
      .select('nickName email followers following _id' )
    await redisClient.set(cacheKey, JSON.stringify(users), { EX: TTL })
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}


const createUser = async (req, res) => {
  try {
    const { nickName, email } = req.body;
    const newUser = new User({
      nickName,
      email,
      followers: [],
      following: []
    });
    await newUser.save();
    await redisClient.del('user:all')
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el usuario', error: error.message });
  }
};

const updateNickName = async (req, res) => {
  try {
    const { nickName } = req.body;
    
    const userActualizado = await User.findByIdAndUpdate(
      req.params.id,
      { nickName }, 
      { new: true, runValidators: true } 
    ).select('-__v');
    if (!userActualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    await redisClient.del(`user:${req.params.id}`)
    await redisClient.del('user:all')
    res.status(200).json(userActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el nickname', error: error.message });
  }
};

const updateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    const userActualizado = await User.findByIdAndUpdate(
      req.params.id,
      { email }, 
      { new: true, runValidators: true } 
    ).select('-__v');
    await redisClient.del(`user:${req.params.id}`)
    await redisClient.del('user:all')
    res.status(200).json(userActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el email', error: error.message });
  }
};

const deleteUser = async (req, res) =>{
  try {
    const idABuscar = await req.params.id;
    await User.deleteMany({ user: idABuscar })
    const userEliminado = await User.findByIdAndDelete(idABuscar);
    await redisClient.del(`user:${req.params.id}`)
    await redisClient.del('user:all')
    res.status(200).json({ message: 'Usuario eliminado con éxito' });
  }
  catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
}


const followUser = async (req, res) => {
  try {
    const { id, idASeguir } = req.params;
    if (id === idASeguir) {
      return res.status(400).json({ error: "No puedes seguirte a ti mismo" });
    }
    const user = await User.findById(id);
    const userASeguir = await User.findById(idASeguir);
    if (!user || !userASeguir) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    if (user.following.includes(userASeguir._id)) {
      return res.status(400).json({ error: "Ya sigues a este usuario" });
    }
    user.following.push(userASeguir._id);
    userASeguir.followers.push(user._id);
    await user.save();
    await userASeguir.save();
    await redisClient.del(`user:${req.params.id}`)
    await redisClient.del('user:all')
    res.status(201).json({ message: `${user.nickName} siguió de forma exitosa a: ${userASeguir.nickName}` });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
};



module.exports = {getUsers, createUser, updateNickName, updateEmail, deleteUser,followUser, getAllUser};