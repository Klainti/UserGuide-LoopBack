'use strict';

class UploadPopUpController {
  constructor($mdDialog, $q, Picture, Upload) {
    this.$mdDialog = $mdDialog;
    this.$q = $q;
    this.Picture = Picture;
    this.Upload = Upload;
    this.isDone = false;
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
    this.isDone = false;
    this.Upload.base64DataUrl(this.images)
      .then((imagesBase64) => {
        let promises = [];
        for(let i=0; i > imagesBase64.length; i++) {
          let promise = this.Picture.create({name: this.images[i].name, data: imagesBase64[i]}).$promise;
          promises.push(promise);
        }
        return this.$q.all(promises);
       })
      .then(() => {
        this.isDone = true;
      })
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

