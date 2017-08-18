'use strict';

class EditorController {
  constructor($state, $stateParams, $mdDialog, $q, Markdown) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$mdDialog = $mdDialog;
    this.$q = $q;
    this.Markdown = Markdown;
  }
  $onInit() {
    this.markdown = this.markdownData;
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
      // update data only (markdown)
      this.Markdown.prototype$patchAttributes({ id }, { data: this.markdown, }, () => {
        this.onEditorSave({ command: 'update', path, newFileID: id });
      });
    } else {
      // check if there is already a markdown with the given name and path
      this.Markdown.findOne({ filter: { where: { name, path }}}).$promise
        .then((res) => {
          if (res.modelInstance !== undefined ) {
            existedId = res.modelInstance.id;
            const confirm = this.$mdDialog.confirm()
              .title('Would you like to overwrite ?')
              .textContent(`There is already a markdown with name: ${name} and path: ${path}`)
              .ariaLabel('Overwrite')
              .ok('YES')
              .cancel('NO');
            return this.$mdDialog.show(confirm);
          } else {
            return this.$q.resolve();
          }
        })
        .then((res) => {
          if (res === true) {
            // overwrite/update data to an existing markdown
            saveInfo = { command: 'update', path, newFileID: existedId};
            return this.Markdown.prototype$patchAttributes({ id: existedId }, { data: this.markdown, }).$promise;
          } else if (res === undefined) {
            // create a new markdown and save data
            saveInfo = { command: 'save', path };
            return this.Markdown.create( { name, path, data: this.markdown }).$promise;
          }
        })
        .then((res) => {
          if (saveInfo.command === 'save') {
            saveInfo.newFileID = res.id;
          }
          if (id !== '0') {
            // we already moved the markdown to a new path (or changed the name), so delete the previous markdown
            this.Markdown.deleteById({ id }, () => {
              console.log(`Deleted MD with id ${id}`);
              this.onEditorSave(saveInfo);
            });
          }
          this.onEditorSave(saveInfo);
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
    controller: EditorController,
    templateUrl: 'components/editor/editor.view.html',
    bindings: {
      markdownData: '<', // resolved data
      onEditorSave: '&'
    }
  });
