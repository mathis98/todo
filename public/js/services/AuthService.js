angular.module('AuthService', [])
.factory('authService', function($http) {
	var authFactory = {};

	var config = {
		headers : {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
		}
	}

		authFactory.register = function(data) {
			return $http.post('/api/auth/register', data, config);
		};

		authFactory.user = function(data) {
			return $http.post('/api/auth/me', data, config);
		};

		authFactory.login = function(data) {
			return $http.post('/api/auth/login', data, config);
		};

		return authFactory;
});
