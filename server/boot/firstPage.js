'use strict';

const showdown = require('showdown');

const converter = new showdown.Converter();

/* Welcome Page */
module.exports = (app) => {
  const router = app.loopback.Router();
  router.get('/page', (req, res) => {
    app.models.Markdown.findOne({ where: { name: req.query.name, path: req.query.path } })
      .then((result) => {
        console.log(result);
        const html = converter.makeHtml(result.data);
        res.status(200).json({ html });
      })
      .catch((error) => {
        res.status(400).json({ message: error });
      });
  });
  app.use(router);
};
