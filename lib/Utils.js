'use strict';

const showdown = require('showdown');
const config = require('../server/config.json');


const converter = new showdown.Converter();
const PathValidation = new RegExp(config.PathValidation, 'm');

class Utils {
  /* Create a list with content of a folder */
  CreateList(buffer) {
    try {
      const list = [];
      let type;

      for (let i = 0; i < buffer.length; i++) {
        if (buffer[i].data) {
          type = 'md';
        } else {
          type = 'folder';
        }
        list.push({ id: buffer[i].id, name: buffer[i].name, type });
      }
      return Promise.resolve(list);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  /* Converts a markdown to html */
  ConvertToHtml(markdownText) {
    try {
      const html = converter.makeHtml(markdownText);
      return Promise.resolve(html);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  /* Path Validation */
  ValidPath(path) {
    try {
      if (!PathValidation.test(path) && path !== '/') {
        const error = new Error('Invalid Path');
        error.status = 400;
        return Promise.reject(error);
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

module.exports = Utils;
