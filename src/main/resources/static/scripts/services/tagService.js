angular.module('bluelamp')
	.factory("Tag", function TagFactory($http) {

     return {

        //add a new tag type to the lov table for 'Tag'
//        {
//        id,
//        lovTable,
//        shortName,
//        longName
//        }
	    addTagType: function(lovDto)
	    {
            return $http({
              method: 'POST',
              url: '/tag',
              data: lovDto
            }).then(function successCallback(response) {
                    return response;
            }, function errorCallback(response) {

                return response;
            });
	    }
	 }
});