'use strict';

const UserGuideApp = angular.module('UserGuideApp', ['ui.router', 'ngMaterial', 'ngResource', 'ngSanitize', 'ngMessages', 'lbServices']);

UserGuideApp.constant('ngConfig' ,{
  'prefix': 'guide',
  'initID': '59944d89925bec7138ef580f'
});

UserGuideApp.config(($stateProvider, $urlRouterProvider, $locationProvider, ngConfig) => {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise(`/${ngConfig.prefix}/${ngConfig.initID}`);

  $stateProvider
      .state(ngConfig.prefix, {
        url: `/${ngConfig.prefix}/:id`,
        component: 'guideComponent',
        params: {
          id: null
        },
        resolve: {
          pageData: ($stateParams, Markdown) => {
            return Markdown.getHtml({ id: $stateParams.id }).$promise
              .then(res => res.html);
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
          markdownDetails: ($stateParams, Markdown) => {
            if ($stateParams.id === '0') {
              return '';
            }
            return Markdown.findById({ id: $stateParams.id }).$promise;
          },
        }
      });
});

