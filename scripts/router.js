page('/',
  articlesController.template,
  articlesController.index
);

page('/category/:category',
  articlesController.template,
  articlesController.category,
  articlesController.show
);

page('/author/:author', articlesController.author);

page('/about', reposController.index);
page.start();
