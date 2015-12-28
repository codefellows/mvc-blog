function Author (opts) {
  this.name = opts.author;
  this.url = opts.authorurl;
  this.id = opts.id;
}

Author.prototype.insertRecord = function (callback) {
  webDB.execute(
    [
      {
        sql: 'INSERT INTO authors ' +
          '(name, url) ' +
          'VALUES (?, ?);',
        data: [this.author, this.url]
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

Author.importRecord = function (article, callback) {
  webDB.execute(
    [
      {
        sql: 'INSERT OR IGNORE INTO authors ' +
          '(name, url) ' +
          'VALUES (?, ?);',
        data: [article.author, article.authorUrl]
      },
      {
        sql: 'SELECT id FROM authors WHERE name = ?;',
        data: [article.author],
        success: function (tx, results, resultsArray) {
          article.authorId = resultsArray[0].id;
        }
      }
    ],
    callback
  );
};

Author.getAll = function(callback) {
  // Retrieve all records from joined authors and articles table.
  webDB.execute(
    'SELECT * FROM authors;',
    callback
  );
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
