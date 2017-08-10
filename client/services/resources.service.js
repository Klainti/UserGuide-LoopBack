'use strict';

const app = angular.module('UserGuideApp');


class Resources {
  constructor($resource) {
    this.$resource = $resource;
  }
  getShowUrl() {
    return this.$resource('/show/:id/:command', { id: '@id', command: '@command' });
  }
  getPictureUrl() {
    return this.$resource('/pictures/:command', { command: '@command' });
  }
  getMarkdownUrl() {
    return this.$resource('/markdown/:id/:command', { id: '@id', command: '@command' }, { 'update': { method: 'PUT' } });
  }
  getPageUrl() {
    return this.$resource('/page/:id', { id: '@id' });
  }
  getConvertLinkUrl() {
    return this.$resource('/link', null);
  }
}


app.service('Resources', Resources);

