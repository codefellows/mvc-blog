var editorView = {};

editorView.new = function (ctx) {
  $('#editor').show();
  $('#article-export').show();
  editorView.watchNewForm();
};

editorView.edit = function (articles) {
  $('#add-article-btn').hide();
  $('#update-article-btn').show();
  $('#delete-article-btn').show();
  editorView.fillFormWithArticle(articles);
  editorView.buildPreview(); // Show initial preview
};

editorView.fillFormWithArticle = function (articles) {
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

editorView.watchNewForm = function() {
  $('#article-form').change(editorView.buildPreview); // Only firing once.
};

editorView.buildPreview = function() {
  $('#articles').empty();

  var articleList = [editorView.buildArticle()];
  articleView.show(articleList);

  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
};

editorView.buildArticle = function() {
  return new Article({
    title: $('#article-title').val(),
    author: $('#article-author').val(), // Need to adjust for join
    authorUrl: $('#article-author-url').val(), // Need to adjust for join
    category: $('#article-category').val(),
    markdown: $('#article-body').val(),
    publishedOn: $('#article-published:checked').length ? util.today() : null
  });
};
