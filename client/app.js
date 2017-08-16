'use strict';

const UserGuideApp = angular.module('UserGuideApp', ['ui.router', 'ngMaterial', 'ngResource', 'ngSanitize', 'ngMessages', 'lbServices']);

UserGuideApp.config(($stateProvider, $urlRouterProvider, $locationProvider) => {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/guide/59941d30f8a81962f2eb4b7f');

  $stateProvider
      .state('guide', {
        url: '/guide/:id', // TODO /prefix/:id
        component: 'guideComponent',
        params: {
          id: null
        },
        resolve: {
          pageData: ($stateParams, Markdown) => {
            return Markdown.getHtml({ id: $stateParams.id })
              .$promise.then(res => res.html);
          }
        }
      })
      .state('editor', {
        url: '/editor/:id',
        component: 'editorComponent',
        params: {
          id: null, // if 0 create else edit
          name: null,
          path: null
        },
        resolve: {
          markdownData: ($stateParams, Markdown) => {
            if ($stateParams.id === '0') {
              return '';
            }
            return Markdown.findById({ id: $stateParams.id })
                .$promise.then(res => res.data);
          }
        }
      });
});
