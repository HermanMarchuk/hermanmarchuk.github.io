$(function() {
    'use strict';

    function ContentFilter(node, data) {
        this.$node = $(node);
        this.data = data;
        this.uniqueTags = this.getUniqueTags();
        this.widgetMarkUp = this.createWidgetMarkUp();
        this.init();
    }

    ContentFilter.prototype.getUniqueTags = function() {
        var uniqueTags = this.data.reduce(function(initValue, currentItem) {
            var currentTagsArr = currentItem.tags;
            currentTagsArr.forEach(function(item) {
                var isNotRepeat = (initValue.indexOf(item) === -1);
                if (isNotRepeat) {
                    initValue.push(item);
                }
            });
            return initValue;
        }, []);
        return uniqueTags;
    };

    ContentFilter.prototype.formatTags = function(tag) {
        var regExp = /\s|\//gi;
        var result = tag.replace(regExp, '-').toLowerCase();
        return result;
    };

    ContentFilter.prototype.createInputElement = function(tag) {
        var $inputElement = $('<input>', {
            type: 'radio',
            name: 'item',
            id: this.formatTags(tag)
        });
        return $inputElement;
    };

    ContentFilter.prototype.createLabelElement = function(tag) {
        var $labelElement = $('<label>', {
            for: this.formatTags(tag)
        }).text(tag);
        return $labelElement;
    };

    ContentFilter.prototype.addButton = function(tag, node) {
        var $input = this.createInputElement(tag);
        var $label = this.createLabelElement(tag);
        node.append($input);
        node.append($label);
    };

    ContentFilter.prototype.addSeparator = function(node) {
        var $separator = $('<div>', {
            class: 'separator'
        });
        node.append($separator);
    };

    ContentFilter.prototype.createItemTitle = function(dataObj) {
        var $itemTitle = $('<div>', {
            class: 'item-title'
        });
        var $link = $('<a>', {
            href: dataObj.demoUrl
        }).text(dataObj.name);
        $itemTitle.append($link);
        return $itemTitle;
    };

    ContentFilter.prototype.createItemTags = function(dataObj) {
        var $ul = $('<ul>', {
            class: 'item-tags'
        });
        $ul.append('<i class="fa fa-thumb-tack"></i>')
        dataObj.tags.forEach(function(tag) {
            var $li = $('<li>').text(tag + '|');
            $ul.append($li);
        });
        return $ul;
    };

    ContentFilter.prototype.createMainInfo = function(dataObj) {
        var $mainInfo = $('<div>', {
            class: 'main-info'
        });
        var $itemTitle = this.createItemTitle(dataObj);
        var $itemTags = this.createItemTags(dataObj);
        $mainInfo.append($itemTitle).append($itemTags);
        return $mainInfo;
    };

    ContentFilter.prototype.createExtraInfo = function(dataObj) {
        var $extraInfo = $('<div>', {
            class: 'extra-info'
        });
        var $description = $('<p>').text(dataObj.description);
        var $demoButton = $('<a>', {
            class: 'extra-info-button',
            href: dataObj.demoUrl
        }).text('Demo');
        var $codeButton = $('<a>', {
            class: 'extra-info-button',
            href: dataObj.codeUrl
        }).text('Code');
        $extraInfo.append($description).append($demoButton).append($codeButton);
        return $extraInfo;
    };

    ContentFilter.prototype.createImageWrapper = function(dataObj) {
        var $imageWrapper = $('<div>', {
            class: 'image-wrapper'
        });
        var $img = $('<img>', {
            src: dataObj.imgSrc
        });
        var $extraInfo = this.createExtraInfo(dataObj);
        $imageWrapper.append($img).append($extraInfo);
        return $imageWrapper;
    };

    ContentFilter.prototype.addClassesToContentWrapper = function(dataObj) {
        var defaultClasses = 'tile item';
        var self = this;
        var customClasses = dataObj.tags.reduce(function(init, currentItem, index, arr) {
            init += (self.formatTags(currentItem) + ' ');
            return init;
        }, '');
        var allClasses = defaultClasses + ' ' + customClasses;
        return allClasses;
    };

    ContentFilter.prototype.createContent = function(dataObj, node) {
        var $contentWrapper = $('<div>', {
            class: this.addClassesToContentWrapper(dataObj)
        });
        var $imageWrapper = this.createImageWrapper(dataObj);
        var $mainInfo = this.createMainInfo(dataObj);
        $contentWrapper.append($imageWrapper).append($mainInfo);
        node.append($contentWrapper);
        return $contentWrapper;
    };

    ContentFilter.prototype.addContent = function(dataObj, node) {
        var $content = this.createContent(dataObj, node);
        node.append($content);
    };

    ContentFilter.prototype.getControlToButton = function(tag) {
        var formattedTag = this.formatTags(tag);
        var rule = 'input[type="radio"][id="' + formattedTag + '"]:checked ~ .item:not([class*="' + formattedTag + '"]) {width:0;height:0;padding:0;margin:0;opacity:0}';
        var $style = $('<style type="text/css">' + rule + '</style>');
        $style.appendTo('head');
    };

    ContentFilter.prototype.createWidgetMarkUp = function() {
        var $widgetWrapper = $('<div>', {
            class: 'widget-wrapper'
        });
        var self = this;
        this.addButton('All', $widgetWrapper);
        this.uniqueTags.forEach(function(tag) {
            self.addButton(tag, $widgetWrapper);
            self.getControlToButton(tag);
        });
        this.addSeparator($widgetWrapper);
        this.data.forEach(function(dataObj) {
            self.addContent(dataObj, $widgetWrapper);
        });
        return $widgetWrapper;
    };

    ContentFilter.prototype.init = function() {
        this.$node.append(this.widgetMarkUp);
        $('#all').prop('checked', true);
    };

    window.ContentFilter = ContentFilter;
});
