const {Router} = require('express');
const router = Router();
const {tagController} = require('../controllers');
const {invalidId, validSearch} = require ('../middlewares/generic.midleware');
const {contenidoSchema} = require('../schemas/tag.schemas');
const {validationSchemma,validPostYTag,validAllTags} = require('../middlewares/tag.midleware');
const Tag = require('../db/models/tag');
const Post = require('../db/models/post');


router.get('/getTag/:id',invalidId,validSearch(Tag), tagController.getTag);
router.get('/getAllTags',tagController.getAllTags);
router.post("/createTag", validationSchemma(contenidoSchema), tagController.createTag);
router.put("/updateTag/:id",invalidId,validSearch(Tag),validationSchemma(contenidoSchema), tagController.updateTag);
router.delete("/deleteTag/:id",invalidId,validSearch(Tag), tagController.deleteTag);
router.get("/getTagsToPost/:id", invalidId,validSearch(Post), tagController.getTagsToPost);
router.put("/setTags/:id",validSearch(Post),validAllTags, tagController.addAllTagsToPost);

module.exports = router;