function Article (opts) {
  Object.keys(opts).forEach(function(e, index, keys) {
    this[e] = opts[e];
  },this);

  this.body = opts.body || marked(this.markdown);
}

Article.setupTable = function (callback) {
  webDB.execute(
    'CREATE TABLE IF NOT EXISTS articles (' +
      'id INTEGER PRIMARY KEY, ' +
      'title VARCHAR(255) NOT NULL, ' +
      'authorId INTEGER NOT NULL REFERENCES authors(id), ' +
      'categoryId INTEGER NOT NULL REFERENCES categories(id), ' +
      'markdown TEXT NOT NULL, ' +
      'publishedOn DATETIME, ' +
      'modifiedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL' +
    ');',
    callback
  );
};

Article.setupTable();

Article.prototype.insertRecord = function(callback) {
  // Insert author and article records into database
  webDB.execute(
    [
      {
        sql: 'INSERT INTO articles ' +
          '(title, authorId, categoryId, markdown, publishedOn) ' +
          'VALUES (?, ?, ?, ?, ?, datetime("now"));',
        data: [this.title, this.authorId, this.categoryId, this.markdown, this.publishedOn],
      }
    ],
    callback
  );
};

Article.prototype.updateRecord = function(callback) {
  //update article record in databse
  webDB.execute(
    [
      {
        sql: 'UPDATE articles ' +
          'SET title = ?, authorId = ?, categoryId = ?, markdown = ?, publishedOn = ?, modifiedOn = datetime("now") ' +
          'WHERE id = ?;',
        data: [this.title, this.authorId, this.categoryId, this.markdown, this.publishedOn, this.id]
      }
    ],
    callback
  );
};

Article.prototype.deleteRecord = function(callback) {
  // Delete article record in database
  webDB.execute(
    [
      {
        sql: 'DELETE FROM articles ' +
          'WHERE id = ?;',
        data: [this.id]
      }
    ],
    callback
  );
};

Article.all = [];

Article.importRecords = function (articles, callback) {
  var sqlObjects = articles.map(
    function (article) {
      return {
        sql: 'INSERT INTO articles ' +
          '(title, authorId, categoryId, publishedOn, markdown) ' +
          'VALUES (?, (SELECT id FROM authors WHERE name = ?), (SELECT id FROM categories WHERE name = ?), ?, ?);',
        data: [article.title, article.author, article.category, article.publishedOn, article.markdown],
      };
    }
  );
  webDB.execute(sqlObjects, callback);
};

Article.requestArticles = function(next, callback) {
  $.getJSON('/data/hackerIpsum.json', function(articles) {
    Article.importRecords(articles, function() {
      next(callback);
    });
  });
};

Article.loadArticles = function (callback) {
  callback = callback || function() {};

  if (Article.all.length === 0) {
    webDB.execute(
      'SELECT articles.id, title, authors.id AS authorId, authors.name AS author, authors.url AS authorUrl, categories.id AS categoryId, categories.name AS category, markdown, publishedOn, modifiedOn ' +
      'FROM articles ' +
      'INNER JOIN authors ' +
        'ON articles.authorId = authors.id ' +
      'INNER JOIN categories ' +
        'ON articles.categoryId = categories.id ' +
      'ORDER BY publishedOn DESC;',
      function webDBcallback (rows) {
        if (rows.length === 0) {
          // Request data from server, then try loading from db again:
          Article.requestArticles(Article.loadArticles, callback);
        } else {
          Article.all = Article.all.concat(
            rows.map(function(row) {return new Article(row);} )
          );
          callback(Article.all);
        }
      }
    );
  } else {
    callback();
  }
};

Article.findAllJoined = function (callback) {
  webDB.execute(
    'SELECT articles.id, title, authors.id AS authorId, authors.name AS author, authors.url AS authorUrl, categories.id AS categoryId, categories.name AS category, markdown, publishedOn, modifiedOn ' +
    'FROM articles ' +
    'INNER JOIN authors ' +
      'ON articles.authorId = authors.id ' +
    'INNER JOIN categories ' +
      'ON articles.categoryId = categories.id ' +
    'ORDER BY publishedOn DESC;',
    callback
  );
};

Article.findJoined = function (id, callback) {
  webDB.execute(
    [
      {
        sql: 'SELECT articles.id, title, authors.id AS authorId, authors.name AS author, authors.url AS authorUrl, categories.id AS categoryId, categories.name AS category, markdown, publishedOn, modifiedOn ' +
          'FROM articles ' +
          'INNER JOIN authors ' +
            'ON articles.authorId = authors.id ' +
          'INNER JOIN categories ' +
            'ON articles.categoryId = categories.id ' +
          'WHERE articles.id = ?',
        data: [id]
      }
    ],
    callback
  );
};

Article.findJoinedWhere = function (column, value, callback) {
  webDB.execute(
    [
      {
        sql: 'SELECT articles.id, title, authors.id AS authorId, authors.name AS author, authors.url AS authorUrl, categories.id AS categoryId, categories.name AS category, markdown, publishedOn, modifiedOn ' +
          'FROM articles ' +
          'INNER JOIN authors ' +
            'ON articles.authorId = authors.id ' +
          'INNER JOIN categories ' +
            'ON articles.categoryId = categories.id ' +
          'WHERE ' + column + ' = ? ' +
          'ORDER BY publishedOn DESC;',
        data: [value]
      }
    ],
    callback
  );
};

Article.find = function(id, callback) {
  webDB.execute(
    [
      {
        sql: 'SELECT * FROM articles WHERE id = ?',
        data: [id]
      }
    ],
    callback
  );
};

Article.findWhere = function(column, value, callback) {
  webDB.execute(
    [
      {
        sql: 'SELECT * FROM articles WHERE ' + column + '= ?',
        data: [value]
      }
    ],
    callback
  );
};

Article.truncateTable = function(callback) {
  webDB.execute(
    'DELETE FROM articles;',
    callback
  );
};
