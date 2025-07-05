const {Router} = require('express');
const router = Router();
const {commentControllers} = require('../controllers');
const {invalidId, validSearch} = require ('../middlewares/generic.midleware');
const {validationSchemma} = require('../middlewares/comment.midleware');
const {comentarioSchema} = require('../schemas/comment.schema');
const {validIDPost} = require('../middlewares/post.midleware')
const Comment = require('../db/models/comment');
const Post = require('../db/models/post');

router.get('/getComment/:id', invalidId, validSearch(Comment), commentControllers.getComment);
router.get('/getAllComments', commentControllers.getAllComments);
router.get('/getAllPostComments/:id', invalidId, validSearch(Post), commentControllers.getAllPostComment);
router.post('/createComment/:id', invalidId, validSearch(Post), validationSchemma(comentarioSchema), commentControllers.createComment);
router.put('/updateComment/:id', invalidId, validSearch(Comment), validationSchemma(comentarioSchema), commentControllers.updateComment);
router.delete('/deleteComment/:id', invalidId, validSearch(Comment), commentControllers.deleteComment);

module.exports = router;