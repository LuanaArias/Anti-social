const {Router} = require('express');
const router = Router();
const {postControllers} = require('../controllers');
const {invalidId, validSearch} = require ('../middlewares/generic.midleware');
const {validationSchemma} = require('../middlewares/post.midleware')

const Post = require('../db/models/post');
const User = require('../db/models/user');

const {contenidoSchema, creationSchema} = require('../schemas/post.schemas');

router.get('/getPost/:id',invalidId,validSearch(Post), postControllers.getPost);
router.get('/getAllPost', postControllers.getAllPosts);
router.get('/getAllUserPost/:id',invalidId,validSearch(User), postControllers.getAllUserPost);
router.post('/createPost',validationSchemma(creationSchema), postControllers.createPost);
router.put('/updatePost/:id',invalidId, validSearch(Post),validationSchemma(contenidoSchema), postControllers.updatePost);
router.delete('/deletePost/:id',invalidId, validSearch(Post), postControllers.deletePost);


module.exports = router;