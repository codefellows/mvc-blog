page('/',
  articlesController.loadAll,
  articlesController.index);

page('/about', aboutController.index);
page('/admin', adminController.index);

page('/article/:id',
  articlesController.loadById,
  articlesController.index);

// Redirect home if the default filter option is selected:
page('/category', '/');
page('/author', '/');

page('/author/:authorName',
  articlesController.loadByAuthor,
  articlesController.index);

page('/category/:categoryName',
  articlesController.loadByCategory,
  articlesController.index);

page();
