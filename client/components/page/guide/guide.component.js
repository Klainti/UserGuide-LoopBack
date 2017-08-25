'use strict';

class GuideController {
  constructor($stateParams, Markdown) {
    this.$stateParams = $stateParams;
    this.Markdown = Markdown;
  }
  $onInit() {
    this.pageHtml = this.pageData;
    if (this.$stateParams.id === '0') {
      this.updatePath({ path: '/' });
    } else {
      this.Markdown.findById({ id: this.$stateParams.id }, (res) => {
        this.updatePath({ path: res.path });
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

