'use strict';

class AppController {
  updateCatalog(command, list, path, newFileID) {
    if (command === 'save' || command === 'move') {
      this.catalog = list;
      this.path = path;
      this.newItem = newFileID;
      this.command = 'save';
    } else if (command === 'update') {
      this.newItem = newFileID;
      this.command = 'update';
    }
  }
}

angular.module('UserGuideApp')
    .component('appComponent', {
      controller: AppController,
      templateUrl: 'components/app.view.html',
      bindings: {
        isAdmin: '@'
      }
    });
