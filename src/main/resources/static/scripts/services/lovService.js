angular.module('bluelamp')
	.factory("Lov", function LovFactory($http) {

//    dtos:
//      lovDto: {
//              lovId,
//              lovTable,
//              shortName,
//              longName,
//              isTagType
//    }
	return {

        //return all lovDto entries for the incoming lov table
	    getLovByTable: function(lovTable)
	    {
	        return $http({
                 method: 'GET',
                 url: '/lov/' + lovTable
               }).then(function successCallback(response) {
                       return response.data;
                 }, function errorCallback(response) {
                   // called asynchronously if an error occurs
                   // or server returns response with an error status.
                 });
	    }

	}
});