'use strict';

class GuideController {
  $onInit() {
    this.previewHtml = this.welcomePage;
  }
}

angular.module('UserGuideApp')
    .component('guideComponent', {
      controller: GuideController,
      templateUrl: 'components/page/guide/guide.view.html',
      bindings: {
        welcomePage: '<' // resolved data
      }
    });

