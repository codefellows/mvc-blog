// TODO: Wrap the entire contents of this file in an IIFE.
// Pass in to the IIFE a module, upon which objects can be attached for later access.
(function(module) {

  // Configure a view object, to hold all our functions for dynamic updates and article-related event handlers.
  var articleView = {};

  articleView.handleAuthorFilter = function() {
    $('#author-filter').on('change', function() {
      if ($(this).val()) {
        $('article').hide();
        $('article[data-author="' + $(this).val() + '"]').fadeIn();
      } else {
        $('article').fadeIn();
        $('article.template').hide();
      }
      $('#category-filter').val('');
    });
  };

  articleView.handleCategoryFilter = function() {
    $('#category-filter').on('change', function() {
      if ($(this).val()) {
        $('article').hide();
        $('article[data-category="' + $(this).val() + '"]').fadeIn();
      } else {
        $('article').fadeIn();
        $('article.template').hide();
      }
      $('#author-filter').val('');
    });
  };

  articleView.handleMainNav = function() {
    $('.main-nav').on('click', '.tab', function(e) {
      $('.tab-content').hide();
      $('#' + $(this).data('content')).fadeIn();
    });

    $('.main-nav .tab:first').click();
  };

  articleView.setTeasers = function() {
    $('h2').prev('p').remove();
    $('h2').next('p').remove();
    $('.article-body *:nth-of-type(n+2)').hide();

    $('#articles').on('click', 'a.read-on', function(e) {
      e.preventDefault();
      $(this).parent().find('*').fadeIn();
      $(this).hide();
    });
  };

  articleView.initNewArticlePage = function() {
    $('.tab-content').show();
    $('#export-field').hide();
    $('#article-json').on('focus', function(){
      this.select();
    });

    $('#new-form').on('change', 'input, textarea', articleView.create);
  };

  articleView.create = function() {
    var article;
    $('#articles').empty();

    // Instantiate an article based on what's in the form fields:
    article = new Article({
      title: $('#article-title').val(),
      author: $('#article-author').val(),
      authorUrl: $('#article-author-url').val(),
      category: $('#article-category').val(),
      body: $('#article-body').val(),
      publishedOn: $('#article-published:checked').length ? util.today() : null
    });

    $('#articles').append(article.toHtml());

    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });

    // Export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
    $('#export-field').show();
    $('#article-json').val(JSON.stringify(article) + ',');
  };

  articleView.initIndexPage = function() {
    Article.all.forEach(function(a){
      if($('#category-filter option:contains("'+ a.category + '")').length === 0) {
        $('#category-filter').append(a.toHtml($('#category-filter-template')));
      };
      if($('#author-filter option:contains("'+ a.author + '")').length === 0) {
        $('#author-filter').append(a.toHtml($('#author-filter-template')));
      };
      $('#articles').append(a.toHtml($('#article-template')));
    });

    articleView.handleCategoryFilter();
    articleView.handleAuthorFilter();
    articleView.handleMainNav();
    articleView.setTeasers();
  };

  articleView.initAdminPage = function() {
    // DONE: Call the Handlebars `.compile` function, which will return a function for you to use where needed.
    var template = Handlebars.compile($('#author-template').html());

    // DONE: We use `forEach` here because we are relying on the side-effects of the callback function:
    // appending to the DOM.
    // The callback is not required to return anything.
    Article.numWordsByAuthor().forEach(function(stat) {
      $('.author-stats').append(template(stat));
    })

    // DONE: Simply write the correct values to the page:
    $('#blog-stats .articles').text(Article.all.length);
    $('#blog-stats .words').text(Article.numWordsAll());
  };

  module.articleView = articleView;
})(window);
