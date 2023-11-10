angular.module('TodoCtrl', ['findWithAttrService'])
	.controller('TodoController', function($scope, attrService, $timeout) {
		$scope.errorText = '';
		$scope.showDone = true;
		$scope.oldText = '';
		$scope.myClass = '';
		$scope.items = [];
		$scope.doneNumber = 0;
		$scope.showTrash = false;

		$scope.toggleClass = function() {
			if ($scope.myClass == '') {
				$scope.myClass = 'toggled-class';
			} else {
				$scope.myClass = '';
			}
			$scope.showDone = !$scope.showDone;
		};

		socket.on('update-todos', function(data) {
			$scope.doneNumber = 0;
			$scope.$apply(function() {
				$scope.items = data;
				for (i = 0; i < $scope.items.length; i++) {
					$scope.items[i].text.replace(/&amp;/g, '&');
					if ($scope.items[i].done == true) {
						$scope.doneNumber++;
					}
				}
				if ($scope.doneNumber > 0) {
					$scope.showTrash = true;
				} else if ($scope.doneNumber == 0) {
					$scope.showTrash = false;
				}
			});
		});

		socket.emit('load-todos');

		$scope.addTodo = function() {
			let duplicate = false;
			if ($scope.addMe == '') {
				return;
			}
			for (var i = 0; i < $scope.items.length; i++) {
				if ($scope.items[i].text == $scope.addMe) {
					duplicate = true;
				}
			}
			if (duplicate == false) {
				$scope.items.push({ text: $scope.addMe, done: false });
				socket.emit('add-todo', $scope.addMe);
				$scope.addMe = '';
			} else {
				$scope.errorText = 'Duplicate Item!';
				$scope.addMe = '';
				$timeout(function() {
					$scope.errorText = '';
				}, 1000);
			}
		};

		$scope.removeTodo = function(id) {
			let index = attrService.getIndex($scope.items, '_id', id);
			if ($scope.items[index].done == true && $scope.doneNumber == 1) {
				$scope.showTrash = false;
			}
			let doneAmount = 0;
			for (var i = 0; i < $scope.items.length; i++) {
				if ($scope.items[i].done == true) {
					doneAmount++;
				}
			}
			if (doneAmount == 1) {
				$scope.showTrash = false;
			}
			$scope.items.splice(index, 1);
			socket.emit('remove-todo', id);
		};

		$scope.switchTodo = function(id) {
			let index = attrService.getIndex($scope.items, '_id', id);
			if ($scope.items[index].done == false) {
				$scope.doneNumber++;
			} else if ($scope.items[index].done == true) {
				$scope.doneNumber--;
			}
			if ($scope.doneNumber > 0) {
				$scope.showTrash = true;
			} else if ($scope.doneNumber == 0) {
				$scope.showTrash = false;
			}
			socket.emit('switch-todo', id);
			$scope.items[index].done = !$scope.items[index].done;
		};

		$scope.focus = function(id) {
			$scope.oldText = id.text;
		};
		$scope.blur = function(id) {
			let texxt = document.getElementById(id._id).innerHTML;
			if (texxt != $scope.oldText) {
				$scope.changeTo = texxt;
				socket.emit('change-todo', {
					id: id._id,
					changeText: $scope.changeTo
				});
			}
		};

		$scope.removeDone = function() {
			let doneList = [];
			for (var i = 0; i < $scope.items.length; i++) {
				if ($scope.items[i].done == true) {
					doneList.push($scope.items[i]._id);
				}
			}
			for (var j = 0; j < doneList.length; j++) {
				let index = attrService.getIndex($scope.items, '_id', doneList[j]);
				$scope.items.splice(index, 1);
				socket.emit('remove-todo', doneList[j]);
			}
			$scope.showTrash = false;
			$scope.doneNumber = 0;
		};
	});
