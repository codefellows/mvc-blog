var editorView = {};

editorView.new = function (ctx) {
  $('#editor').show();
  $('#article-export').show();
  editorView.populateAuthors(ctx.authors);
  editorView.populateCategories(ctx.categories);
  editorView.handleAuthorDropdown();
  editorView.handleCategoryDropdown();
  editorView.handleAddButton();
  editorView.watchNewForm();
};

editorView.edit = function (articles) {
  $('#add-article-btn').hide();
  $('#update-article-btn').show();
  $('#delete-article-btn').show();
  editorView.handleUpdateButton(articles);
  editorView.handleDeleteButton(articles);
  editorView.fillFormWithArticle(articles);
  editorView.buildPreview(); // Show initial preview
};

editorView.fillFormWithArticle = function (articles) {
  var article = articles[0];
  var checked = article.publishedOn ? true : false;
  $('#articles').empty();
  $('#article-title').val(article.title);
  $('#article-author-list').val(article.authorId);
  $('#article-author').val(article.author);
  $('#article-author-url').val(article.authorUrl);
  $('#article-category-list').val(article.categoryId);
  $('#article-category').val(article.category);
  $('#article-body').val(article.markdown);
  $('#article-published').attr('checked', checked);
};

editorView.watchNewForm = function() {
  $('#article-form').change(editorView.buildPreview);
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
    authorId: $('#article-author-list').val(),
    author: $('#article-author').val(),
    authorUrl: $('#article-author-url').val(),
    categoryId: $('#article-category-list').val(),
    category: $('#article-category').val(),
    markdown: $('#article-body').val(),
    publishedOn: $('#article-published:checked').length ? util.today() : null
  });
};

editorView.populateAuthors = function(authors) {
  var authorOptions = authors.map(function (author) {
    return $('<option value="' + author.id + '">' + author.name + '</option>');
  });
  $('#article-author-list').children(':nth-child(n+2)').remove();
  $('#article-author-list').append(authorOptions);
};

editorView.populateCategories = function(categories) {
  var categoryOptions = categories.map(function (category) {
    return $('<option value="' + category.id + '">' + category.name + '</option>');
  });
  $('#article-category-list').children(':nth-child(n+2)').remove();
  $('#article-category-list').append(categoryOptions);
};

editorView.handleAuthorDropdown = function () {
  var $authorDropdown = $('#article-author-list');
  var $authorField = $('#article-author');
  var $authorUrlField = $('#article-author-url');

  $authorDropdown.on('change', function() {
    if ($authorDropdown.val()) {
      Author.find($authorDropdown.val(), function (authors) {
        $authorField.val(authors[0].name);
        $authorUrlField.val(authors[0].url);
        editorView.buildPreview();
      });
    } else {
      $authorField.val('');
      $authorUrlField.val('');
    }
  });
};

editorView.handleCategoryDropdown = function () {
  var $categoryDropdown = $('#article-author-list');
  var $categoryField = $('#article-category');

  $categoryDropdown.on('change', function() {
    if ($categoryDropdown.val()) {
      Category.find($categoryDropdown.val(), function (categories) {
        $categoryField.val(categories[0].name);
        editorView.buildPreview();
      });
    } else {
      $categoryField.val('');
    }
  });
};

editorView.handleAddButton = function () {
  $('#add-article-btn').on('click', function (e) {
    var navigateHome = function () {
      window.location.assign('/');
    };

    var article = editorView.buildArticle();
    article.insertRecord(navigateHome);
  });
};

editorView.handleUpdateButton = function (articles) {
  $('#update-article-btn').on('click', function () {
    var navigateHome = function () {
      window.location.assign('/');
    };

    var article = editorView.buildArticle();
    article.id = articles[0].id;
    article.updateRecord(navigateHome);
  });
};

editorView.handleDeleteButton = function (articles) {
  $('#delete-article-btn').on('click', function () {
    var navigateHome = function () {
      window.location.assign('/');
    };

    var article = editorView.buildArticle();
    article.id = articles[0].id;
    article.deleteRecord(navigateHome);
  });
};
