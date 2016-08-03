(function() {
	'use strict';

	function FormValidation() {
		this.form = document.querySelector('form');
		this.emailInput = document.querySelector('#email');
		this.passwordInput = document.querySelector('#password');
		this.adressInput = document.querySelector('#city');
		this.phoneInput = document.querySelector('#phone');
		this.userApplyCheck = document.querySelector('.checkbox input');
		this.submitButton = document.querySelector('.btn');
		this.usedEmails = ['author@mail.com', 'foo@mail.com', 'tester@mail.com'];
		this.hidingTimeout = null;
		this.errors = [];
		this.init();
	}

	FormValidation.prototype.createErrorMessage = function(errorText, errorClass) {
		var message = document.createElement('div');
		message.innerText = errorText;
		message.classList.add('alert', 'alert-danger', errorClass);
		return message;
	};

	FormValidation.prototype.showErrorMessage = function(input, errorText, errorClass) {
		var errorMessage = this.createErrorMessage(errorText, errorClass);
		var container = input.parentNode;
		var match = container.querySelector('.' + errorClass);
		if (match) {
			return;
		}
		container.classList.add('has-error');
		this.errors.push(errorClass);
		console.log(this.errors);
		container.appendChild(errorMessage);
		this.blockSubmitButton();
	};

	FormValidation.prototype.hideErrorMessage = function(input, errorClass) {
		var container = input.parentNode;
		var errorMessage = container.querySelector('.' + errorClass);
		if (errorMessage) {
			container.removeChild(errorMessage);
			container.classList.remove('has-error', errorClass);
			this.errors = this.errors.filter(function(error) {
				return error !== errorClass;
			});
			console.log(this.errors);
			this.unblockSubmitButton();
		}
	};

	FormValidation.prototype.blockSubmitButton = function() {
		this.submitButton.classList.add('disabled');
	};

	FormValidation.prototype.unblockSubmitButton = function() {
		this.submitButton.classList.remove('disabled');
	};

	FormValidation.prototype.validateData = function(inputData, regExp) {
		var match = regExp.test(inputData);
		return match;
	};

	FormValidation.prototype.validateInput = function(input, regExp, bool, errorText, errorClass) {
		if (this.validateData(input.value, regExp) === bool) {
			this.showErrorMessage(input, errorText, errorClass);
			return true;
		} else {
			this.hideErrorMessage(input, errorClass);
			return false;
		}
	};

	FormValidation.prototype.inputNecessary = function(input) {
		this.validateInput(input, /\w+/, false, 'Поле является обязательным для заполнения', 'has-necessary-input-error');
	};

	FormValidation.prototype.emailError = function() {
		this.validateInput(this.emailInput, /[^@]+@[^@\.]+\.[^@]+/, false, 'Ошибка ввода email', 'has-email-error');
	};

	FormValidation.prototype.emailUsed = function() {
		var reg;
		var match;
		for (var i = 0; i < this.usedEmails.length; i += 1) {
			reg = new RegExp(this.usedEmails[i] + '\s*', 'i');
			match = this.validateInput(this.emailInput, reg, true, 'Данный email уже зарегестрирован', 'has-email-used-error');
			if (match) {
				break;
			}
		}
	};

	FormValidation.prototype.passwordShort = function() {
		this.validateInput(this.passwordInput, /^\w{5,}/, false, 'Пароль должен быть более 5 символов', 'has-password-short-error');
	};

	FormValidation.prototype.passwordSimple = function() {
		this.validateInput(this.passwordInput, /(^[0-9]+$)|(^[a-zA-z]+$)/, true, 'Пароль слишком простой, должны быть латинские буквы и цифры (пример: superpanda2000)', 'has-password-simple-error');
	};

	FormValidation.prototype.passwordForbidden = function() {
		this.validateInput(this.passwordInput, /[^a-zA-Z0-9_]+/, true, 'Пароль содержит запрещенные символы, должны быть только латинские буквы и цифры (пример: superpanda2000)', 'has-password-forbidden-error');
	};

	FormValidation.prototype.phoneIncorrectFormat = function() {
		this.validateInput(this.phoneInput, /^(00)(\d{2})(\d{3})(\d{7})$/, false, 'Международный формат записи телефона не выдержан (пример: 00380441234562)', 'has-phone-incorrect-format-error');
	};

	FormValidation.prototype.checkUncheked = function() {
		if (this.userApplyCheck.checked === false) {
			this.showErrorMessage(this.userApplyCheck, 'Не подтверждено пользовательское соглашение', 'has-check-unchecked-error');
			this.unblockSubmitButton();
		} else {
			this.hideErrorMessage(this.userApplyCheck, 'has-check-unchecked-error');
		}
	};

	FormValidation.prototype.initNecessaryInputBehaviour = function(target) {
		if (target.id === 'email' || target.id === 'password') {
			this.inputNecessary(target);
		}
	};

	FormValidation.prototype.initGlobalInputBehaviour = function(target) {
		if (target.id === 'email' || target.id === 'password') {
			this.inputNecessary(target);
		}
		if (target.id === 'email') {
			this.emailError();
			this.emailUsed();
		}
		if (target.id === 'password') {
			this.passwordShort();
			this.passwordSimple();
			this.passwordForbidden();
		}
		if (target.id === 'phone') {
			this.phoneIncorrectFormat();
		}
	};

	FormValidation.prototype.initSubmitButtonBehaviour = function(target) {
		this.inputNecessary(this.emailInput);
		this.inputNecessary(this.passwordInput);
		this.checkUncheked();
		if (this.errors.length === 0) {
			this.form.submit();
			console.log('correct');
		}
	};

	FormValidation.prototype.init = function() {
		var self = this;
		this.form.addEventListener('focusout', function(event) {
			self.initNecessaryInputBehaviour(event.target);
			if (self.phoneInput.value === '') {
				self.hideErrorMessage(self.phoneInput, 'has-phone-incorrect-format-error');
			}
		}, false);
		this.form.addEventListener('keyup', function(event) {
			clearTimeout(this.hidingTimeout);
			this.hidingTimeout = setTimeout(function() {
				self.initGlobalInputBehaviour(event.target);
			}, 200);
		}, false);
		this.submitButton.addEventListener('click', function(event) {
			event.preventDefault();
			self.initSubmitButtonBehaviour(event.target);
		}, false);
	};

	window.FormValidation = new FormValidation();
})();