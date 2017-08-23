'use strict';

class UploadPopUpController {
  constructor($mdDialog, Picture, Upload) {
    this.$mdDialog = $mdDialog;
    this.Picture = Picture;
    this.Upload = Upload;
    this.insertFlag = true;
  }
  ok(insertFlag, urlErr, nameErr) {
    if (!urlErr.required && !nameErr.required) {
      this.$mdDialog.hide({picURL: this.picURL, picName: this.picName, insertFlag});
    }
  }
  cancel() {
    this.$mdDialog.cancel();
  }
  submit() {
    this.Upload.base64DataUrl(this.images).then((imagesBase64) => {
      console.log(imagesBase64);
      for(let i=0; i < imagesBase64.length; i++) {
        this.Picture.create({name: this.images[i].name, data: imagesBase64[i]});
      }
    });
  }
}

class UploadController {
  constructor($mdDialog, Picture) {
    this.$mdDialog = $mdDialog;
    this.Picture = Picture;
  }
  uploadBtn() {
    this.$mdDialog.show({
      templateUrl: 'components/editor/markdown/upload/upload.popup.html',
      controller: UploadPopUpController,
      controllerAs: 'ctrl',
      clickOutsideToClose: true
    }).then((res) => {
      this.Picture.download({ name: res.picName, url: res.picURL }, (data) => {
        if (res.insertFlag) {
          this.onInsertPicture({id: data.id});
        }
      }, (error) => {
        console.log(error.message);
      });
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
        onInsertPicture: '&'
      }
    });

