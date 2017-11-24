angular.module('bluelamp',)
	.factory("Diagram", function DiagramFactory($http) {

        return {
            saveDiagram : function(pageDto)
            {
//                $http({
//                  method: 'POST',
//                  url: '/diagramEntry',
//                  data: pageDto
//                }).then(function successCallback(response) {
//                    // this callback will be called asynchronously
//                    // when the response is available
//                  }, function errorCallback(response) {
//                    // called asynchronously if an error occurs
//                    // or server returns response with an error status.
//                  });
            },
            deleteDiagram : function(pageId)
             {
//                 $http({
//                   method: 'DELETE',
//                   url: '/libraryList' + libraryId
//                 }).then(function successCallback(response) {
//                     // this callback will be called asynchronously
//                     // when the response is available
//                   }, function errorCallback(response) {
//                     // called asynchronously if an error occurs
//                     // or server returns response with an error status.
//                   });
             },
             //load all diagrams associated with the incoming library id
             //return structure is [pageDto]
             loadDiagrams: function (libraryId)
             {
                //dummy data for now
                var diagramList = [{pageId: 1, pageTitle: "page one for " + libraryId,
                                    pageDescription: "page one description " + libraryId, libraryId: libraryId,
                                    tags: [], annotations: []},
                                    {pageId: 2, pageTitle: "page two for " + libraryId,
                                    pageDescription: "page two description " + libraryId, libraryId: libraryId,
                                    tags: [], annotations: []},
                                    {pageId: 3, pageTitle: "page three " + libraryId,
                                   pageDescription: "page three description " + libraryId, libraryId: libraryId,
                                   tags: [], annotations: []}];

                 return diagramList;

             }
        };
	});


