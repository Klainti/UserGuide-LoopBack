'use strict';

const UserGuideApp = angular.module('UserGuideApp', ['ui.router', 'ngMaterial', 'ngResource', 'ngSanitize', 'ngMessages']);

UserGuideApp.config(($stateProvider, $urlRouterProvider, $locationProvider) => {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/guide/welcome.md');

  $stateProvider
      .state('guide', {
        url: '/guide/:id', // TODO /prefix/:id
        component: 'guideComponent',
        resolve: {
          welcomePage: ($stateParams, Resources) => {
            return Resources.getPageUrl().get({ id: $stateParams.id })
                .$promise.then(res => res.html);
          }
        }
      })
      .state('editor', {
        url: '/editor/:id',
        component: 'editorComponent',
        params: {
          id: null, // if 0, create else edit
          path: null
        },
        resolve: {
          markdownData: ($stateParams, Resources) => {
            if ($stateParams.id === '0') {
              return '';
            }
            return Resources.getMarkdownUrl().get({ id: $stateParams.id, command: 'edit' })
                .$promise.then(res => res.markdown);
          }
        }
      });
});
