angular.module('findWithAttrService', []).service('attrService', function() {
	this.getIndex = function(array, attr, value) {
		for (var i = 0; i < array.length; i++) {
			if (array[i][attr] === value) {
				return i;
			}
		}
	};
});
