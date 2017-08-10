'use strict';

class MarkdownController {
  constructor() {
    this.editing = true;
  }
  editBtn() {
    this.editing = true;
  }
  previewBtn() {
    this.editing = false;
    this.onPreview();
  }
  upload(picURL, picName) {
    this.onUpload({ picURL, picName });
  }
  addLink(linkText, linkUrl) {
    this.onLink({ linkText, linkUrl });
  }
}

angular.module('UserGuideApp')
    .component('markdown', {
      controller: MarkdownController,
      templateUrl: 'components/editor/markdown/markdown.view.html',
      bindings: {
        markdown: '=',
        onPreview: '&',
        onUpload: '&',
        onLink: '&',
        previewHtml: '<'
      }
    });

