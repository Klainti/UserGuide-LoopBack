'use strict';

class SavePopUpController {
  constructor($mdDialog, path) {
    this.$mdDialog = $mdDialog;
    this.path = path;
  }
  ok(error) {
    if (!error.required) {
      this.$mdDialog.hide({ path: this.path });
    }
  }
}

class SaveMarkdownController {
  constructor($mdDialog, $stateParams) {
    this.$mdDialog = $mdDialog;
    this.$stateParams = $stateParams;
  }
  saveBtn() {
    this.$mdDialog.show({
      templateUrl: 'components/editor/save/save.popup.html',
      locals: { path: this.$stateParams.path },
      controller: SavePopUpController,
      controllerAs: 'ctrl',
      clickOutsideToClose: true
    }).then((res) => {
      console.log('ID = ' + this.$stateParams.id);
      console.log('PREV PATH = ' + this.$stateParams.path);
      console.log('INPUT PATH = ' + res.path);
      if (this.$stateParams.id === '0') {
        this.onSave({ id: this.$stateParams.id, path: res.path });
      } else if (this.$stateParams.path === res.path) {
        this.onSave({ id: this.$stateParams.id, path: '' });
      } else {
        this.onSave({ id: this.$stateParams.id, path: res.path });
      }
    }, () => {
      console.log('Canceled save');
    });
  }
}

angular.module('UserGuideApp')
    .component('saveMarkdown', {
      controller: SaveMarkdownController,
      templateUrl: 'components/editor/save/save.view.html',
      bindings: {
        onSave: '&'
      }
    });
