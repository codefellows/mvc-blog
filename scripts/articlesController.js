var articlesController = {};

articlesController.index = function() {
  Article.loadAll(articleView.index);
};

articlesController.category = function(ctx, next) {
  var categoryData = function(data) {
    ctx.articles = data;
    next()

  }
  Article.findByCategory(ctx.params.category, categoryData );
};


articlesController.author = function(ctx, next) {
  console.log(ctx);
}

articlesController.show = function(ctx, next) {
  articleView.show(ctx.articles);
}
