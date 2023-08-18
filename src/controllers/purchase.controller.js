const catchError = require('../utils/catchError');
const Purchase = require('../models/Purchase');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Category = require('../models/Category');

const getAll = catchError(async (req, res) => {
  const userId = req.userI.id
  const result = await Purchase.findAll({
    where:{userId},
    include:[
      {
        model:Product,
        attributes:{exclude:['createdAt','updateAt']},
        include:[
          {
            model: Category,
            attributes:['name']
          }
        ]
      }
    ]
  })
  return res.json(result)
})
const create = catchError( async (req,res) => {
  const userId =req.user.id
  const cart = await Cart.findAll({
    where:{userId},
    raw:true,
    attributes:['quantity','userId','productId']
  })
  const result = await Purchase.bulkCreate(cart)
  if(!result) res.sendStatus(404)
  await Cart.destroy({where:{userId}})
  return res.status(201).json(result)
})

module.exports = {
  getAll,create
}