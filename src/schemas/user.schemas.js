const joi = require('joi')


const schema = joi.object({
    nickName: joi.string().required().min(8).max(12).messages({
        "any.required" :"nickname es obligatorio",
        "string.min" : "El nickname debe contener como minimo {#limit} de caracteres",
        "string.max" : "El nickname debe contener como maximo {#limit} de caracteres",
        "string.empty": "nickname no puede ser vacio"
    }),
    email:joi.string().required().email().messages({
    "any.required" :"Email es obligatorio",
    "string.email": "Debe ser un email válido",
    "string.empty": "El email no puede estar vacío"  
    })
})

const emailSchema = joi.object({
    email:joi.string().required().email().messages({
    "any.required" :"Email es obligatorio",
    "string.email": "Debe ser un email válido",
    "string.empty": "El email no puede estar vacío"  
    })
});

module.exports = {emailSchema, schema}