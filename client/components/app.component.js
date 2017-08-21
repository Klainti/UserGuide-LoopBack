'use strict';

class AppController {
  constructor(ngConfig, $state, Folder) {
    this.ngConfig = ngConfig;
    this.$state = $state;
    this.Folder = Folder;
  }
  userGuideBtn() {
    this.path = '/';
    this.Folder.getContent({ path: '/' }, (res) => {
      this.catalog = res.list;
      this.$state.go(this.ngConfig.prefix, {id: this.ngConfig.initID });
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
      controller: ['ngConfig', '$state', 'Folder', AppController],
      templateUrl: 'components/app.view.html',
      bindings: {
        isAdmin: '@'
      }
    });
