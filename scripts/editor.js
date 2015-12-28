editor = {};

editor.initArticleEditorPage = function() {
  $('.tab-content').show();
  $('#export-field').hide();
  $('#article-json').on('focus', function(){
    this.select();
  });
  editor.checkForEditArticle();
  editor.watchNewForm();
};

editor.checkForEditArticle = function () {
  if (util.getParameterByKey('id')) {
    var id = util.getParameterByKey('id');
    editor.loadArticleById(id);
    $('#add-article-btn').hide();
    $('#update-article-btn').show().data('article-id', id);
    $('#delete-article-btn').show().data('article-id', id);
    console.log('Found article to edit.');
  } else {
    console.log('No article to edit.');
  }
};

editor.loadArticleById = function (id) {
  Article.findJoined(id, function(resultArray) {
    if (resultArray.length === 1) {
      editor.fillFormWithArticle(resultArray[0]);
    }
  });
};

editor.fillFormWithArticle = function (article) {
  var checked = article.publishedOn ? true : false;
  $('#preview').empty();
  $('#article-title').val(article.title);
  $('#article-author').val(article.author);
  $('#article-author').data('authorId', article.authorId);
  $('#article-author-url').val(article.authorUrl);
  $('#article-category').val(article.category);
  $('#article-body').val(article.markdown);
  $('#article-published').attr('checked', checked);
  editor.buildPreview(); // Show the initial preview
};

editor.watchNewForm = function() {
  $('#new-form').on('change', 'input, textarea', editor.buildPreview);
};

editor.buildPreview = function() {
  var article = editor.buildArticle();
  $('#preview').html(article.toHtml());

  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
};

editor.buildArticle = function() {
  return new Article({
    title: $('#article-title').val(),
    authorId: $('#article-author').data('authorId'),
    author: $('#article-author').val(),
    authorUrl: $('#article-author-url').val(),
    category: $('#article-category').val(),
    markdown: $('#article-body').val(),
    publishedOn: $('#article-published:checked').length ? util.today() : null
  });
};

editor.exportJSON = function() {
  console.log('exportJSON');
  $('#export-field').show();
  var output = '';
  Article.all.forEach(function(article) {
    output += JSON.stringify(article) + ',\n';
  });
  $('#article-json').val('[' + output + '{"markdown":""}]');
};

editor.clearNewForm = function () {
  $('#articles').empty();
  $('#article-title').val('');
  $('#article-author').val('');
  $('#article-author-url').val('');
  $('#article-category').val('');
  $('#article-body').val('');
  $('#article-published').attr('checked', false);
  $('#add-article-btn').show();
  $('#update-article-btn').hide();
  $('#delete-article-btn').hide();
};

editor.fetchFromDB = function(callback) {
  callback = callback || function() {};

  // Fetch all articles from db.
  Article.findAllJoined(function (resultArray) {
    // resultArray.forEach(function(ele) {
    //   blog.articles.push(new Article(ele));
    // });

    Article.all = resultArray.map(function(row) {
      return new Article(row);
    });

    if ($('#articles').length) {
      blog.render();
    }

    callback();
  });
};

editor.clearAndFetch = function () {
  Article.all = [];
  editor.fetchFromDB(editor.exportJSON);
};

editor.handleAddButton = function () {
  $('#add-article-btn').on('click', function (e) {
    var article = editor.buildArticle();
    article.insertRecord(editor.clearAndFetch);
  });
};

editor.handleUpdateButton = function () {
  $('#update-article-btn').on('click', function () {
    var id = $(this).data('article-id');
    var article = editor.buildArticle();
    article.id = id;
    article.updateRecord();
    editor.clearAndFetch();
  });
};

editor.handleDeleteButton = function () {
  $('#delete-article-btn').on('click', function () {
    var id = $(this).data('article-id');
    var article = editor.buildArticle();
    article.id = id;
    article.deleteRecord(editor.clearAndFetch);

    editor.clearNewForm();
  });
};

$(function() {
  //init web DB
  webDB.init();

  //Set up the blog with the raw data
  editor.fetchFromDB();

  editor.initArticleEditorPage();

  editor.handleAddButton();
  editor.handleUpdateButton();
  editor.handleDeleteButton();
});
