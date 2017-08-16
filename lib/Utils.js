'use strict';

const showdown = require('showdown');

const converter = new showdown.Converter();

class Utils {
  CreateList(buffer) {
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
    return list;
  }
  ConvertToHtml(markdownText) {
    try {
      const html = converter.makeHtml(markdownText);
      return ([null, html]);
    } catch (error) {
      return ([error, null]);
    }
  }
}

module.exports = Utils;
