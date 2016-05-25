(function(module) {
  var adminController = {
    index: function() {
      Article.fetchAll(articleView.initAdminPage);
      $('#blog-stats').show().siblings().hide();
    }
  }
  module.adminController = adminController;
})(window);
