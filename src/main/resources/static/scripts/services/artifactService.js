angular.module('bluelamp')
	.factory("Artifact", function ArtifactFactory($http) {

        return {
            getArtifactEntry: function(artifactId)
            {
               return $http({
                method: 'GET',
                url: '/artifacts/' + artifactId,
                }).then(function successCallback(response) {
                         return  response;
               }, function errorCallback(response) {
                     return response;
               });
            },
            saveArtifact : function(referenceArtifactDto )
            {
                return $http({
                  method: 'POST',
                  url: '/artifacts',
                  data: referenceArtifactDto
                }).then(function successCallback(response) {
                    return response;
                  }, function errorCallback(response) {
                    return response;
                  });
            },
            deleteArtifact : function(artifactId)
             {
             return $http({
               method: 'DELETE',
               url: '/artifacts/' + artifactId
             }).then(function successCallback(response) {
                 return response;
               }, function errorCallback(response) {
                 return response;
               });
             },

             //load all artifacts associated with the incoming library id
             //return structure is artifactListDto
             loadArtifacts : function(libraryId)
             {
                 return $http({
                   method: 'GET',
                   url: '/artifacts/library/' + libraryId
                 }).then(function successCallback(response) {
                         return  response;
                   }, function errorCallback(response) {
                         return response;
                   });
             },
              artifactSearch: function (searchText)
              {

                return $http({
                   method: 'GET',
                   url: '/artifacts/library/search/' + searchText
                 }).then(function successCallback(response) {
                         return  response;
                   }, function errorCallback(response) {
                         return response;
                   });
              },
              downloadArtifactDocument: function (artifactId)
              {
                return $http({
                   method: 'GET',
                   url: '/download'
                 }).then(function successCallback(response) {
                         return  response;
                   }, function errorCallback(response) {
                         return response;
                   });
              }

        };
	});


