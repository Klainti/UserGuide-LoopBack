'use strict';
// TODO change show name, popUp view
class ShowPopUpController {
  constructor($mdDialog, $state, Resources) {
    this.$mdDialog = $mdDialog;
    this.Pictures = Resources.getPictureUrl();
    this.$onInit();
  }
  $onInit() {
    this.Pictures.get({ command: 'show' }, (res) => {
      this.pictures = res.imageNames;
    }, (error) => {
      console.log(error.message);
    });
  }
  deleteBtn(path) {
    const index = this.pictures.indexOf(path);
    this.pictures.splice(index, 1);
    this.Pictures.delete({ path });
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
      console.log(res);
    }, () => {
      console.log('Canceled showPictures');
    });
  }
}

angular.module('UserGuideApp')
    .component('showPictures', {
      controller: ShowPicturesController,
      templateUrl: 'components/editor/markdown/show/show.view.html'
    });

