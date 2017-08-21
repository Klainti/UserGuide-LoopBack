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
  constructor($mdDialog) {
    this.$mdDialog = $mdDialog;
  }
  saveBtn() {
    this.$mdDialog.show({
      templateUrl: 'components/editor/save/save.popup.html',
      locals: { name: this.markdownName, path: this.markdownPath },
      controller: SavePopUpController,
      controllerAs: 'ctrl',
      clickOutsideToClose: true
    }).then((res) => {
      if (this.markdownId === '0') {
        this.onSave({ id: '0', name: res.name, path: res.path });
      } else {
        this.onSave({ id: this.markdownId, name: res.name, oldName: this.markdownName, path: res.path, oldPath: this.markdownPath });
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
        onSave: '&',
        markdownId: '<',
        markdownName: '<',
        markdownPath: '<'
      }
    });
