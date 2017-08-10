'use strict';

class AddLinkPopUpController {
  constructor($mdDialog) {
    this.$mdDialog = $mdDialog;
  }
  ok() {
    this.$mdDialog.hide({ linkText: this.linkText, linkUrl: this.linkUrl });
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
      this.onAddLink({ linkText: res.linkText, linkUrl: res.linkUrl });
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
