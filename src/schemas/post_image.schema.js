const joi = require('joi');

const urlSchema = joi.object ({
    url: joi.string().uri().messages({
        "string.uri":"Tu post debe tener una url valida"
    })
})


const allImagesSchema = joi.array().items(
  joi.object({
    url: joi.string().uri().required()
  })
);

module.exports = {urlSchema,allImagesSchema}