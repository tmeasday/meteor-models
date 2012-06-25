Meteor Models
=============

This is a basic proof of concept of the way meteor models *could* work. It builds on the code in this (pull request)[https://github.com/meteor/meteor/pull/129].

To use, do something like

```js
  var Post = function(attrs) {
    Model.call(this, attrs);
  }
  Post.prototype = new Model({});
  Post.prototype.constructor = Post;

  var Posts = new Meteor.Collection('posts', null, null, Post);
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