var reposController = {};

reposController.index = function() {
  repos.requestRepos(repoView.index);
  //TODO: repos.requestGists(gistView.index);
};
