'use strict';

class CatalogController {
  constructor($mdDialog, $stateParams, Folder, Markdown) {
    this.$mdDialog = $mdDialog;
    this.$stateParams = $stateParams;
    this.Folder = Folder;
    this.Markdown = Markdown;
  }
  $onInit() {
    this.newFileId = '';
    this.fileCommand = '';
    this.Folder.getContent({ path: '/'}, (res) => {
      this.catalogPath = '/';
      this.catalogList = res.list;
    }, (error) => {
      console.log(error);
      this.catalogList = undefined;
      this.catalogPath = '';
    });
  }
  pathSubmit() {
    this.Folder.getContent({ path: this.catalogPath }, (res) => {
      this.catalogList = res.list;
    });
  }
  deleteBtn(id, name) {
    this.$mdDialog.show(
        this.$mdDialog.confirm()
            .title(`Are you sure you want to delete ${name} ?`)
            .ok('Ok')
            .cancel('Cancel')
    ).then(() => {
      this.Markdown.deleteById({ id }, (res) => {
        console.log(`Deleted MD with id ${id}`);
        this.catalogPath = res.path;
        this.Folder.getContent({ path: res.path }, (res) => {
          this.catalogList = res.list;
        });
      });
    }, () => {
      console.log('Canceled delete');
    });
  }
  goBackBtn() {
    this.newFileId = '';
    const path = CatalogController.pathSlice(this.catalogPath);
    this.Folder.getContent({ path }, (res) => {
      this.catalogList = res.list;
      this.catalogPath = path;
    });
  }
  openFolder(name) {
    const path = CatalogController.pathAppend(this.catalogPath, name);
    this.Folder.getContent({ path }, (res) => {
      this.catalogList = res.list;
      this.catalogPath = path;
    });
  }
  setItemColor(id) {
    if (this.newFileId === id && this.fileCommand === 'save') {
      return { 'color': 'green' };
    } else if (this.newFileId === id && this.fileCommand === 'update') {
      return { 'color': 'orange' };
    }
    return { 'color': 'blue' };
  }
  static pathSlice(path) {
    const res = path.split('/');
    if (res.length <= 2) {
      return '/';
    } else {
      return path.slice(0, path.lastIndexOf('/'));
    }
  }
  static pathAppend(path, folderName) {
    const res = path.split('/');
    if (res.length === 2 && path.length === 1) {
      return `/${folderName}`;
    } else {
      return `${path}/${folderName}`;
    }
  }
}

angular.module('UserGuideApp')
    .component('catalogComponent', {
      controller: CatalogController,
      templateUrl: 'components/page/catalog/catalog.view.html',
      bindings: {
        fileCommand: '<',
        catalogList: '<',
        catalogPath: '=',
        newFileId: '<',
        isAdmin: '<'
      }
    });

