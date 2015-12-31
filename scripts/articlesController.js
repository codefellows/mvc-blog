var articlesController = {};

articlesController.loadArticles = function(ctx, next) {
  var articleData = function(data) {
    ctx.articles = data;
    next();
  };

  if (Article.all.length > 0) {
    ctx.articles = Article.all;
    next();
  } else {
    Article.loadArticles(articleData);
  }
};

articlesController.index = function(ctx, next) {
  articleView.show(ctx.articles);
};

articlesController.new = function(ctx, next) {
  editorView.new(ctx);
};

articlesController.edit = function(ctx, next) {
  editorView.new(ctx);
  editorView.edit(ctx.articles);
};

articlesController.template = function(ctx, next) {
  if (articleView.template) {
    next();
  } else {
    $.get('/templates/article.html', function(data, msg, xhr) {
      articleView.template = Handlebars.compile(data);
      next();
    });
  }
};

articlesController.category = function(ctx, next) {
  var categoryData = function(data) {
    ctx.articles = data;
    next();
  };

  Article.findJoinedWhere('category', ctx.params.category, categoryData );
};


articlesController.author = function(ctx, next) {
  var authorData = function(data) {
    ctx.articles = data;
    next();
  };

  Article.findJoinedWhere( 'author', ctx.params.author, authorData );
};

articlesController.article = function(ctx, next) {
  var articleData = function(data) {
    ctx.articles = data;
    next();
  };

  Article.findJoined(ctx.params.id, articleData);
};

articlesController.show = function(ctx, next) {
  articleView.show(ctx.articles);
};
