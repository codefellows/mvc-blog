page('/',
  articlesController.template,
  authorsController.loadAuthors,
  articlesController.loadArticles,
  articlesController.index
);

page('/category/:category',
  articlesController.template,
  articlesController.category,
  articlesController.show
);

page('/author/:author',
  articlesController.template,
  articlesController.author,
  articlesController.show
);

page('/about', reposController.index);
page.start();
