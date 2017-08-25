'use strict';

class GuideController {
  constructor($stateParams, Markdown) {
    this.$stateParams = $stateParams;
    this.Markdown = Markdown;
  }
  $onInit() {
    this.pageHtml = this.pageData;
    if (this.$stateParams.id === '0') {
      this.updatePath({ command: '', path: '/', newFileID: '' });
    } else {
      this.Markdown.findById({ id: this.$stateParams.id }, (res) => {
        this.updatePath({ command: '', path: res.path, newFileID: '' });
      });
    }
  }
}

angular.module('UserGuideApp')
    .component('guideComponent', {
      controller: GuideController,
      templateUrl: 'components/page/guide/guide.view.html',
      bindings: {
        pageData: '<', // resolved data
        updatePath: '&'
      }
    });

