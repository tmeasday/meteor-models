Package.describe({
  summary: "A very simple Model Class for Meteor"
});

Package.on_use(function (api, where) {
  where = where || ['client', 'server'];
  
  api.add_files(['model.js'], where);
});

Package.on_test(function (api) {
  api.use('models', ['client', 'server']);
  api.use('tinytest');
  api.add_files('model_tests.js', ['client', 'server']);
});
