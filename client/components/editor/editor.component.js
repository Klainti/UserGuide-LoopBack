'use strict';

class EditorController {
  constructor($state, $stateParams, Markdown) {
    this.$state = $state;
    this.$stateParams = $stateParams;
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
  save(id, name, path, oldPath) {
    if (id === '') {
      this.Markdown.upsertWithWhere({ where: { name, path } }, { name, path, data: this.markdown }, (res) => {
        console.log(res);
        this.onEditorSave({ command: 'save', list: res.list, newFileID: res.newFile, path: res.path });
      }, (error) => {
        console.log(error.message);
      });
    } else {
      this.Markdown.prototype$patchAttributes({ id }, { name, path, data: this.markdown, oldPath }, (data) => {
        if (path === oldPath) {
          this.$state.go('editor', {id: this.$stateParams.id, name, path});
          this.onEditorSave({ command: 'update', list: data.list, path: null, newFileID: id });
        } else {
          this.$state.go('editor', {id: this.$stateParams.id, name, path});
          this.onEditorSave({ command: 'move', list: data.list, path: data.path, newFileID: id });
        }
      }, (error) => {
        console.log(error.message);
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
