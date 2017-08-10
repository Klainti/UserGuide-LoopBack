'use strict';

class CatalogController {
  constructor($mdDialog, $stateParams, Resources) {
    this.$mdDialog = $mdDialog;
    this.Show = Resources.getShowUrl();
    this.Markdown = Resources.getMarkdownUrl();
    this.$stateParams = $stateParams;
  }
  $onInit() {
    this.newFileId = '';
    this.fileCommand = '';
    this.Show.get((res) => {
      this.catalogList = res.list;
      this.catalogPath = '';
    }, (error) => {
      console.log(error);
      this.catalogList = undefined;
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
    this.Show.get({ id: this.catalogList[0].id, command: 'siblings', type: this.catalogList[0].type }, (res) => {
      this.catalogList = res.list;
      this.catalogPath = res.list[0].path;
    }, (error) => {
      console.log(error.message);
      this.catalogList = undefined;
    });
  }
  openFolder(id, name) {
    this.Show.get({ id }, (res) => {
      this.catalogList = res.list;
      this.catalogPath = res.list[0].path;
      console.log(name);
    }, (error) => {
      console.log(error.message);
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

