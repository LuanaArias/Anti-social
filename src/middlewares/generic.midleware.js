const { modelName } = require("../db/models/user")

const invalidId = (req, res, next) =>{
    if(req.params.id.length != 24){
        return res.status(400).json({message:"Bad request: no se puede operar con un id de longitud distinta a 24 caracteres"})
    }

    next()
}


const validSearch = (model) => {
    return async (req, res, next) =>{
    if(await model.findById(req.params.id)){
        next()
    }
    else{
        return res.status(400).json({message:"Bad request: no se encuentra el " + model.modelName + ' buscado'})
    }
}}

module.exports = {invalidId, validSearch}
