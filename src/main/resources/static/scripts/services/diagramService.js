angular.module('bluelamp')
	.factory("Diagram", function DiagramFactory($http) {

        return {
            saveDrillDownPage : function(currentPageDto, newPageDto)
            {
                var newDrilldownDto = {currentUiPageDto: currentPageDto,
                                       newUiPageDto: newPageDto};

                return $http({
                    method: 'POST',
                    url: '/diagrams/drilldown',
                    data: JSON.stringify(newDrilldownDto)
                }).then (function successCallback(response) {
                    return response;
                    }, function errorCallback(response) {
                    return response;
                    });
            },
            saveTemplate : function(shapeTemplateDto)
            {
                return $http({
                    method: 'POST',
                    url:    '/templates/save',
                    data:   shapeTemplateDto
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
            shareDiagram : function(pPageId, pEmailAddress)
            {
                var emailMessageDto = {fromEmail : "",
                                       toEmail: pEmailAddress,
                                       subject: "",
                                       body: pPageId};

                return $http({
                    method: 'POST',
                    url: '/diagrams/share',
                    data: emailMessageDto
                }).then(function successCallback (response) {
                    return response;
                }, function errorCallback(response) {
                    return response;
                });
            },
            deleteDiagram : function(pageId)
             {
                 return $http({
                   method: 'DELETE',
                   url: '/canvas/page/' + pageId
                 }).then(function successCallback(response) {
                      return response;
                   }, function errorCallback(response) {
                      return response;
                   });
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
             //load all the shape templates (shapeTemplateDto)
             loadShapeTemplates: function ()
             {
                return $http({
                    method: 'GET',
                    url:    '/templates/getall'
                }).then (function successCallback (response) {
                    return response;
                }, function errorCallback(response) {
                    return response;
                });
             },
             //load the uiPageDto - which holds the info to render a diagram
             loadPage: function (pageId)
             {
                return $http({
                    method: 'GET',
                    url:    '/diagram/page/' + pageId
                }).then (function successCallBack(response) {
                    return response;
                }, function errorCallback(response) {
                    return response;
                });
             },
             diagramSearch: function (searchText)
               {

                 return $http({
                    method: 'GET',
                    url: '/diagrams/library/search/' + searchText
                  }).then(function successCallback(response) {
                          return  response;
                    }, function errorCallback(response) {
                          return response;
                    });
               }
        };
	});


