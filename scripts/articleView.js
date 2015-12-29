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
    );
    // .siblings().hide();
};

articleView.render = function(article) {
  if (util.isAdmin() || article.publishedOn) {
    article.daysAgo =
      parseInt((new Date() - new Date(article.publishedOn))/60/60/24/1000);

    article.publishStatus = article.publishedOn ? 'published ' + article.daysAgo + ' days ago' : '(draft)';
    article.authorSlug = util.slug(article.author);
    article.categorySlug = util.slug(article.category);

    return articleView.template(article);
  }
};

articleView.show = function(articles) {
  articleView.renderGroup(articles);
  articleView.setTeasers();
};

articleView.edit = function (articles) {
  $('#editor').show();
  $('#article-export').show();
  articleView.watchNewForm();
  articleView.fillFormWithArticle(articles);
  articleView.buildPreview(); // Show initial preview
};

articleView.fillFormWithArticle = function (articles) {
  var article = articles[0];
  var checked = article.publishedOn ? true : false;
  $('#articles').empty();
  $('#article-title').val(article.title);
  $('#article-author').val(article.author); // Need to adjust for join
  $('#article-author-url').val(article.authorUrl); // Need to adjust for join
  $('#article-category').val(article.category);
  $('#article-body').val(article.markdown);
  $('#article-published').attr('checked', checked);
};

articleView.watchNewForm = function() {
  $('#article-form').change(articleView.buildPreview); // Only firing once.
};

articleView.buildPreview = function() {
  $('#articles').empty();

  var articleList = [articleView.buildArticle()];
  articleView.show(articleList);

  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
};

articleView.buildArticle = function() {
  return new Article({
    title: $('#article-title').val(),
    author: $('#article-author').val(), // Need to adjust for join
    authorUrl: $('#article-author-url').val(), // Need to adjust for join
    category: $('#article-category').val(),
    markdown: $('#article-body').val(),
    publishedOn: $('#article-published:checked').length ? util.today() : null
  });
};

articleView.setTeasers = function() {
  $('.article-body').children(':nth-child(n+3)').hide();
  $('#articles').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    $(this).parent().find('.edit-btn').show();
    $(this).prev('.article-body').children().show();
    $(this).hide();
  });
};
