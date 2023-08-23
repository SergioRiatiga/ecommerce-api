const { getAll } = require('../controllers/productImg.controller');
const {create,remove} = require('../controllers/productImgCloudinary.controller');
const express = require('express');
const upload = require('../utils/multer')

const routerProductImg = express.Router()

routerProductImg.route('/')
  .get(getAll)
  .post(upload.single('image'),create)

routerProductImg.route('/:id')
  .delete(remove)

module.exports = routerProductImg