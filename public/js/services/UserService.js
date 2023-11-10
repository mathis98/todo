angular.module('AuthService', [])
.factory('authService', function($http) {
	var authFactory = {};

	var config = {
		headers : {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
		}
	}

		authFactory.listUsers = function(data) {
			return $http.get('/api/users');
		};

		authFactory.addUser = function(data) {
			return $http.post('/api/users', data, config);
		};

		authFactory.showUser = function(id) {
			return $http.get('/api/users/'+id+'', config);
		};

		authFactory.deleteUser = function(id) {
			return $http.delete('/api/users/'+id+'', config);
		};

		authFactory.updateUser = function(data, id) {
			return $http.put('/api/users/'+id+'',data, config);
		};

		return authFactory;
});
