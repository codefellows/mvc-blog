function Article (opts) {
  Object.keys(opts).forEach(function(e, index, keys) {
    this[e] = opts[e];
  },this);

  this.body = opts.body || marked(this.markdown);
}

Article.prototype.insertRecord = function(callback) {
  // Insert author and article records into database
  webDB.execute(
    [
      {
        sql: 'INSERT INTO articles ' +
          '(title, authorId, category, publishedOn, markdown) ' +
          'VALUES (?, ?, ?, ?, ?);',
        data: [this.title, this.authorId, this.category, this.publishedOn, this.markdown],
      }
    ]
  );
};

Article.prototype.updateRecord = function(callback) {
  //update article record in databse
  webDB.execute(
    [
      {
        sql: 'UPDATE articles ' +
          'SET title = ?, authorId = ?, category = ?, publishedOn = ?, markdown = ? ' +
          'WHERE id = ?;',
        data: [this.title, this.authorId, this.category, this.publishedOn, this.markdown, this.id]
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

Article.importRecord = function (article) {
  var newArticle = new Article(article);
  var insertNewArticle = Article.prototype.insertRecord.bind(newArticle);

  Author.importRecord(newArticle, insertNewArticle);
};

Article.requestAll = function(next, callback) {
  $.getJSON('/data/hackerIpsum.json', function (data) {
    data.forEach(Article.importRecord);
    next(callback);
  });
};

Article.loadAll = function loadAll (callback) {
  callback = callback || function() {};

  if (Article.all.length === 0) {
    webDB.execute(
      'SELECT articles.id, title, authors.id AS authorId, authors.name AS author, authors.url AS authorUrl, category, publishedOn, markdown ' +
      'FROM articles ' +
      'JOIN authors ' +
      'ON articles.authorId = authors.id ' +
      'ORDER BY publishedOn;',
      function webDBcallback (rows) {
        if (rows.length === 0) {
          // Request data from server, then try loading from db again:
          Article.requestAll(Article.loadAll, callback);
        } else {
          Article.all = Article.all.concat(
            rows.map(function(row) {return new Article(row);} )
          );
          Author.getAll(function(rows) {
            Author.all = rows.map(function(row) {return new Author(row);});
          });
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
    'SELECT articles.id, title, authors.id AS authorId, authors.name AS author, authors.url AS authorUrl, category, publishedOn, markdown ' +
    'FROM articles ' +
    'JOIN authors ' +
    'ON articles.authorId = authors.id ' +
    'ORDER BY publishedOn;',
    callback
  );
};

Article.findJoined = function (id, callback) {
  webDB.execute(
    [
      {
        sql: 'SELECT articles.id, title, authors.id AS authorId, authors.name AS author, authors.url AS authorUrl, category, publishedOn, markdown ' +
          'FROM articles ' +
          'JOIN authors ' +
          'ON articles.authorId = authors.id ' +
          'WHERE articles.id = ?',
        data: [id]
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
  // Delete all records from given table.
  webDB.execute(
    'DELETE FROM articles;',
    callback
  );
};
