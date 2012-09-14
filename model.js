Model = function(attributes) {
  this.attributes = attributes || {};
  this.id = this.attributes._id;
  
  if (this.id)
    delete this.attributes._id;
  
  // begin with no errors
  this.errors = {};
}

Model.prototype = {
  _meteorRawData: function() {
    var data = _.extend({}, this.attributes);
    data._id = this.id;
    return data;
  },
  
  persisted: function() {
    return ('id' in this && this.id != null);
  },
  
  save: function(update) {
    
    if (this.persisted()) {
      if (_.isUndefined(update))
        update = {$set: this.attributes};
      
      this.constructor._collection.update(this.id, update);
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
