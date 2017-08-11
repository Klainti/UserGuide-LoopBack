'use strict';

class EditorController {
  constructor(Resources, Markdown) {
    this.Pictures = Resources.getPictureUrl();
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
  save(id, path) {
    if (id === '0') {
      this.Markdown.save({ command: 'save', path, markdown: this.markdown }, (data) => {
        this.onEditorSave({ command: 'save', list: data.list, path, newFileID: data.newFileID });
      }, (error) => {
        console.log(error.message);
      });
    } else if (path === '') {
      this.Markdown.update({ id, markdown: this.markdown }, () => {
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
