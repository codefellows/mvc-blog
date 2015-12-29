var articleView = {};

// renderGroup -> render (one)
articleView.renderGroup = function(articleList) {
  if (articleList.length) {
    $('.placeholder-article').hide();
  }

  $('#articles')
    .fadeIn()
    .append(
      articleList.map( function(a) {
        return articleView.render(a);
      })
    )
    .siblings().hide();
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
  articleView.renderGroup(articles);
};
