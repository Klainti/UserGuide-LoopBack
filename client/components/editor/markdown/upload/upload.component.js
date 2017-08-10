'use strict';

class UploadPopUpController {
  constructor($mdDialog) {
    this.$mdDialog = $mdDialog;
  }
  ok() {
    this.$mdDialog.hide({ picURL: this.picURL, picName: this.picName });
  }
  cancel() {
    this.$mdDialog.cancel();
  }
}

class UploadController {
  constructor($mdDialog) {
    this.$mdDialog = $mdDialog;
  }
  uploadBtn() {
    this.$mdDialog.show({
      templateUrl: 'components/editor/markdown/upload/upload.popup.html',
      controller: UploadPopUpController,
      controllerAs: 'ctrl'
    }).then((res) => {
      this.onMarkdownUpload({ picURL: res.picURL, picName: res.picName });
    }, () => {
      console.log('Canceled upload');
    });
  }
}

angular.module('UserGuideApp')
    .component('uploadPicture', {
      controller: UploadController,
      templateUrl: 'components/editor/markdown/upload/upload.view.html',
      bindings: {
        onMarkdownUpload: '&'
      }
    });

