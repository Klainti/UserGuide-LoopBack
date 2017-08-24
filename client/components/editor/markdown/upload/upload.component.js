'use strict';

class UploadPopUpController {
  constructor($mdDialog, $q, Picture, Upload) {
    this.$mdDialog = $mdDialog;
    this.$q = $q;
    this.Picture = Picture;
    this.Upload = Upload;
    this.isDone = false;
    this.insertWebFlag = true;
    this.insertLocalFlag = true;
    this.images = [];
  }
  ok(urlErr, nameErr) {
    if (!urlErr.required && !nameErr.required) {
      this.$mdDialog.hide({ picURL: this.picURL, picName: this.picName, insertFlag: this.insertWebFlag, command: 'web' });
    }
  }
  cancel() {
    this.$mdDialog.cancel();
  }
  submit() {
    this.isDone = false;
    this.Upload.base64DataUrl(this.images)
      .then((imagesBase64) => {
        const promises = [];
        for (let i = 0; i < imagesBase64.length; i++) {
          const promise = this.Picture.create({ name: this.images[i].name, data: imagesBase64[i] }).$promise;
          promises.push(promise);
        }
        return this.$q.all(promises);
      })
      .then((images) => {
        this.isDone = true;
        this.$mdDialog.hide({ id: images[0].id, insertFlag: this.insertLocalFlag, command: 'local' });
      });
  }
  deleteImage(name) {
    for (let i = 0; i < this.images.length; i++) {
      if (this.images[i].name === name) {
        this.images.splice(i, 1);
        return;
      }
    }
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
      if (res.command === 'local') {
        if (res.insertFlag) {
          this.onInsertPicture({ id: res.id });
        }
      } else {
        this.Picture.download({ name: res.picName, url: res.picURL }, (data) => {
          if (res.insertFlag) {
            this.onInsertPicture({ id: data.id });
          }
        }, (error) => {
          console.log(error.message);
        });
      }
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

