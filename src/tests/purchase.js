const request = require("supertest")
const app = require("../app")
const Product = require("../models/Product")
const Cart = require("../models/Cart")
require('../models')

const URL_BASE = "/api/v1/purchase"
const URL_BASE_USERS = "/api/v1/users"
let TOKEN
let userId
let productBody
let product
let cartBody

beforeAll(async () => {
  const user = {
    email:'sergio@gmail.com',
    password:'sergio1234'
  }
  const res = await request(app)
    .post(`${URL_BASE_USERS}/login`)
    .send(user)
  TOKEN = res.body.token
  userId = res.body.user.id
  productBody = {
    title:'productTest',
    description:'lorem20',
    price:23
  }
  product = await Product.create(productBody)
  cartBody = {
    quantity:1,
    productId: product.id
  }
  await request(app)
    .post('/api/v1/cart')
    .send(cartBody)
    .set('Authorization', `Bearer ${TOKEN}`)
})

test('POST ->"URL_BASE", should return  status code 201, res.body.quantity === bodyCart.quantity', async () => {
  const res = await request(app)
    .post(URL_BASE)
    .set('Authorization', `Bearer ${TOKEN}`)
  expect(res.status).toBe(201)
  expect(res.body.quantity).toBe(cartBody.quantity)
})

test('GET -> "URL_BASE", should return status code 200, res.body.length === 1', async () => {

  const res = await request(app)
    .get(URL_BASE)
    .set("Authorization", `Bearer ${TOKEN}`)

  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body).toHaveLength(1)
  expect(res.body[0].userId).toBe(userId)
  expect(res.body[0].product).toBeDefined()
  expect(res.body[0].product.id).toBe(product.id)

  await product.destroy()
})