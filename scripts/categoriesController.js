var categoriesController = {};

categoriesController.loadCategories = function(ctx, next) {
  var categoryData = function(data) {
    ctx.categories = data;
    next();
  };

  if (Category.all.length > 0) {
    ctx.categories = Category.all;
    next();
  } else {
    Category.loadCategories(categoryData);
  }
};
