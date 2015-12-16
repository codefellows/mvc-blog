var util = {};

util.slug = function(str) {
  return str.replace(/\W/g, '-');
};

util.today = function() {
  return (new Date()).toISOString().slice(0,10);
};

util.getParameterByKey = function (key) {
  //Return a value stored in a given key from browser query string.
  var match = RegExp('[?&]' + key + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

Handlebars.registerHelper('if_admin', function (block) {
  var admin = util.getParameterByKey('admin');
  if (admin === 'true') {
    return block.fn(this);
  }
  return block.inverse(this);
});
