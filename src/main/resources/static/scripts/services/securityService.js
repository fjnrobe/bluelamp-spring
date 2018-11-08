angular.module('bluelamp')
	.factory("Security", function SecurityFactory($http) {

        return {
            getCurrentUserProfile: function(userId, password)
            {

               return $http({
                method: 'GET',
                url: '/userProfile',
                }).then(function successCallback(response) {
                         return  response;
               }, function errorCallback(response) {
                     return response;
               });
            }
        };
	});


