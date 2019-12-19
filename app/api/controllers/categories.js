const categoryModel = require('../models/categories');
module.exports = {
 getById: function(req, res, next) {
  console.log(req.body);
  categoryModel.findById(req.params.categoryId, function(err, categoryInfo){
   if (err) {
    next(err);
   } else {
    res.json({status:"success", message: "Category found!!!", data:{categories: categoryInfo}});
   }
  });
 },
getAll: function(req, res, next) {
  let categoriesList = [];
categoryModel.find({}, function(err, categories){
   if (err){
    next(err);
   } else{
    for (let category of categories) {
     categoriesList.push({id: category._id, name: category.name });
    }
    res.json({status:"success", message: "Category list found!!!", data:{categories: categoriesList}});
       
   }
});
 },
updateById: function(req, res, next) {
  categoryModel.findByIdAndUpdate(req.params.categoryId,{name:req.body.name}, function(err, categoryInfo){
if(err)
    next(err);
   else {
    res.json({status:"success", message: "Category updated successfully!!!", data:null});
   }
  });
 },
deleteById: function(req, res, next) {
  categoryModel.findByIdAndRemove(req.params.categoryId, function(err, categoryInfo){
   if(err)
    next(err);
   else {
    res.json({status:"success", message: "Category deleted successfully!!!", data:null});
   }
  });
 },
create: function(req, res, next) {
  categoryModel.create({ name: req.body.name }, function (err, result) {
      if (err) 
       next(err);
      else
       res.json({status: "success", message: "Category added successfully!!!", data: result});      
    });
 },
}