'use strict';

class AppController {
  constructor($state, Folder) {
    this.$state = $state;
    this.Folder = Folder;
  }
  userGuideBtn() {
    this.path = '/'; // TODO binding not loading correctly
    this.Folder.getContent({ path: '/' }, (res) => {
      this.catalog = res.list;
      this.$state.go('guide', {id: '59944d89925bec7138ef580f' });
    }, (error) => {
      console.log(error.message);
      this.catalog = undefined;
      this.path = '';
    });
  }
  updateCatalog(command, path, newFileID) {
    this.Folder.getContent({ path }, (res) => {
      this.catalog = res.list;
      this.command = command;
      this.path = path;
      this.newItem = newFileID;
    });
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
