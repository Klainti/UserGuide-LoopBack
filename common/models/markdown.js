'use strict';

const showdown = require('showdown');

const converter = new showdown.Converter();

/* Convert a markdown to html! */
module.exports = (Markdown) => {
  Markdown.preview = (data, cb) => {
    try {
      const html = converter.makeHtml(data);
      cb(null, html);
    } catch (err) {
      cb(err, null);
    }
  };

  Markdown.remoteMethod('preview', {
    accepts: { arg: 'data', type: 'string' },
    returns: { arg: 'html', type: 'string' },
    http: { path: '/preview', verb: 'get' }
  });
};
