'use strict';

class AppController {
  constructor(ngConfig, $state, Folder) {
    this.ngConfig = ngConfig;
    this.$state = $state;
    this.Folder = Folder;
    this.folderFlag = true; // Just a flag to trigger onChanges to catalogComponent, not using the real value
  }
  userGuideBtn() {
    this.path = '/';
    this.Folder.getContent({ path: '/' }, (res) => {
      this.catalog = res.list;
      this.$state.go(this.ngConfig.prefix, { id: this.ngConfig.initID });
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
    if (command === 'save') {
      this.folderFlag = !this.folderFlag;
    }
  }
  updatePath(path) {
    this.Folder.getContent({ path }, (res) => {
      this.catalog = res.list;
      this.path = path;
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
