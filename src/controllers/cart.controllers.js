const catchError = require('../utils/catchError');
const Cart = require('../models/Cart');

const getAll = catchError(async (req, res) => {
  const userId = req.user.id
  const result = await Cart.findAll({
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
const create = catchError(async (req, res) => {
  const userId = req.user.id
  const{productId,quantity} = req.body
  const body = {quantity,productId,userId}
  const result = await Cart.create(body)
  return res.status(201).json(result)
})
const remove = catchError(async (req, res) => {
  const {id} = req.params
  const userId = req.user.id
  const result = await Cart.destroy({where:{id,userId}})
  if(!result) return res.sendStatus(404)
  return res.sendStatus(204)
})
const update = catchError(async(req, res) => {
  const {id} = req.params
  const {quantity} = req.body
  const userId = req.user.id
  const result = await Cart.update({quantity},{where:{id,userId},returning:true})
  if(result[0] === 0) return res.sendStatus(404)
  return res.json(result[1][0])
})

module.exports = {
  getAll,create,remove,update
}