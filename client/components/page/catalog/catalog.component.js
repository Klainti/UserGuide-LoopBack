'use strict';

class CatalogController {
  constructor($mdDialog, $stateParams, Folder) {
    this.$mdDialog = $mdDialog;
    this.Folder = Folder;
    this.$stateParams = $stateParams;
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
    }, (error) => {
      console.log(error.message);
      this.catalogList = undefined;
      this.catalogPath = '';
    });
  }
  deleteBtn(id) {
    this.$mdDialog.show(
        this.$mdDialog.confirm()
            .title(`Delete ${type}`)
            .textContent('Are you sure you want to delete?')
            .ok('Ok')
            .cancel('Cancel')
    ).then(() => {
      this.Markdown.deleteById({ id }, (res) => {
        this.catalogList = res.list;
        this.catalogPath = res.path;
        console.log(`Deleted MD with id ${id}`);
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
    }, (error) => {
      console.log(error.message);
      this.catalogList = undefined;
      this.catalogPath = '';
    });
  }
  openFolder(name) {
    const path = CatalogController.pathAppend(this.catalogPath, name);
    this.Folder.getContent({ path }, (res) => {
      this.catalogList = res.list;
      this.catalogPath = path;
    }, (error) => {
      console.log(error.message);
      this.catalogList = undefined;
      this.catalogPath = '';
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

