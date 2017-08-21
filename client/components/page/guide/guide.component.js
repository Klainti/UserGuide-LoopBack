'use strict';

class GuideController {
  constructor($stateParams, Markdown) {
    this.$stateParams = $stateParams;
    this.Markdown = Markdown;
  }
  $onInit() {
    this.pageHtml = this.pageData;
    this.Markdown.findById({ id: this.$stateParams.id }, (res) => {
      this.onNewMarkdown({ command: '', path: res.path, newFileID: '' });
    });
  }
}

angular.module('UserGuideApp')
    .component('guideComponent', {
      controller: GuideController,
      templateUrl: 'components/page/guide/guide.view.html',
      bindings: {
        pageData: '<', // resolved data
        onNewMarkdown: '&'
      }
    });

