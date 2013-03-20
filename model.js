Model = function(attributes) {
  _.extend(this, attributes);
  
  // // begin with no errors
  // this._errors = {};
}

Model.prototype = {
  // XXX: this will shadow a member property called clone. Do we need this?
  clone: function() {
    // XXX: todo
    return this;
  },
  
  $persisted: function() {
    return ('_id' in this && this._id !== null);
  },
  
  $update: function(modifier) {
    this.$collection.update(this._id, modifier);
  },
  
  $save: function() {
    var self = this;
    
    // XXX: validations?
    
    // XXX: cancel if a before save returns false?
    _.each(self.constructor._beforeSaveCallbacks, function(cb) {
      return cb(self);
    });
    
    var attributes = {};
    _.each(self, function(value, key) {
      // XXX: filter out errors when we add them
      attributes[key] = value;
    });
    
    if (self.$persisted()) {
      self.$update({$set: attributes})
    } else {
      self._id = self.$collection.insert(attributes);
    }
    
    return self;
  },
  
  $destroy: function() {
    if (this.$persisted()) {
      this.$collection.remove(this._id);
    }
  },
  
  // use this to store a "un-saved" but reactive version of this
  // document in this client
  $storeAs: function(name) {
    Session.set(name, this);
    //   ctor: this.constructor,
    //   data: this
    // });
  }
}

Model.$getStored = function(name) {
  return new this(Session.get(name));
}

// XXX: I'm pretty certain there are better ways to do this.
// but it does what I need it to, for now.
//
// problems: 1. can't extend sub-"classes" of Model
// 2. can't call super
Model.extend = function(properties) {
  // special named method 'initialize'
  var init = function() {};
  if (typeof properties.initialize === 'function') {
    init = properties.initialize;
    delete properties.initialize;
  }
    
  var ctor = function(attrs) {
    Model.call(this, attrs);
    init.call(this, attrs);
  }
  
  // 'copy' over instance methods
  ctor.prototype = new Model();
  _.extend(ctor.prototype, properties);
  ctor.prototype.constructor = ctor;
  
  // really copy over class methods / attributes
  for (var key in Model) {
    var value = Model[key];
    if (_.isFunction(value)) {
      ctor[key] = value;
    } else {
      ctor[key] = _.clone(value);
    }
  }
  
  // a function to use for Collection::transform
  ctor.transform = function(attrs) {
    return new ctor(attrs);
  }
  
  return ctor;
}

// no-one should ever call before save on the model, but they could;
Model._beforeSaveCallbacks = [];
Model.beforeSave = function(callback) {
  if (_.isFunction(callback))
    this._beforeSaveCallbacks.push(callback);
}