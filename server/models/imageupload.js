const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  data: {
    type: Buffer,
  },

  size: {
    type: Number,
  },


  mimetype: {
    type: String,
  },
});

// Finally we construct a model based on our schema above.
const FileModel = mongoose.model('FileModel', FileSchema);

module.exports = FileModel;