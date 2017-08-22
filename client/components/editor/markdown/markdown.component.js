'use strict';

class MarkdownController {
  constructor(Markdown) {
    this.Markdown = Markdown;
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
  addLink(link) {
    this.markdown = MarkdownController.addLinkToEditor(link, this.markdown);
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

