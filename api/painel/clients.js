const express = require('express');
const router = express.Router();
const login = require('../../middleware/login'); 

const ClientsController = require('../../controllers/clientes.controller');

router.post('/create', login.mandatory, ClientsController.postClients);
router.get('/', ClientsController.getClients);
router.get('/:id_client', login.mandatory, ClientsController.getClient);


module.exports = router;