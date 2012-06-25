Meteor Models
=============

This is a basic proof of concept of the way meteor models *could* work. It builds on the code in this [pull request](https://github.com/meteor/meteor/pull/129). 

To use, do something like

```js
  var Post = function(attrs) {
    Model.call(this, attrs);
  }
  Post.prototype = new Model({});
  Post.prototype.constructor = Post;

  var Posts = Post._collection = new Meteor.Collection('posts', null, null, Post);
```

Then 2 things happen, firstly you can use the Model class to save and update posts:

```js
  var post = new Post({title: 'A great post'});
  post.save();
```

And when you query the collection, you will get posts out:

```js
  var post = Posts.findOne(); // a Post object
  
  post.update_attribute('title', 'a new title');
```

For some ideas on how this could be expanded in the future, see the [model class](https://github.com/tmeasday/league/blob/master/models/_model.coffee) from the League project.