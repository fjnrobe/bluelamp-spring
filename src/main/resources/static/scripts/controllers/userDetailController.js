angular.module('bluelamp')
.controller('userDetailController', [ '$q', '$scope', '$timeout',
                                            '$controller',
                                            'User',
                                             function($q,
                                                    $scope, $timeout, $controller, User) {

    //set a reference to the base controller
    $controller('baseController', { $scope: $scope });

    $scope.user = {};

    function createUserDto()
    {
          var userDto = {
            id: "",
            firstName: "",
            lastName : "",
            email    : "",
            userName : "",
            password : "",
            isEditor : false,
            isAdministrator : false,
            isEnabled: true
          }

          return userDto;
    }

    //called when user clicks save to add the user
    $scope.saveUser = function()
    {
        $scope.user.id = $scope.generateId();

         //wrap in apply so it refreshes page
        $scope.$apply(function () {
            User.addUser($scope.user ).then (function (response) {

                if (response.status == "406")
                {
                    $scope.errors = response.data;
                }
                else
                {
                    //do something to indicate record is saved
                }
            });
        });
    }

    $scope.user = $scope.createUserDto();

}]);