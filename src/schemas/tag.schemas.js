const joi = require('joi')

const contenidoSchema = joi.object({
    descripcion: joi.string().required().min(5).max(50).messages({
        "any.required" :"tag es obligatorio",
        "string.min" : "La descripcion debe contener como minimo {#limit} de caracteres",
        "string.max" : "La descripcion debe contener como maximo {#limit} de caracteres",
        "string.empty": "La descripcion no puede ser vacio"
    })
});


module.exports = {contenidoSchema}