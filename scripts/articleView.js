var articleView = {};

// articleTemplate -> renderGroup -> render (one)
articleView.loadTemplate = function(articles) {
  $.get('/templates/article.html', function(data, msg, xhr) {
    articleView.template = Handlebars.compile(data);
    articleView.renderGroup(articles);
  });
};

articleView.renderGroup = function(articleList) {

  $('#articles')
    .fadeIn()
    .append(
      articleList.map( function(a) {
        return articleView.render(a);
      })
    )
    .siblings().hide();
};

articleView.index = function() {
  articleView.loadTemplate(Article.all);
};

articleView.render = function(article) {
  article.daysAgo =
    parseInt((new Date() - new Date(article.publishedOn))/60/60/24/1000);

  article.publishStatus = article.publishedOn ? 'published ' + article.daysAgo + ' days ago' : '(draft)';
  article.authorSlug = util.slug(article.author);
  article.categorySlug = util.slug(article.category);

  return articleView.template(article);
};

articleView.show = function(articles) {
  articleView.loadTemplate(articles);
};
