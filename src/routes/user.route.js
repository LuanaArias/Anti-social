const {Router} = require('express');
const router = Router();
const {userControllers} = require('../controllers');
const { validNickname,validEmail , validationSchemma, validationEmailSchema} = require ('../middlewares/user.midleware')
const {invalidId, validSearch} = require ('../middlewares/generic.midleware')

const {schema, emailSchema} = require('../schemas/user.schemas')
const User = require('../db/models/user');

router.get('/getUser/:id',invalidId, validSearch(User), userControllers.getUsers);
router.get('/getAllUsers', userControllers.getAllUser)
router.post('/createUser', validationSchemma(schema) ,userControllers.createUser);
router.put('/updateNickName/:id',invalidId, validSearch(User), validNickname, userControllers.updateNickName)
router.post('/seguirUsuario/:id/:idASeguir',invalidId, userControllers.followUser)
router.put('/updateEmail/:id',invalidId, validSearch(User),validEmail,validationEmailSchema(emailSchema), userControllers.updateEmail)
router.delete('/deleteUser/:id',invalidId, validSearch(User), userControllers.deleteUser)

module.exports =  router ;