'use strict';

const showdown = require('showdown');
const config = require('../config.json');


const converter = new showdown.Converter();
const PathValidation = new RegExp(config.PathValidation, 'm');

class Utils {
  /* Create a list with content of a folder */
  createList(buffer) {
    const list = [];
    let type;

    /* Categorize folders and markdowns! */
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i].data) {
        type = 'md';
      } else {
        type = 'folder';
      }
      list.push({ id: buffer[i].id, name: buffer[i].name, type });
    }
    return list;
  }
  /* Converts a markdown to html */
  convertToHtml(markdownText) {
    return converter.makeHtml(markdownText);
  }
  /* Path Validation */
  async validPath(path) {
    if (!PathValidation.test(path) && path !== '/') {
      const error = new Error('Invalid Path');
      error.status = 400;
      return error;
    }
    return null;
  }
}

module.exports = Utils;
