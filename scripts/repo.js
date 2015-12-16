var repos = {};

repos.all = [];

repos.requestRepos = function(callback) {
  $.ajax({
    url: '/github/users/brookr/repos' +
          '?per_page=100' +
          '&sort=updated',
    type: 'GET',
    headers: { 'Authorization': 'token ' + githubToken },
    success: function(data, message, xhr) {
      repos.all = data;
    }
  }).done(callback);
};
