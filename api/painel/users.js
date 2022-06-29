const express = require('express');
const router = express.Router();
const login = require('../../middleware/login'); 

const UsersController = require('../../controllers/users.controller');

router.post('/create', login.mandatory, UsersController.postUser);
router.get('/', login.mandatory, UsersController.getUsers);
router.get('/:id_user', login.mandatory, UsersController.getUser);
router.patch('/', login.mandatory, UsersController.patchUser);
router.delete('/', login.mandatory,  UsersController.deleteUser);
router.post('/login',login.optional, UsersController.loginUser);

module.exports = router;