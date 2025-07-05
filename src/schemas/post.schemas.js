const joi = require('joi')

const contenidoSchema = joi.object({
    contenido: joi.string().trim().required().min(10).max(200).messages({
        "any.required" :"contenido es obligatorio",
        "string.min" : "El contenido debe contener como minimo {#limit} de caracteres",
        "string.max" : "El contenido debe contener como maximo {#limit} de caracteres",
        "string.empty": "El contenido no puede ser vacio"
    })
});

const creationSchema = joi.object({
    contenido: joi.string().trim().required().min(10).max(200).messages({
        "any.required" :"contenido es obligatorio",
        "string.min" : "El contenido debe contener como minimo {#limit} de caracteres",
        "string.max" : "El contenido debe contener como maximo {#limit} de caracteres",
        "string.empty": "El contenido no puede ser vacio"
    }),
    nickName: joi.string().trim().required().messages({
        "any.required" :"el nickName es obligatorio",
        "string.empty": "El nickName no puede ser vacio"
    })
    
});


module.exports = {contenidoSchema,creationSchema}