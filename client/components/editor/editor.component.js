'use strict';

class EditorController {
  constructor(Resources) {
    this.Pictures = Resources.getPictureUrl();
    this.Markdown = Resources.getMarkdownUrl();
    this.Link = Resources.getConvertLinkUrl();
  }
  $onInit() {
    this.markdown = this.markdownData;
  }
  upload(picURL, picName) {
    if (picURL !== undefined && picName !== undefined) {
      this.Pictures.save({ imageUrl: picURL, imageName: picName }, (res) => {
        console.log(res.message);
      }, (error) => {
        console.log(error.message);
      });
    }
  }
  link(linkText, linkUrl) {
    this.Link.get({ linkText, linkUrl }, (res) => {
      console.log(res.link);
      this.markdown = this.markdown.concat(res.link);
    }, (error) => {
      console.log(error.message);
    });
  }
  preview() {
    if (this.markdown !== '') {
      this.Markdown.save({ command: 'preview', markdown: this.markdown }, (data) => {
        this.previewHtml = data.convertedHtml;
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
        this.onEditorSave({ list: data.list, path, newFileID: data.newFileID });
      }, (error) => {
        console.log(error.message);
      });
    } else if (path === '') {
      this.Markdown.update({ id, markdown: this.markdown }, () => {
        this.onEditorSave({ list: null, path: null, newFileID: id });
      }, (error) => {
        console.log(error.message);
      });
    } else {
      this.Markdown.save({ command: 'move', id, path, markdown: this.markdown }, (data) => {
        this.onEditorSave({ list: data.list, path, newFileID: data.newFileID });
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
