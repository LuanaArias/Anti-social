const User = require('../db/models/user')


const validUser = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'ID inválido' });
  }
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  next();
};

const validNickname = async (req, res, next) => {
  const { nickName } = req.body;
  if (!nickName) {
    return res.status(400).json({ message: 'El nickname es requerido' });
  }
  const existeNick = await User.findOne({ nickName: nickName.trim() });
  if (existeNick) {
    return res.status(409).json({ message: 'El nickname ya existe' });
  }
  next();
};

const validEmail = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'El email es requerido' });
  }
  const existeEmail = await User.findOne({ email: email.trim() });
  if (existeEmail) {
    return res.status(409).json({ message: 'El email ya se encuentra registrado' });
  }
  next();
};

const validationSchemma = (schema) =>{
    return (req, res, next) =>{
        const {error, _} = schema.validate(req.body, {abortEarly:false})
        if(error){
            return res.status(400).json(error)
        }
        next()
    }
}

const validationEmailSchema = (schema) =>{
    return (req, res, next) =>{
        const {error, _} = schema.validate(req.body, {abortEarly:false})
        if(error){
            return res.status(400).json(error)
        }
        next()
    }
}



module.exports = {validUser,validNickname, validEmail, validationSchemma, validationEmailSchema}    