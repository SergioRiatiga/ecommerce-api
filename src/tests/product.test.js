const request = require('supertest')
const app = require('../app')
const Category = require('../models/Category')
require('../models')

const URL_BASE = '/api/v1/products'
const URL_BASE_USERS = '/api/v1/users/login'
let TOKEN
let product
let category
let productId

beforeAll(async () => {
  const user ={
    email:'sergio@gmail.com',
    password:'sergio1234'
  }
  const res = await request(app)
  .post(URL_BASE_USERS)
  .send(user)
  TOKEN = res.body.token
  const categoryBody = {
    name:'smart tv'
  }
  category = await Category.create(categoryBody)
  product ={
    title: 'LG oled 55',
    description: 'lorem10',
    price: 20.30,
    categoryId:category.id
  }
})

test('POST -> "URL_BASE", should return status code 201, res.body.title === product.title', async () => {
  const res  = await request(app)
    .post(URL_BASE)
    .send(product)
    .set('Authorization',`Bearer ${TOKEN}`) 
  productId = res.body.id
  expect(res.status).toBe(201)
  expect(res.body).toBeDefined()
  expect(res.body.title).toBe(product.title)
})

test('GET -> "URL_BASE/:id", should return status code 200, res.body.title === product.title', async () => {
  const res  = await request(app)
    .get(URL_BASE)
  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body).toHaveLength(1)
})

test('GET -> "URL_BASE", should return status code 200, res.body.length === 1', async () => {
  const res  = await request(app)
    .get(`${URL_BASE}/${productId}`)
  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.title).toBe(product.title)
})

test('PUT -> "URL_BASE/:id", should return status code 200, res.body.title === productUpdate.title', async () => {
  const productUpdate = {
    title: 'Samsung oled 55'
  }
  const res  = await request(app)
    .put(`${URL_BASE}/${productId}`)
    .send(productUpdate)
    .set('Authorization',`Bearer ${TOKEN}`) 
  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.title).toBe(productUpdate.title)
})

test('DELETE -> "URL_BASE/:id", should return status code 204', async () => {
  const res  = await request(app)
    .delete(`${URL_BASE}/${productId}`)
    .set('Authorization',`Bearer ${TOKEN}`) 
  expect(res.status).toBe(204)
  await category.destroy()
})