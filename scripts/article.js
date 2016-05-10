var articles = [];

function Article (opts) {
  // TODO: Use the js object passed in to complete this contructor function:
  // Save ALL the properties of `opts` into `this`.

/* Shortcut to show off if requested - show on a later date
   Object.keys(opts).forEach(function(e, index, keys) {
     this[e] = opts[e];
   },this);

  Alternate "for in" loop:
    for (keys in opts) {
      this[keys] = opts[keys];
    }
*/
  this.author = opts.author;
  this.authorUrl = opts.authorUrl;
  this.title = opts.title;
  this.category = opts.category;
  this.body = opts.body;
  this.publishedOn = opts.publishedOn;
}

Article.prototype.toHtml = function() {
  var $newArticle = $('article.template').clone();
  // TODO: This cloned article is no longer a template, so we should remove that class...
  $newArticle.removeClass('template');
  if (!this.publishedOn) {
    $newArticle.addClass('draft');
  }
  $newArticle.attr('data-category', this.category);
  // TODO: Use jQuery to fill in the template with properties
  // from this particular Article instance. We need to fill in:
  // the author name and url, the article title and body, and the
  // publication date.
  $newArticle.find('.byline a').html(this.author);
  $newArticle.find('.byline a').attr('href', this.authorUrl);
  $newArticle.find('h1:first').html(this.title);
  $newArticle.find('.article-body').html(this.body);
  // This finds time elements with a pubdate attribute of 'datetime':
  $newArticle.find('time[pubdate]').attr('datetime', this.publishedOn);
  // This is an additional inclusion of the publication date as a 'title' attribute
  // to show when a user hovers over the <time> element:
  $newArticle.find('time[pubdate]').attr('title', this.publishedOn);
  $newArticle.find('time').html('about ' + parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000) + ' days ago');
  $newArticle.append('<hr>');
  return $newArticle;
};

// Sort our data by date published, descending order
ourLocalData.sort(function(a,b) {
  return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
});

// Now iterate through our transformed collection and instantiate a new Article
//  instance.
ourLocalData.forEach(function(ele) {
  articles.push(new Article(ele));
});

// Append each Article to the DOM
articles.forEach(function(a) {
  $('#articles').append(a.toHtml());
});
