$(function() {
    'use strict';

    function TagList(node) {
        this.$node = $(node);
        this.tags = [];
        this.$tagListMarkUp = this.createHTML();
        this.$toggleButton = this.$tagListMarkUp.find('.toggle-button');
        this.$inputGroup = this.$tagListMarkUp.find('.input-group');
        this.$tagsGroup = this.$tagListMarkUp.find('.tags-group');
        this.$input = this.$tagListMarkUp.find('.form-control');
        this.$addButton = this.$tagListMarkUp.find('.btn.btn-info');
        this.init();
    }

    TagList.prototype.createHTML = function() {
        var tagListWrapper = document.createElement('div');

        $(tagListWrapper)
            .addClass('row tag-list-container')
            .html('<div class="col-md-offset-1 col-md-10"></div>');

        $(tagListWrapper).find('.col-md-offset-1.col-md-10').html(
            '<div class="toggle-button"></div>' +
            '<div class="tags-group"></div>' +
            '<div class="input-group"></div>'
        );

        $(tagListWrapper).find('.toggle-button').html('<a href="#">Завершить редактирование</a>');

        $(tagListWrapper).find('.input-group').html(
            '<input type="text" class="form-control">' +
            '<span class="input-group-btn">' +
            '<button class="btn btn-info" type="button">добавить</button>' +
            '</span>'
        );

        return $(tagListWrapper);
    };

    TagList.prototype.changeToggleButtonName = function() {
        this.$toggleButton.find('a').text(function(i, text) {
            return text === 'Редактировать теги' ? 'Завершить редактирование' : 'Редактировать теги';
        });
    };

    TagList.prototype.toogleInputGroup = function() {
        this.$inputGroup.toggle();
    };

    TagList.prototype.toggleButtonLogic = function() {
        this.changeToggleButtonName();
        this.toogleInputGroup();
        this.closeButtonAppearingLogic();
    };

    TagList.prototype.isUsedTag = function(tagData) {
        for (var i = 0; i < this.tags.length; i += 1) {
            if (this.tags[i] === tagData) {
                return true;
            }
        }
        return false;
    };

    TagList.prototype.createTag = function(tagContent) {
        var tagWrapper = document.createElement('div');
        this.tags.push(tagContent);
        $(tagWrapper)
            .addClass('label label-default tag-wrapper')
            .html(
                '<span class="tag-text">' +
                tagContent +
                '</span>' +
                '<span class="tag-close">X</span>'
            );
        return $(tagWrapper);
    };

    TagList.prototype.addCloseButton = function() {
        this.$tagsGroup.find('.tag-close').removeClass('hidden');
    };

    TagList.prototype.removeCloseButton = function() {
        this.$tagsGroup.find('.tag-close').addClass('hidden');
    };

    TagList.prototype.closeButtonAppearingLogic = function() {
        var toggleButtonText = this.$toggleButton.text();
        if (toggleButtonText === 'Редактировать теги') {
            this.removeCloseButton();
        } else {
            this.addCloseButton();
        }
    };

    TagList.prototype.addTag = function(tag) {
        this.$tagsGroup.append(tag);
    };

    TagList.prototype.addTagLogic = function(tagContent) {
        var inputText = this.$input.val();
        var isUsed = this.isUsedTag(inputText);
        var currentTag = this.createTag(inputText);
        if (isUsed || inputText === '') {
            return;
        }
        this.addTag(currentTag);
        this.$input.val('');
    };

    TagList.prototype.removeTag = function($tag) {
        $tag.remove();
    };

    TagList.prototype.insertTagListIntoDOM = function() {
        this.$node.append(this.$tagListMarkUp);

    };

    TagList.prototype.initiateToggleButtonLogic = function() {
        var self = this;
        this.$toggleButton.on('click', function() {
            self.toggleButtonLogic();
        });
    };

    TagList.prototype.initiateRemoveTagLogic = function() {
        var self = this;
        this.$tagsGroup.on('click', '.tag-close', function(event) {
            var $currentTag = $(event.target).parent();
            self.removeTag($currentTag);
        });
    };

    TagList.prototype.initiateAddTagLogic = function() {
        var self = this;
        var ENTER_CODE = 13;
        this.$addButton.on('click', function() {
            self.addTagLogic();
        });
        this.$input.on('keyup', function(event) {
            if (event.keyCode === ENTER_CODE) {
                self.addTagLogic();
            }
        });
    };

    TagList.prototype.init = function() {
        this.initiateToggleButtonLogic();
        this.initiateRemoveTagLogic();
        this.initiateAddTagLogic();
        this.insertTagListIntoDOM();
    };

    window.TagList = TagList;
});
