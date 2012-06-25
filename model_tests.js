Tinytest.add("models - basics", function (test) {
  var Post = function(attrs) {
    Model.call(this, attrs);
  }
  Post.prototype = new Model({});
  Post.prototype.constructor = Post;
  Post._collection = new Meteor.Collection(null, null, null, Post);
  
  var post = new Post({name: 'foo', text: 'lorem'});
  test.equal(post.attributes.name, 'foo');
  test.equal(post.attributes.text, 'lorem');
  test.isUndefined(post.id);
  
  post.save();
  test.length(post.id, 36);
  
  var post2 = Post._collection.findOne();
  test.equal(post2.attributes.name, 'foo');
  test.equal(post2.attributes.text, 'lorem');
  test.equal(post2.id, post.id);
  
  post.update_attribute('name', 'bar');
  test.equal(post.attributes.name, 'bar');
  test.equal(Post._collection.findOne().attributes.name, 'bar');
  
  post.destroy();
  test.isUndefined(Post._collection.findOne());
});