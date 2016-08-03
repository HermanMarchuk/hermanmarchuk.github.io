$(function() {

	'use strict';

	function Zoomer(node) {
		this.$node = $(node);
		this.$page = $('html');
		this.$body = $('body');
		this.$bigImage = null;
		this.$blocker = this.createBlocker();
		this.$imageWrapper = this.$blocker.find('.image-wrapper');
		this.$cancelButton = this.addCancelButton();
		this.init();
	}

	Zoomer.prototype.createBlocker = function() {
		var $blockerDiv = $('<div>');
		var $imageWrapper = $('<div>');
		$blockerDiv.addClass('blocker');
		$blockerDiv.addClass('hidden');
		$imageWrapper.addClass('image-wrapper');
		$blockerDiv.append($imageWrapper);
		this.calculateBlockerParams($blockerDiv);
		return $blockerDiv;
	};

	Zoomer.prototype.calculateBlockerParams = function($blocker) {
		$blocker.css({
			'width': this.$page.width(),
			'height': this.$page.height(),
			'top': 0,
			'left': 0
		});
	};

	Zoomer.prototype.insertBlocker = function() {
		this.$body.append(this.$blocker);
	};

	Zoomer.prototype.insertBigImageInBlocker = function(smallImageName) {
		var $img = $('<img>');
		var prevImage = this.$imageWrapper.find('img');
		$img.attr('src', './img/large/' + smallImageName);
		if (prevImage.length !== 0) {
			prevImage.replaceWith($img);
		} else {
			this.$imageWrapper.append($img);
		}
		this.$bigImage = $img;
	};

	Zoomer.prototype.setParamsToImageWrapper = function() {
		this.$imageWrapper.css({
			'height': '60%',
			'top': '20%'
		});
	};

	Zoomer.prototype.setParamsToImage = function() {
		var imageWrapperHeight = this.$imageWrapper[0].offsetHeight;
		var imageWrapperWidth = this.$imageWrapper[0].offsetWidth;
		this.$bigImage.css({
			'height': imageWrapperHeight,
			'width': imageWrapperWidth
		});
	};

	Zoomer.prototype.executeImageName = function(src) {
		var regExp = /\/(\w+\.\w+$)/;
		var result = regExp.exec(src);
		return result[1];
	};

	Zoomer.prototype.createCancelButton = function() {
		var $cancelButton = $('<span>');
		$cancelButton.text('X');
		$cancelButton.addClass('cancel-button');
		return $cancelButton;
	};

	Zoomer.prototype.addCancelButton = function() {
		var $cancelButton = this.createCancelButton();
		this.$imageWrapper.append($cancelButton);
		return $cancelButton;
	};

	Zoomer.prototype.openZoomer = function() {
		this.$blocker.removeClass('hidden');
	};

	Zoomer.prototype.cancelZoomer = function() {
		this.$blocker.addClass('hidden');
	};

	Zoomer.prototype.initiateCancelButtonBehaviour = function() {
		var self = this;
		var ESC_KEYCODE = 27;
		this.$cancelButton.on('click', function() {
			self.cancelZoomer();
		});
		$(window).on('keyup', function(event) {
			if (event.keyCode === ESC_KEYCODE) {
				self.cancelZoomer();
			}
		});
	};

	Zoomer.prototype.initiateOpeningZoomerBehaviour = function() {
		var self = this;
		this.$node.on('click', 'img', function(event) {
			var imageSrc = $(event.target).attr('src');
			var imageName = self.executeImageName(imageSrc);
			self.insertBigImageInBlocker(imageName);
			self.openZoomer();
			self.calculateZoomerProperties();
		});
	};

	Zoomer.prototype.calculateZoomerProperties = function() {
		this.calculateBlockerParams(this.$blocker);
		this.setParamsToImageWrapper();
		this.setParamsToImage(this.$bigImage);
	};

	Zoomer.prototype.initiateBlockerBehaviour = function() {
		var self = this;
		$(window).resize(function() {
			self.calculateZoomerProperties();
		});
	};

	Zoomer.prototype.init = function() {
		this.insertBlocker();
		this.initiateBlockerBehaviour();
		this.initiateOpeningZoomerBehaviour();
		this.initiateCancelButtonBehaviour();
	};

	window.Zoomer = Zoomer;

});

