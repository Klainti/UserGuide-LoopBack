'use strict';

class EditorController {
  constructor(Markdown) {
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
  save(id, name, path) {
    if (id === '0') {
      this.Markdown.upsertWithWhere({ where: { name, path } }, { name, path, data: this.markdown }, (res) => {
        console.log(res);
        this.onEditorSave({ command: 'save', list: res.list, newFileID: res.newFile, path: res.path });
      }, (error) => {
        console.log(error.message);
      });
    } else if (name === '' && path === '') {
      this.Markdown.prototype$patchAttributes({ id, markdown: this.markdown }, () => {
        this.onEditorSave({ command: 'update', list: null, path: null, newFileID: id });
      }, (error) => {
        console.log(error.message);
      });
    } else {
      this.Markdown.save({ command: 'move', id, path, markdown: this.markdown }, (data) => {
        this.onEditorSave({ command: 'move', list: data.list, path, newFileID: data.newFileID });
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
