function Author (opts) {
  this.author = opts.author;
  this.authorUrl = opts.authorUrl;
  this.id = opts.id;
}

Author.prototype.insertRecord = function (callback) {
  webDB.execute(
    [
      {
        sql: 'INSERT INTO authors ' +
          '(author, authorUrl) ' +
          'VALUES (?, ?);',
        data: [this.author, this.authorUrl]
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
          'SET author = ?, authorUrl = ? ' +
          'WHERE id = ?;',
        data: [this.author, this.authorUrl, this.id]
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

Author.importRecord = function (ctx, callback) {
  webDB.execute(
    [
      {
        sql: 'INSERT OR IGNORE INTO authors ' +
          '(author, authorUrl) ' +
          'VALUES (?, ?);',
        data: [ctx.author, ctx.authorUrl]
      },
      {
        sql: 'SELECT id FROM authors WHERE author = ?;',
        data: [ctx.author],
        success: function (tx, results, resultsArray) {
          ctx.authorId = resultsArray[0].id;
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
