'use strict';

class AddLinkPopUpController {
  constructor($mdDialog, markdowns) {
    this.$mdDialog = $mdDialog;
    this.$onInit(markdowns);
  }
  $onInit(markdowns) {
    this.markdowns = markdowns.map((markdown) => {
      if (markdown.path === '/') {
        return { item: { path: `${markdown.path}${markdown.name}`, id: markdown.id } };
      }
      return { item: { path: `${markdown.path}/${markdown.name}`, id: markdown.id } };
    });
  }
  ok(nameErr, markdownErr) {
    if (!nameErr.required && !markdownErr.required) {
      this.$mdDialog.hide({ id: this.userSelect.id, linkName: this.linkName });
    }
  }
  cancel() {
    this.$mdDialog.cancel();
  }
}

class AddLinkController {
  constructor($mdDialog, Markdown, ngConfig) {
    this.$mdDialog = $mdDialog;
    this.Markdown = Markdown;
    this.ngConfig = ngConfig;
  }
  addLinkBtn() {
    this.Markdown.find({ filter: { fields: { id: true, name: true, path: true } } }, (markdowns) => {
      this.$mdDialog.show({
        templateUrl: 'components/editor/markdown/link/link.popup.html',
        controller: AddLinkPopUpController,
        controllerAs: 'ctrl',
        locals: { markdowns },
        clickOutsideToClose: true
      }).then((res) => {
        const link = `[${res.linkName}](/${this.ngConfig.prefix}/${res.id})`;
        this.onAddLink({ link });
      }, () => {
        console.log('Canceled addLink');
      });
    });
  }
}


angular.module('UserGuideApp')
    .component('addLink', {
      controller: AddLinkController,
      templateUrl: 'components/editor/markdown/link/link.view.html',
      bindings: {
        onAddLink: '&'
      }
    });
