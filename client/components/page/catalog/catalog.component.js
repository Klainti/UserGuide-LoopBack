'use strict';

class CatalogController {
  constructor($mdDialog, $stateParams, Resources, Folder) {
    this.$mdDialog = $mdDialog;
    this.Folder = Folder;
    this.Show = Resources.getShowUrl();
    this.Markdown = Resources.getMarkdownUrl();
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
  deleteBtn(id, type) {
    this.$mdDialog.show(
        this.$mdDialog.confirm()
            .title(`Delete ${type}`)
            .textContent('Are you sure you want to delete?')
            .ok('Ok')
            .cancel('Cancel')
    ).then(() => {
      this.Markdown.delete({ id, type }, (res) => {
        this.catalogList = res.list;
        this.catalogPath = res.list[0].path;
        console.log(`Deleted ${type} with id ${id}`);
      });
    }, () => {
      console.log('Canceled delete');
    });
  }
  goBackBtn() {
    this.newFileId = '';
    console.log(this.catalogPath);
    const path = CatalogController.pathSlice(this.catalogPath);
    console.log(path);
    this.Folder.getContent({ path }, (res) => {
      console.log(res.list);
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
    if (res.length === 2) {
      return '/';
    } else {
      return path.slice(path.lastIndexOf('/'));
    }
  }
  static pathAppend(path, folderName) {
    return `${path}/${folderName}`;
  }
}

angular.module('UserGuideApp')
    .component('catalogComponent', {
      controller: CatalogController,
      templateUrl: 'components/page/catalog/catalog.view.html',
      bindings: {
        catalogList: '<',
        catalogPath: '<',
        newFileId: '<',
        fileCommand: '<',
        isAdmin: '<'
      }
    });

