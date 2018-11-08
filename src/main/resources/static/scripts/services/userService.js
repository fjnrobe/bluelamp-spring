angular.module('bluelamp')
	.factory("User", function UserFactory($http) {

     return {

        //add a new user: structure is UserSecurityDto

	    addUser: function(userDto)
	    {
            return $http({
              method: 'POST',
              url: '/addNewUser',
              data: userDto
            }).then(function successCallback(response) {
                    return response;
            }, function errorCallback(response) {

                return response;
            });
	    }
	 }
});