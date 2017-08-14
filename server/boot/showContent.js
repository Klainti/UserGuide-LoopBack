'use strict';

/* Show folders and markdowns for the requested path */
module.exports = (app) => {
  const router = app.loopback.Router();
  router.get('/show', (req, res) => {
    app.FS.getTreeByPath(req.query.path)
      .then((result) => {
        const list = app.catalog.CreateList(result);
        res.status(200).json({ list });
      })
      .catch((error) => {
        res.status(400).json({ message: error });
      });
  });
  app.use(router);
};
