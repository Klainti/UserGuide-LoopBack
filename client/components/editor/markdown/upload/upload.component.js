'use strict';

class UploadPopUpController {
  constructor($mdDialog, Upload) {
    this.$mdDialog = $mdDialog;
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
    console.log('SUBMIT LOCAL');
    console.log(this.picFile);
    this.Upload.upload({
      url: '/Pictures',
      data: { file: this.picFile }
    }).then(function (resp) {
      console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
    }, function (resp) {
      console.log('Error status: ' + resp.status);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
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
      this.Picture.create({ name: res.picName, url: res.picURL }, (data) => {
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

