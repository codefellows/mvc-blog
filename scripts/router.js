page('/',
  articlesController.template,
  authorsController.loadAuthors,
  categoriesController.loadCategories,
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
  authorsController.loadAuthors,
  categoriesController.loadCategories,
  articlesController.new
);

page('/article/edit/:id',
  articlesController.template,
  authorsController.loadAuthors,
  categoriesController.loadCategories,
  articlesController.loadArticles,
  articlesController.article,
  articlesController.edit
);

page('/about', reposController.index);
page.start();
