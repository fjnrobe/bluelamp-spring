angular.module('bluelamp',)
	.factory("Artifact", function ArtifactFactory($http) {

        return {
            getArtifactEntry: function(artifactId)
            {
                return {referenceArtifact: {referenceArtifactId:artifactId,
                                                                              documentTitle: "title for " + artifactId,
                                                                              abbreviation: "abbrev for " + artifactId,
                                                                              detailedText: "info for " + artifactId,
                                                                              lovDocumentType: "",
                                                                              libraryId: 1,
                                                                              tags: []},
                                                                              parentArtifact : {
                                                                              referenceArtifactId:$scope.generateId(),
                                                                                                    documentTitle: "",
                                                                                                    abbreviation: "",
                                                                                                    detailedText: "",
                                                                                                    lovDocumentType: "",
                                                                                                     libraryId: -1,
                                                                                                     tags: []}
                                                                              };
            },
            saveArtifact : function(referenceArtifactDto )
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
            deleteArtifact : function(artifactId)
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
             loadArtifacts: function (libraryId)
             {
                //dummy data for now
                var artifactList =  [{referenceArtifact: {referenceArtifactId: 1,
                                documentTitle: "artifact One",
                                abbreviation: "artifact one abbrev",
                                detailedText: "artifact one detailed text",
                                lovDocumentType: "UID"},
                              parentArtifact : {},
                              tags: []},
                              {referenceArtifact: {referenceArtifactId: 2,
                                                   documentTitle: "artifact two",
                                                   abbreviation: "artifact two abbrev",
                                                   detailedText: "artifact two detailed text"},
                                                   lovDocumentType: "UID",
                                 parentArtifact : {},
                                 tags: []},
                                 {referenceArtifact: {referenceArtifactId: 3,
                                                   documentTitle: "artifact three",
                                                   abbreviation: "artifact three abbrev",
                                                   detailedText: "artifact three detailed text",
                                                   lovDocumentType: "UID"},
                                 parentArtifact : {},
                                 tags: []}];

                 return artifactList;

             },
             //load all diagrams associated with the incoming library id
              //return structure is [pageDto]
              searchArtifacts: function (searchText)
              {

                var searchList =
                 [{referenceArtifactId: 1, documentTitle: "artifact one",
                   abbreviation: "artifact 1 abbrev",
                   documentLibrary: "Health Overview, UIDs, UID510",
                   parentDocumentTitle: "parent 1"},
                   {referenceArtifactId: 2, documentTitle: "artifact two",
                   abbreviation: "artifact 2 abbrev",
                                      documentLibrary: "Benefits, UIDs",
                                      parentDocumentTitle: "parent 2"},
                    {referenceArtifactId: 3, documentTitle: "artifact three",
                    abbreviation: "artifact 3 abbrev",
                   documentLibrary: "Tax",
                   parentDocumentTitle: "parent 3"}

                   ];
//                 //dummy data for now
//                 var artifactList =  [{referenceArtifact: {referenceArtifactId: 1,
//                                 documentTitle: "artifact One",
//                                 abbreviation: "artifact one abbrev",
//                                 detailedText: "artifact one detailed text",
//                                 lovDocumentType: "UID"},
//                               parentArtifact : {},
//                               tags: []},
//                               {referenceArtifact: {referenceArtifactId: 2,
//                                                    documentTitle: "artifact two",
//                                                    abbreviation: "artifact two abbrev",
//                                                    detailedText: "artifact two detailed text"},
//                                                    lovDocumentType: "UID",
//                                  parentArtifact : {},
//                                  tags: []},
//                                  {referenceArtifact: {referenceArtifactId: 3,
//                                                    documentTitle: "artifact three",
//                                                    abbreviation: "artifact three abbrev",
//                                                    detailedText: "artifact three detailed text",
//                                                    lovDocumentType: "UID"},
//                                  parentArtifact : {},
//                                  tags: []}];
//
//                  return artifactList;
                return searchList;
              }

        };
	});


