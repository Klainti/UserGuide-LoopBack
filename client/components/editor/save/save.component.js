'use strict';

class SavePopUpController {
  constructor($mdDialog, name, path) {
    this.$mdDialog = $mdDialog;
    this.name = name;
    this.path = path;
  }
  ok(nameErr, pathErr) {
    if (!nameErr.required && !pathErr.required) {
      this.$mdDialog.hide({ name: this.name, path: this.path });
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
      locals: { path: this.$stateParams.path, name: this.$stateParams.name },
      controller: SavePopUpController,
      controllerAs: 'ctrl',
      clickOutsideToClose: true
    }).then((res) => {
      if (this.$stateParams.id === '0') {
        this.onSave({ id: this.$stateParams.id, name: res.name, path: res.path });
      } else if (this.$stateParams.path === res.path) {
        this.onSave({ id: this.$stateParams.id, name: '', path: '' });
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
