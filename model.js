Model = function(attributes) {
  this.attributes = attributes;
  this.id = attributes._id;
  
  if (this.id)
    delete attributes._id;
  
  // begin with no errors
  this.errors = {};
}

Model.prototype = {
  persisted: function() {
    return ('id' in this && this.id != null);
  },
  
  save: function() {
    if (this.persisted()) {
      this.constructor._collection.update(this.id, this.attributes);
    } else {
      this.id = this.constructor._collection.insert(this.attributes);
    }
    
    return this;
  },
  
  update_attributes: function(attrs) {
    for (key in attrs) {
      this.attributes[key] = attrs[key];
    }
    return this.save();
  },
  
  update_attribute: function(key, value) {
    var attrs = {};
    attrs[key] = value;
    return this.update_attributes(attrs);
  },
  
  destroy: function() {
    if (this.persisted()) {
      this.constructor._collection.remove(this.id);
    }
  }
}