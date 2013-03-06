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
    var attributes = {};
    _.each(this, function(value, key) {
      // XXX: filter out errors if we need them
      attributes[key] = value;
    });
    
    if (this.$persisted()) {
      this.$update({$set: attributes})
    } else {
      this._id = this.$collection.insert(attributes);
    }
    
    return this;
  },
  
  $destroy: function() {
    if (this.$persisted()) {
      this.$collection.remove(this._id);
    }
  }
}

Model.extend = function(properties) {
  // special named method 'initialize'
  var init = function() {};
  if (typeof properties.initialize === 'function') {
    init = properties.initialize;
    delete properties.initialize;
  }
    
  var ctor = function(attrs) {
    Model.call(this, attrs);
    init();
  }
    
  ctor.prototype = new Model();
  _.extend(ctor.prototype, properties);
  ctor.prototype.constructor = ctor;
    
  return ctor;
}