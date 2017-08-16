'use strict';

class GuideController {
  $onInit() {
    this.pageHtml = this.pageData;
  }
}

angular.module('UserGuideApp')
    .component('guideComponent', {
      controller: GuideController,
      templateUrl: 'components/page/guide/guide.view.html',
      bindings: {
        pageData: '<' // resolved data
      }
    });

