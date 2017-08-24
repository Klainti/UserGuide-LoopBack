'use strict';

class InsertPopUpController {
  constructor($mdDialog, Picture, markdowns) {
    this.$mdDialog = $mdDialog;
    this.Picture = Picture;
    this.$onInit(markdowns);
  }
  $onInit(markdowns) {
    this.markdowns = markdowns.map((markdown) => {
      if (markdown.path === '/') {
        return { item: { path: `${markdown.path}${markdown.name}`, id: markdown.id } };
      }
      return { item: { path: `${markdown.path}/${markdown.name}`, id: markdown.id } };
    });
    this.Picture.find({ filter: { fields: { name: true, id: true } } }, (res) => {
      this.pictures = res;
    }, (error) => {
      console.log(error.message);
    });
  }
  ok(nameErr, markdownErr) {
    if (!nameErr.required && !markdownErr.required) {
      this.$mdDialog.hide({ id: this.userSelect.id, linkName: this.linkName, command: 'link' });
    }
  }
  cancel() {
    this.$mdDialog.cancel();
  }
  deleteBtn(id, name) {
    this.$mdDialog.show(
      this.$mdDialog.confirm()
        .title(`Are you sure you want to delete ${name} ?`)
        .ok('Ok')
        .cancel('Cancel')
    ).then(() => {
      this.pictures = this.pictures.filter((item) => {
        return item.id !== id;
      });
      this.Picture.deleteById({ id });
      console.log(`Deleted Picture with id ${id}`);
    }, () => {
      console.log('Canceled delete');
    });
  }
  insertBtn(id) {
    this.$mdDialog.hide({ id, command: 'picture' });
  }
}

class insertController {
  constructor($mdDialog, Markdown, ngConfig) {
    this.$mdDialog = $mdDialog;
    this.Markdown = Markdown;
    this.ngConfig = ngConfig;
  }
  insertBtn() {
    this.Markdown.find({ filter: { fields: { id: true, name: true, path: true } } }, (markdowns) => {
      this.$mdDialog.show({
        templateUrl: 'components/editor/markdown/insert/insert.popup.html',
        controller: InsertPopUpController,
        controllerAs: 'ctrl',
        locals: { markdowns },
        clickOutsideToClose: true
      }).then((res) => {
        if (res.command === 'link') {
          const link = `[${res.linkName}](/${this.ngConfig.prefix}/${res.id})`;
          this.onInsertLink({ link });
        } else {
          this.onInsertPicture({ id: res.id });
        }
      }, () => {
        console.log('Canceled insert');
      });
    });
  }
}


angular.module('UserGuideApp')
  .component('insertToEditor', {
    controller: insertController,
    templateUrl: 'components/editor/markdown/insert/insert.view.html',
    bindings: {
      onInsertLink: '&',
      onInsertPicture: '&'
    }
  });

