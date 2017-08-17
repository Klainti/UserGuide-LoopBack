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
  editorBtn() {
    this.path = '/'; // TODO binding not loading correctly
    this.Folder.getContent({ path: '/' }, (res) => {
      this.catalog = res.list;
      this.$state.go('editor', {id: '0', name: '', path: ''});
    }, (error) => {
      console.log(error.message);
      this.catalog = undefined;
      this.path = '';
    });
  }
  updateCatalog(command, list, path, newFileID) {
    if (command === 'save' || command === 'move') {
      this.catalog = list;
      this.path = path;
      this.newItem = newFileID;
      this.command = 'save';
    } else if (command === 'update') {
      this.catalog = list;
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
