angular.module('bluelamp')
	.factory("Library", function LibraryFactory($http) {

        //libraryLevelDto
//        {
//
//          id,
//          level,
//          description,
//          abbreviation,
//          parentLibraryId
//         }
        return {

            //will return a list of all library entries that are children of the
            //incoming library id. Use a parent library id of -1 to get all the
            //first level (0) library entries
            //the return structure is {parentLibraryId: , data}
            loadSubLibrary : function(parentLibraryId)
            {
                return $http({
                  method: 'GET',
                  url: '/subLibraryGet/' + parentLibraryId
                }).then(function successCallback(response) {
                        return response.data;
                  }, function errorCallback(response) {

                  });

            },
            deleteLibraryEntry : function(libraryId)
             {
                 return $http({
                   method: 'DELETE',
                   url: '/library/' + libraryId
                 }).then(function successCallback(response) {
                     return response.data;
                   }, function errorCallback(response) {
                     // called asynchronously if an error occurs
                     // or server returns response with an error status.
                   });
             },

            persistLibraryEntry : function(newEntry)
            {
                return $http({
                  method: 'POST',
                  url: '/libraryUpdate',
                  data: newEntry
                }).then(function successCallback(response) {
                        return response.data;
                  }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                  });

            },

            //will return an array of libaryLevelDto with 1, 2, or 3 entries
            //the 1st entry is the requested library. the 2nd entry is the parent
            //(if one), and the 3rd entry is the grandparent (if one)
            getLibraryEntry: function(libraryId)
            {
                return $http({
                    method: 'GET',
                    url: '/library/' + libraryId
                }).then(function successCallback(response) {
                        return  response.data;
                }, function errorCallback(response) {
                        alert ('error on retrieval: ' + response.status + '-' + response.statusText);
                });

            }
        };
	});


