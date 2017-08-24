'use strict';

class EditorController {
  constructor($state, $mdDialog, $q, Markdown, ngConfig) {
    this.$state = $state;
    this.$mdDialog = $mdDialog;
    this.$q = $q;
    this.Markdown = Markdown;
    this.ngConfig = ngConfig;
  }
  $onInit() {
    this.markdown = this.markdownDetails.data;
    this.id = this.markdownDetails.id;
    this.name = this.markdownDetails.name;
    this.path = this.markdownDetails.path;
  }
  goBackBtn() {
    this.$state.go(this.ngConfig.prefix, { id: this.ngConfig.initID });
  }
  preview() {
    if (this.markdown !== '') {
      this.Markdown.preview({ data: this.markdown }, (res) => {
        this.previewHtml = res.html;
      }, (error) => {
        console.log(error.message);
      });
    } else {
      this.previewHtml = '';
    }
  }
  save(id, name, oldName, path, oldPath) {
    let existedId;
    let saveInfo;
    if (name === oldName && path === oldPath) {
      // update markdown data only
      this.Markdown.prototype$patchAttributes({ id }, { data: this.markdown }, () => {
        this.onEditorSave({ command: 'update', path, newFileID: id });
      });
    } else {
      // check if there is already a markdown with the given name and path
      this.Markdown.findOne({ filter: { where: { name, path } } }).$promise
        .then((res) => {
          if (res.modelInstance !== undefined) {
            existedId = res.modelInstance.id;
            const confirm = this.$mdDialog.confirm()
              .title('Would you like to overwrite ?')
              .textContent(`There is already a markdown with name: ${name} and path: ${path}`)
              .ariaLabel('Overwrite')
              .ok('YES')
              .cancel('NO');
            return this.$mdDialog.show(confirm);
          }
          return this.$q.resolve();
        })
        .then((res) => {
          if (res === true) {
            // overwrite/update data to an existing markdown
            saveInfo = { command: 'update', path, newFileID: existedId};
            return this.Markdown.prototype$patchAttributes({ id: existedId }, { data: this.markdown, }).$promise;
          } else if (res === undefined) {
            // create a new markdown and save data
            saveInfo = { command: 'save', path };
            return this.Markdown.create({ name, path, data: this.markdown }).$promise;
          }
        })
        .then((res) => {
          if (saveInfo.command === 'save') {
            saveInfo.newFileID = res.id;
          }
          if (id !== '0') { // we already created/moved the markdown to a new path (or created a new one on the same folder with another name), so delete the previous markdown
            this.Markdown.deleteById({ id }, () => {
              console.log(`Deleted MD with id ${id}`);
              this.$state.go('editor', { id: res.id, name, path });
              this.onEditorSave(saveInfo);
            });
          } else {
            this.$state.go('editor', { id, name, path });
            this.onEditorSave(saveInfo);
          }
        })
        .catch((error) => {
          console.log('catch error');
          console.log(error);
        });
    }
  }
}

angular.module('UserGuideApp')
  .component('editorComponent', {
    controller: ['$state', '$mdDialog', '$q', 'Markdown', 'ngConfig', EditorController],
    templateUrl: 'components/editor/editor.view.html',
    bindings: {
      markdownDetails: '<', // resolved data
      onEditorSave: '&'
    }
  });
