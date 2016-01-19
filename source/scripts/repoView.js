(function(module) {
  var repoView = {};

  var ui = function() {
    var $about = $('#about'); // Best practice: Cache the DOM query if it's used more than once.

    $about.find('ul').empty();
    $about.show().siblings().hide();
  };

  var render = function(repo) {
    return $('<li>')
      .html('<a href="' + repo.html_url + '">' + repo.full_name + '</a>');
  };

  repoView.index = function() {
    ui();

    $('#about ul').append(
      repos.with('forks_count').map(render)
    );
  };

  module.repoView = repoView;
})(window);
