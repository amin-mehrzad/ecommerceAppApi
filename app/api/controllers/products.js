const productModel = require('../models/products');
module.exports = {
  getById: function (req, res, next) {
    console.log(req.body);
    productModel.findById(req.params.productId, function (err, productInfo) {
      if (err) {
        next(err);
      } else {
        res.json({ status: "success", message: "Products found!!!", data: { products: productInfo } });
      }
    });
  },
  getAll: function (req, res, next) {
    let productsList = [];
    productModel.find({}, function (err, products) {
      if (err) {
        next(err);
      } else {
        for (let product of products) {
          productsList.push({
            id: product._id,
            name: product.name,
            sku: product.sku,
            categories: product.categories
          });
        }
        res.json({ status: "success", message: "Products list found!!!", data: { products: productsList } });

      }
    });
  },
  updateById: function (req, res, next) {
    productModel.findByIdAndUpdate(req.params.productId, {
      name: req.body.name,
      sku: req.body.sku,
      categories: req.body.categories
    }, function (err, productInfo) {
      if (err)
        next(err);
      else {
        res.json({ status: "success", message: "Products updated successfully!!!", data: null });
      }
    });
  },
  deleteById: function (req, res, next) {
    productModel.findByIdAndRemove(req.params.productId, function (err, productInfo) {
      if (err)
        next(err);
      else {
        res.json({ status: "success", message: "Products deleted successfully!!!", data: null });
      }
    });
  },
  create: function (req, res, next) {
    productModel.create({
      name: req.body.name,
      sku: req.body.sku,
      categories: req.body.categories
    }, function (err, result) {
      if (err)
        next(err);
      else
        res.json({ status: "success", message: "Products added successfully!!!", data: result });
    });
  },
}