function Author (opts) {
  this.name = opts.name ? opts.name : opts.author;
  this.url = opts.url ? opts.url : opts.authorUrl;
  this.id = opts.id;
}

Author.setupTable = function (callback) {
  webDB.execute(
    'CREATE TABLE IF NOT EXISTS authors (' +
      'id INTEGER PRIMARY KEY, ' +
      'name VARCHAR(255) NOT NULL UNIQUE, ' +
      'url VARCHAR(255)' +
    ');',
    callback
  );
};

Author.setupTable();

Author.prototype.insertRecord = function (callback) {
  webDB.execute(
    [
      {
        sql: 'INSERT INTO authors ' +
          '(name, url) ' +
          'VALUES (?, ?);',
        data: [this.name, this.url]
      }
    ],
    callback
  );
};

Author.prototype.updateRecord = function (callback) {
  webDB.execute(
    [
      {
        sql: 'UPDATE authors ' +
          'SET name = ?, url = ? ' +
          'WHERE id = ?;',
        data: [this.name, this.url, this.id]
      }
    ],
    callback
  );
};

Author.prototype.deleteRecord = function (callback) {
  webDB.execute(
    [
      {
        sql: 'DELETE FROM authors ' +
          'WHERE id = ?;',
        data: [this.id]
      }
    ],
    callback
  );
};

Author.all = [];

Author.importRecords = function (articles, callback) {
  var sqlObjects = articles.map(
    function (article) {
      return {
        sql: 'INSERT OR IGNORE INTO authors ' +
          '(name, url) ' +
          'VALUES (?, ?);',
        data: [article.author, article.authorUrl]
      };
    }
  );

  webDB.execute(sqlObjects, callback);
};

Author.requestAuthors = function(next, callback) {
  $.getJSON('/data/hackerIpsum.json', function(articles) {
    Author.importRecords(articles, function() {
      next(callback);
    });
  });
};

Author.loadAuthors = function (callback) {
  callback = callback || function() {};

  if (Author.all.length === 0) {
    webDB.execute(
      'SELECT * FROM authors;',
      function webDBcallback (rows) {
        if (rows.length === 0) {
          // Request data from server, then try loading from db again:
          Author.requestAuthors(Author.loadAuthors, callback);
        } else {
          Author.all = rows.map(function(row) {return new Author(row);});
          callback(Author.all);
        }
      }
    );
  } else {
    callback();
  }
};

Author.getAll = function(callback) {
  webDB.execute(
    'SELECT * FROM authors;',
    callback
  );
};

Author.updateArray = function () {
  Author.getAll(function(rows) {
    Author.all = rows.map(function(row) {return new Author(row);});
  });
};

Author.find = function(id, callback) {
  webDB.execute(
    [
      {
        'sql': 'SELECT * FROM authors WHERE id = ?',
        'data': [id]
      }
    ],
    callback
  );
};

Author.findWhere = function(column, value, callback) {
  webDB.execute(
    [
      {
        'sql': 'SELECT * FROM authors WHERE ' + column + '= ?',
        'data': [value]
      }
    ],
    callback
  );
};

Author.truncateTable = function(callback) {
  // Delete all records from given table.
  webDB.execute('DELETE FROM authors;',
    callback
  );
};
