angular.module('bluelamp')
	.factory("Diagram", function DiagramFactory($http) {

        return {
            saveDrillDownPage : function(newPageDto, currentPageDto )
            {
                var newDrilldownDto = {currentUiPageDto: currentPageDto,
                                       newUiPageDto: newPageDto};

                return $http({
                    method: 'POST',
                    url: '/diagrams/drilldown',
                    data: newDrilldownDto
                }).then (function successCallback(response) {
                    return response;
                    }, function errorCallback(response) {
                    return response;
                    });
            },
            saveDiagram  : function(pageDto )
            {
                return $http({
                  method: 'POST',
                  url: '/diagrams',
                  data: pageDto
                }).then(function successCallback(response) {
                    return response;
                  }, function errorCallback(response) {
                    return response;
                  });
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
                 return $http({
                       method: 'GET',
                       url: '/diagrams/library/' + libraryId
                     }).then(function successCallback(response) {
                             return  response;
                       }, function errorCallback(response) {
                             return response;
                       });
             },

             //load the uiPageDto - which holds the info to render a diagram
             loadPage: function (pageId)
             {
                return $http({
                    method: 'GET',
                    url:    '/canvas/page/' + pageId
                }).then (function successCallBack(response) {
                    return response;
                }, function errorCallback(response) {
                    return response;
                });
             }
        };
	});


