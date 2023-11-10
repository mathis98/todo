angular.module('AuthCtrl', ['AuthService']).controller('AuthController', function($scope, authService, $timeout) {
	let vm = this;

	vm.loginFunctions = ["Login", "Register"];
	vm.primary = 0;
	vm.show = true;
	vm.active = false;
	vm.secondary = vm.primary == 0 ? 1 : 0;

	vm.toggleLogin = function() {
		if(vm.active == false){
		vm.primary = vm.primary == 0 ? 1 : 0;
		vm.secondary = vm.primary == 0 ? 1 : 0;
		console.log($('.login-form').height());

		// Register
		if(vm.primary == 1){
			vm.active = true;
			$('.login-form').animate({ height: 360 }, 500);
			$('.login-header-sm').css('position', 'relative');
			$('.login-header-sm').css('left', 20);
			$('.login-header-sm').css('right', 0);
			$('.login-header-sm').animate({ left: -200, 'font-size': '2.5rem', 'right': '67%' }, 500);
			$('.login-header-lg').css('position', 'absolute');
			$('.login-header-lg').css('left', -150);
			$('.login-header-lg').css('right', 0);
			$('.login-header-lg').animate({ right: 20, 'font-size': 18, 'left': '80%' }, 500);
			$timeout(function(){vm.active = false;},500);
		}

		// Login
		else{
			vm.active = true;
			$('.login-form').animate({ height: 440 }, 500);
			$('.login-header-sm').css('position', 'absolute');
			$('.login-header-sm').css('left', 50);
			$('.login-header-sm').animate({ right: 20, 'font-size': 18, 'left': '80%' }, 500);
			$('.login-header-lg').css('position', 'absolute');
			$('.login-header-lg').animate({ left: -150, 'font-size': '2.5rem', 'right': 0 }, 500);
			$timeout(function(){vm.active = false;},500);
		}
	}
	}


vm.toggleShow = function() {
	vm.show = vm.show == true ? false : true;
	var x = document.getElementById("login-password");
	if (x.type === "password") {
		x.type = "text";
	} else {
		x.type = "password";
	}
}

vm.user = {
	name: "",
	email: "",
	password: ""
}

vm.login = function() {
	// login
	if (vm.primary == 0) {
		console.log(vm.user); // register
	} else if (vm.primary == 1) {
		console.log(vm.user);
	}
}
});
