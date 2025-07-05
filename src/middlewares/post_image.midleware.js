const Post_Image = require('../db/models/post_image');
const Post = require('../db/models/post');
const mongoose = require('mongoose');

const validationSchemma = (schema) =>{
    return (req, res, next) =>{
        const {error, _} = schema.validate(req.body, {abortEarly:false})
        if(error){
            return res.status(400).json(error)
        }
        next()
    }
}


module.exports = {validationSchemma};