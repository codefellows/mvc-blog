var authorsController = {};

authorsController.loadAuthors = function(ctx, next) {
  var authorData = function(data) {
    ctx.authors = data;
    next();
  };

  if (Author.all.length > 0) {
    ctx.authors = Author.all;
    next();
  } else {
    Author.loadAuthors(authorData);
  }
};
