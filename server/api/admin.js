const express = require('express');
const router = express.Router();

// daos
const JwtUtil = require('../utils/JwtUtil');
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');
const CustomerDAO = require('../models/CustomerDAO');
const EmailUtil = require('../utils/EmailUtil');

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
  if (!admin) return res.json({ success: false });

  const token = JwtUtil.genToken(username, password);
  res.json({ success: true, token });
});

// GET categories
router.get('/categories', JwtUtil.checkToken, async (req, res) => {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

// POST category
router.post('/categories', JwtUtil.checkToken, async (req, res) => {
  const category = { name: req.body.name };
  const result = await CategoryDAO.insert(category);
  res.json(result);
});

// PUT category
router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await CategoryDAO.updateById(_id, req.body);
  res.json(result);
});

// DELETE category
router.delete('/categories/:id', JwtUtil.checkToken, async (req, res) => {
  const result = await CategoryDAO.delete(req.params.id);
  res.json(result);
});

// product
router.get('/products', JwtUtil.checkToken, async function (req, res) {
  // get data
  let products = await ProductDAO.selectAll();

  // pagination
  const sizePage = 4;
  const noPages = Math.ceil(products.length / sizePage);
  let curPage = 1;

  if (req.query.page) curPage = parseInt(req.query.page); // /products?page=xxx

  const offset = (curPage - 1) * sizePage;
  products = products.slice(offset, offset + sizePage);

  // return
  const result = { products: products, noPages: noPages, curPage: curPage };
  res.json(result);
});

// product
router.post('/products', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime(); // milliseconds
  const category = await CategoryDAO.selectByID(cid);
  const product = {
    name: name,
    price: price,
    image: image,
    cdate: now,
    category: category
  };
  const result = await ProductDAO.insert(product);
  res.json(result);
});

router.put('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime(); // milliseconds
  const category = await CategoryDAO.selectByID(cid);
  const product = {
    _id: _id,
    name: name,
    price: price,
    image: image,
    cdate: now,
    category: category
  };
  const result = await ProductDAO.update(product);
  res.json(result);
});

router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ProductDAO.delete(_id);
  res.json(result);
});

 // order
 router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});

 router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const newStatus = req.body.status;
  const result = await OrderDAO.update(_id, newStatus);
  res.json(result);
}); 

router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});

// customer
router.get('/customers', JwtUtil.checkToken, async function (req, res) {
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});

router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(_id, token, 0);
  res.json(result);
});

router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const cust = await CustomerDAO.selectByID(_id);
  if (cust) {
    const send = await EmailUtil.send(cust.email, cust._id, cust.token);
    if (send) {
      res.json({ success: true, message: 'Please check email' });
    } else {
      res.json({ success: false, message: 'Email failure' });
    }
  } else {
    res.json({ success: false, message: 'Not exists customer' });
  }
});

module.exports = router;
