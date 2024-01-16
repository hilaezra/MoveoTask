const mongoose = require('mongoose');

const codeBlockSchema = new mongoose.Schema({
    title: {
      type: String
    },
    code: {
      type: String
    },
    solutionCode: {
      type: String
    }
  });

  module.exports = mongoose.model('CodeBlock', codeBlockSchema, 'CodeBlock');
