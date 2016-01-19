(function(module) {
  var articlesController = {};

  Article.createTable();  // Ensure the database table is properly initialized

  articlesController.index = function() {
    Article.fetchAll(articleView.initIndexPage);
  };

  module.articlesController = articlesController;
})(window);
