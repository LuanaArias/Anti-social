const Tag = require('../db/models/tag');
const Post = require('../db/models/post')
const validationSchemma = (schema) =>{
    return (req, res, next) =>{
        const {error, _} = schema.validate(req.body, {abortEarly:false})
        if(error){
            return res.status(400).json(error)
        }
        next()
    }
}




const validPostYTag = async (req, res, next) => {
  try {
    const { idPost, idTag } = req.params;
    const post = await Post.findById(idPost);
    const tag = await Tag.findById(idTag);

    if (post && tag) {
      return next();
    } else if (!post && tag) {
      return res.status(404).json({ message: "Post no encontrado" });
    } else if (post && !tag) {
      return res.status(404).json({ message: "Tag no encontrado" });
    } else {
      return res.status(404).json({ message: "Post y Tag no encontrados" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error al validar Post y Tag", error: error.message });
  }
};

const validAllTags = async (req, res, next) => {
  try {
    const invalidTags = [];

    for (const element of req.body) {
      const tag = await Tag.findById(element.id);
      if (!tag) {
        invalidTags.push(element.id);
      }
    }

    if (invalidTags.length === req.body.length) {
      return res.status(400).json({ message: "Ninguno de los tags proporcionados existe" });
    }
    if (invalidTags.length) {
      return res.status(404).json({ message: "Algunos tags no existen", invalidTags });
    }
    next();
  } catch (error) {
    console.error("Error validando tags:", error);
    res.status(500).json({ message: "Error validando tags", error: error.message });
  }
};

module.exports = {validationSchemma,validPostYTag,validAllTags};