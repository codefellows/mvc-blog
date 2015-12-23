function Author (opts) {
  Object.keys(opts).forEach(function(e, index, keys) {
    this[e] = opts[e];
  },this);
}

Author.prototype.insertRecord = function (callback) {
  webDB.execute(
    [
      {
        sql: 'INSERT OR IGNORE INTO authors ' +
          '(author, authorUrl) ' +
          'VALUES (?, ?) ',
        data: [article.author, article.authorUrl]
      },
      {
        sql: 'SELECT id FROM authors WHERE author = ?;',
        data: [article.author],
        success: function (tx, results, resultsArray) {
          article.authorId = resultsArray[0].id;
        }
      }
    ],
    callback
  );
};

Author.all = [];

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
