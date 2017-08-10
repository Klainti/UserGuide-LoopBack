'use strict';

class MarkdownController {
  constructor(Resources) {
    this.Link = Resources.getConvertLinkUrl();
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
    this.Link.get({ linkText, linkUrl }, (res) => {
      console.log(res.link);
      this.markdown = this.addLinkToEditor(res.link, this.markdown);
    }, (error) => {
      console.log(error.message);
    });
  }
  addLinkToEditor(link, markdown) {
    const element = angular.element(document.querySelector('#markdownEditor'))[0];
    const startPos = element.selectionStart;
    const endPos = element.selectionEnd;
    // const scrollTop = element.scrollTop;
    return markdown.substring(0, startPos) + link +
        markdown.substring(endPos, markdown.length);
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
        previewHtml: '<'
      }
    });

