'use strict';

class AddLinkPopUpController {
  constructor($mdDialog) {
    this.$mdDialog = $mdDialog;
  }
  ok() {
    this.$mdDialog.hide({ text: this.text, name: this.name, path: this.path });
  }
  cancel() {
    this.$mdDialog.cancel();
  }
}

class AddLinkController {
  constructor($mdDialog) {
    this.$mdDialog = $mdDialog;
  }
  addLinkBtn() {
    this.$mdDialog.show({
      templateUrl: 'components/editor/markdown/link/link.popup.html',
      controller: AddLinkPopUpController,
      controllerAs: 'ctrl'
    }).then((res) => {
      this.onAddLink({ text: res.text, name: res.name, path: res.path });
    }, () => {
      console.log('Canceled addLink');
    });
  }
}


angular.module('UserGuideApp')
    .component('addLink', {
      controller: AddLinkController,
      templateUrl: 'components/editor/markdown/link/link.view.html',
      bindings: {
        onAddLink: '&'
      }
    });
