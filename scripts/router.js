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

page('/article/new',
  articlesController.template,
  articlesController.new
);

page('/article/edit/:id',
  articlesController.template,
  articlesController.article,
  articlesController.edit
);

page('/about', reposController.index);
page.start();
