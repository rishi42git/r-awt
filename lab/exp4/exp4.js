
angular.module('formApp', [])
    .controller('FormController', function ($scope) {
        $scope.user = {};
        $scope.submitted = false;
        $scope.success = '';

        $scope.register = function (form) {
            if (form.$valid) {
                // In real app, send data to server
                $scope.success = 'Registration successful for ' + $scope.user.name;
                $scope.user = {};
                form.$setPristine();  // Reset form state
                form.$setUntouched(); // Reset touched state
                $scope.submitted = false;
            } else {
                $scope.success = '';
                $scope.submitted = true; // Show validation messages
            }
        };
    });