function Category (opts) {
  this.name = opts.name ? opts.name : opts.category;
  this.id = opts.id;
}

Category.setupTable = function (callback) {
  webDB.execute(
    'CREATE TABLE IF NOT EXISTS categories (' +
      'id INTEGER PRIMARY KEY, ' +
      'name VARCHAR(255) NOT NULL UNIQUE' +
    ');',
    callback
  );
};

Category.setupTable();

Category.prototype.insertRecord = function (callback) {
  webDB.execute(
    [
      {
        sql: 'INSERT INTO categories ' +
          '(name) ' +
          'VALUES (?, ?);',
        data: [this.name]
      }
    ],
    callback
  );
};

Category.prototype.updateRecord = function (callback) {
  webDB.execute(
    [
      {
        sql: 'UPDATE categories ' +
          'SET name = ? ' +
          'WHERE id = ?;',
        data: [this.name, this.id]
      }
    ],
    callback
  );
};

Category.prototype.deleteRecord = function (callback) {
  webDB.execute(
    [
      {
        sql: 'DELETE FROM categories ' +
          'WHERE id = ?;',
        data: [this.id]
      }
    ],
    callback
  );
};

Category.all = [];

Category.importRecords = function (articles, callback) {
  var sqlObjects = articles.map(
    function (article) {
      return {
        sql: 'INSERT OR IGNORE INTO categories ' +
          '(name) ' +
          'VALUES (?);',
        data: [article.category]
      };
    }
  );

  webDB.execute(sqlObjects, callback);
};

Category.requestCategories = function(next, callback) {
  $.getJSON('/data/hackerIpsum.json', function(articles) {
    Category.importRecords(articles, function() {
      next(callback);
    });
  });
};

Category.loadCategories = function (callback) {
  callback = callback || function() {};

  if (Category.all.length === 0) {
    webDB.execute(
      'SELECT * FROM categories;',
      function webDBcallback (rows) {
        if (rows.length === 0) {
          // Request data from server, then try loading from db again:
          Category.requestCategories(Category.loadCategories, callback);
        } else {
          // Article.all = Article.all.concat(
          //   rows.map(function(row) {return new Article(row);} )
          // );
          Category.all = rows.map(function(row) {return new Category(row);});
          callback(Category.all);
        }
      }
    );
  } else {
    callback();
  }
};

Category.getAll = function(callback) {
  webDB.execute(
    'SELECT * FROM categories;',
    callback
  );
};

Category.updateArray = function () {
  Category.getAll(function(rows) {
    Category.all = rows.map(function(row) {return new Author(row);});
  });
};

Category.find = function(id, callback) {
  webDB.execute(
    [
      {
        'sql': 'SELECT * FROM categories WHERE id = ?',
        'data': [id]
      }
    ],
    callback
  );
};

Category.findWhere = function(column, value, callback) {
  webDB.execute(
    [
      {
        'sql': 'SELECT * FROM categories WHERE ' + column + '= ?',
        'data': [value]
      }
    ],
    callback
  );
};

Category.truncateTable = function(callback) {
  // Delete all records from given table.
  webDB.execute('DELETE FROM categories;',
    callback
  );
};
