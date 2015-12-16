var articlesController = {};

articlesController.index = function() {
  Article.loadAll(articleView.index);
};
