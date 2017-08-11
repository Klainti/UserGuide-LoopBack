'use strict';
// TODO change show name, popUp view
class ShowPopUpController {
  constructor($mdDialog, Picture) {
    this.$mdDialog = $mdDialog;
    this.Picture = Picture;
    this.$onInit();
  }
  $onInit() {
    this.Picture.find({ filter: { fields: {'name': true, 'id': true } } }, (res) => {
      console.log(res);
      this.pictures = res;
    }, (error) => {
      console.log(error.message);
    });
  }
  deleteBtn(picture) {
    const index = this.pictures.indexOf(picture);
    this.pictures.splice(index, 1);
    this.Picture.deleteById({ id: picture.id });
  }
  insertBtn(id) {
    this.$mdDialog.hide({ id });
  }
}

class ShowPicturesController {
  constructor($mdDialog) {
    this.$mdDialog = $mdDialog;
  }
  showPicturesBtn() {
    this.$mdDialog.show({
      templateUrl: 'components/editor/markdown/show/show.popup.html',
      controller: ShowPopUpController,
      controllerAs: 'ctrl',
      clickOutsideToClose: true
    }).then((res) => {
      this.onInsertPicture({ id: res.id });
    }, () => {
      console.log('Canceled showPictures');
    });
  }
}

angular.module('UserGuideApp')
    .component('showPictures', {
      controller: ShowPicturesController,
      templateUrl: 'components/editor/markdown/show/show.view.html',
      bindings: {
        onInsertPicture: '&'
      }
    });

