// TODO: Wrap the entire contents of this file in an IIFE.
// Pass in to the IIFE a module, upon which objects can be attached for later access.
(function(module) {
  function Article (opts) {
    this.author = opts.author;
    this.authorUrl = opts.authorUrl;
    this.title = opts.title;
    this.category = opts.category;
    this.body = opts.body;
    this.publishedOn = opts.publishedOn;
  }

  Article.all = [];

  Article.prototype.toHtml = function() {
    var template = Handlebars.compile($('#article-template').text());

    this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
    this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
    this.body = marked(this.body);

    return template(this);
  };

  Article.loadAll = function(rawData) {
    rawData.sort(function(a,b) {
      return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
    });

    // TODO: Refactor this forEach code, by using a `.map` call instead, since want we are trying to accomplish
    // is the transformation of one colleciton into another.

    /* OLD forEach():
    rawData.forEach(function(ele) {
      Article.all.push(new Article(ele));
    });
    */
    Article.all = rawData.map(function(ele) {
      return new Article(ele);
    });
  };

  // This function will retrieve the data from either a local or remote source,
  // and process it, then hand off control to the View.
  // TODO: Refactor this function, so it accepts an argument of a callback function (likely a view function)
  // to execute once the loading of articles is done.

  /* OLD function
  Article.fetchAll = function() {
    if (localStorage.rawData) {
      Article.loadAll(JSON.parse(localStorage.rawData));
      articleView.initIndexPage();
    } else {
      $.getJSON('/data/hackerIpsum.json', function(rawData) {
        Article.loadAll(rawData);
        localStorage.rawData = JSON.stringify(rawData); // Cache the json, so we don't need to request it next time.
        articleView.initIndexPage();
      });
    }
  };
  */
  Article.fetchAll = function(next) { // pass in a callback parameter, in this case, `next`
    if (localStorage.rawData) {
      Article.loadAll(JSON.parse(localStorage.rawData));
      next(); // now call `next` - after the loading of data has finished.
    } else {
      $.getJSON('/data/hackerIpsum.json', function(rawData) {
        Article.loadAll(rawData);
        localStorage.rawData = JSON.stringify(rawData); // Cache the json, so we don't need to request it next time.
        next(); // now call `next` - after the loading of data has finished.
      });
    }
  };

  // TODO: Chain together a `map` and a `reduce` call to produce an array of unique author names.
  Article.allAuthors = function() {
    return Article.all.map(function(article) {
      return article.author;
    })
    .reduce(function(names, name) { // `names` will map to the array accumulator specified below
      if (names.indexOf(name) === -1) { // if there is no index for the author,
        names.push(name); // add the author!
      }
      return names;
    }, []);  // the [] is the accumulator which we check against to only
             // push unique authors to.
  };

  // TODO: Chain together a `map` and a `reduce` call to get a rough count of all words in all articles.
  Article.numWordsAll = function() {
    return Article.all.map(function(article) { // map the entire Article.all collection
      return article.body.match(/\b\w+/g).length;  // regexp matching word instances
    })
    .reduce(function(a, b) {
      return a + b;  // now sum the total number of words!
    })
  };

  Article.numWordsByAuthor = function() {
    return Article.allAuthors().map(function(author) { // the result of the initial .map() to generate
      // unique authors will now have another .map() call to begin generating further stats!

      // TODO: Transform each author string into an object with properties for
      // the author's name, as well as the total number of words across all articles
      // written by the specified author.
      return {
        name: author,
        numWords: Article.all.filter(function(a) {  // filter out all the articles based on an
          // author instance. `a` is a reference the current article.
          return a.author === author; // only return articles when the author names match.
        })
        .map(function(a) {
          return a.body.match(/\b\w+/g).length  // map this new author article collection based on
          // a regexp matching words, so the new array collection will now be all the words written
          // by the current author.
        })
        .reduce(function(a, b) { // now reduce this array down to a sum of all the words for a
          // particular author!
          return a + b;
        })
      }
    })
  };

  // Below is a little bonus section that is not requred, but a fun way to quickly
  // see a breakdown of blog stats.

  Article.stats = function() {
    return {
      numArticles: Article.all.length,
      numWords: Article.numWordsAll(),
      Authors: Article.allAuthors(),
    }
  };

  module.Article = Article;
})(window);
