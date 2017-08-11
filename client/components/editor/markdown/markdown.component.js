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
  insertPicture(id) {
    this.markdown = MarkdownController.insertPictureToEditor(id, this.markdown);
  }
  addLink(linkText, linkUrl) {
    this.Link.get({ linkText, linkUrl }, (res) => {
      console.log(res.link);
      this.markdown = MarkdownController.addLinkToEditor(res.link, this.markdown);
    }, (error) => {
      console.log(error.message);
    });
  }
  static insertPictureToEditor(id, markdown) {
    const pictureLink = `![](/api/Pictures/${id})`;
    const element = angular.element(document.querySelector('#markdownEditor'))[0];
    const startPos = element.selectionStart;
    const endPos = element.selectionEnd;
    return markdown.substring(0, startPos) + pictureLink +
      markdown.substring(endPos, markdown.length);
  }
  static addLinkToEditor(link, markdown) {
    const element = angular.element(document.querySelector('#markdownEditor'))[0];
    const startPos = element.selectionStart;
    const endPos = element.selectionEnd;
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
        previewHtml: '<'
      }
    });

