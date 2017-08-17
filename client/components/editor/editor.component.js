'use strict';

class EditorController {
  constructor($state, $stateParams, $mdDialog, Markdown) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$mdDialog = $mdDialog;
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
  save(id, name, path, oldPath, overwrite) {
    if (id === '') {
      this.Markdown.create( {where: { overwrite }}, { name, path, data: this.markdown }, (res) => {
        console.log(res);
        this.onEditorSave({ command: 'save', list: res.list, newFileID: res.newFile, path: res.path });
      }, (error) => {
        console.log(error.message);
      });
    } else {
      this.Markdown.prototype$patchAttributes({ id }, { name, path, data: this.markdown, oldPath, overwrite }, (data) => {
        if (path === oldPath) {
          this.$state.go('editor', {id: this.$stateParams.id, name, path});
          this.onEditorSave({ command: 'update', list: data.list, path: null, newFileID: id });
        } else {
          this.$state.go('editor', {id: this.$stateParams.id, name, path});
          this.onEditorSave({ command: 'move', list: data.list, path: data.path, newFileID: id });
        }
      }, (error) => {
        if (error.status === 409) {
          this.overwritePopUp(name, path);
        }
      });
    }
  }
  overwritePopUp(name, path) {
    const confirm = $mdDialog.confirm()
      .title('Would you like to overwrite ?')
      .textContent(`There is already a markdown with name: ${name} and path: ${path}`)
      .ariaLabel('Overwrite')
      .ok('YES')
      .cancel('NO');

    $mdDialog.show(confirm).then(function() {
      this.save(id, name, path, oldPath, true);
    }, function() {
      console.log('Overwrite denied');
    });
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
