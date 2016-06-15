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
Article.fetchAll(articleView.initAdminPage);
