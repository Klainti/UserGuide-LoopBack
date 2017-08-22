'use strict';

const showdown = require('showdown');

const converter = new showdown.Converter();

class Utils {
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
  ConvertToHtml(markdownText) {
    try {
      const html = converter.makeHtml(markdownText);
      return Promise.resolve(html);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

module.exports = Utils;
