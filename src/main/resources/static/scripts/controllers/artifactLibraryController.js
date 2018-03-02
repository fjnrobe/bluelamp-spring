angular.module('bluelamp')
.controller('artifactLibraryController', [ '$q', '$scope', '$timeout',
                                            '$controller',
                                            'Library',
                                            'Artifact',
                                            'Tag',
                                            'Lov', function($q,
                                                    $scope, $timeout, $controller, Library, Artifact, Tag, Lov) {

    $scope.searchText = "";
	$scope.matchingArtifactsList = []; //loaded if the user wants to create a drill down on a shape and opts to search for an existing page
	$scope.selectedArtifact = "";		//set to the page id of the selected diagram when setting up a drill down

    $scope.currentArtifact = {} //the artifact being added/edited. - artifactDto
    $scope.defaultDocType = {id:"-1",
                                 lovTable: "DocType",
                                 shortName: "select document type",
                                 longName: "select document type"};

    $scope.parentArtifact = {}; //if a parent artifact is set when creating a new artifact

    $scope.currentTags = [];
    //the selected tag/value
    $scope.selectedTagType = {};
    $scope.selectedTagValue = "";

    $scope.newDocTypeShortDesc = ""; //this is used when adding a new document type
    $scope.newDocTypeLongDesc = ""; //this is used when adding a new document type

    //set a reference to the base controller
    $controller('baseController', { $scope: $scope });

    //invoked when the user clicks on a library level
    $scope.showHideArtifacts  = function(item)
    {
         //expand/collapse the library catalog
        currentlySelectedLibraryId = $scope.showHide(item);
        $scope.loadArtifactList(currentlySelectedLibraryId);
    }

//    //when the user clicks the search button for a parent artifact
//    $scope.openSearchDialog = function()
//    {
//        $scope.searchText = "";
//        $scope.matchingArtifactsList = [];
//        searchArtifactDialog.dialog("open");
//    }

//	//when the user clicks search on the 'search diagrams' popup
//	$scope.searchArtifacts = function()
//	{
//		//the results will have a pageName (which must be unique across the system, and a library description which is the level 1, level 2, level 3 entry
//		$scope.matchingArtifactsList = Artifact.searchArtifacts($scope.searchText);
//    }

//    //on the editConnector popup, when the user clicks on a diagram, this gets invoked
//    $scope.setSelectedArtifact = function(row) {
//
//        $scope.selectedArtifact = row;
//    }

//    //if the user links the artifact to a parent -this is called when the save button is pressed.
//    $scope.setParentArtifact = function()
//    {
//        $scope.$apply(function () {
//            $scope.currentArtifact.parentArtifact = $scope.selectedArtifact;
//        });
//
//    }

    //invoked when the user clicks the 'document type' link on the artifact popup to add a new document type
    $scope.openNewDocType = function()
    {
        $scope.popupErrors = [];
        $scope.newDocTypeShortDesc = "";
        $scope.newDocTypeLongDesc = "";
        addDocType.dialog("open");
    }

    //invoked when the user clicks save on the new doc type popup
    $scope.saveNewDocType = function()
    {
        var lovDto = {id: $scope.generateId(),
                      lovTable : 'DocType',
                      shortName: $scope.newDocTypeShortDesc,
                      longName: $scope.newDocTypeLongDesc};

         //wrap in apply so it refreshes page
        $scope.$apply(function () {
            Tag.addTagType(lovDto ).then (function (response) {

                if (response.status == "406")
                {
                    $scope.popupErrors = response.data;
                }
                else
                {
                    $scope.docTypeList.push(lovDto);
                    addDocType.dialog("close");
                }
            });
        })
    }



    //when the user right-clicks on a library entry to add a new artifact
    $scope.createNewArtifact = function(pLibraryId)
    {
        $scope.$apply(function() {
            $scope.errors = [];
            $scope.annotation = {id: $scope.generateId(), annotationText: ""};
            $scope.annotations = [];
            $scope.tags = [];
            $scope.currentArtifact = initArtifact();
            $scope.currentArtifact.libraryId = pLibraryId;
            $scope.initLibraryLists($scope.currentArtifact.libraryId);
            $scope.editPropertyTitle = "Create New Artifact";
            $scope.isArtifact = true;
            addEditArtifact.dialog("open");

        });
    }

    //when the user right-clicks to edit an existing artifact
    //we need to move the artifact to currentArtifact so we can edit it
    $scope.setCurrentArtifact = function(artifactId) {

         Artifact.getArtifactEntry(artifactId).then(function (response) {
            if (response.status == "406")
            {
                $scope.errors = response.data;
            }
            else
            {
                $scope.errors = [];
                $scope.currentArtifact = response.data;
                $scope.initLibraryLists($scope.currentArtifact.libraryId);
                $scope.annotations = $scope.currentArtifact.annotationDtos;
                $scope.tags = $scope.currentArtifact.tagDtos;
                $scope.setEditType("artifact");
                addEditArtifact.dialog("open");
            }
         });
    }

    function initArtifact()
    {

        var val =
        {id:$scope.generateId(),
              documentTitle: "",
              abbreviation: "",
              detailedText: "",
              documentType: $scope.defaultDocType,
              libraryId : "",
              tagDtos: [],
              annotationDtos: []};

        return val;
    }

    $scope.deleteArtifact = function(artifactId)
    {
         var refreshLibraryId = $scope.currentlySelectedLibraryId
         Artifact.deleteArtifact(artifactId).then(function (response) {
            if (response.status == "406")
            {
//TODO: make a nicer error box at some point
                alert(response.data);
//                $scope.errors = response.data;
            }
            else
            {
                $scope.errors = [];
                $scope.currentArtifact = null;
                $scope.loadLibrary();
                $scope.initLibraryLists(null);
                $scope.loadArtifactList(refreshLibraryId);
            }
         });
    }

    $scope.saveArtifact = function()
    {
         //the library associated with an artifact is the lowest selected level
         if ($scope.selectedLibrary3.id != null)
         {
            $scope.currentArtifact.libraryId = $scope.selectedLibrary3.id;
         }
         else if ($scope.selectedLibrary2.id != null)
         {
            $scope.currentArtifact.libraryId = $scope.selectedLibrary2.id;
         }
         else
         {
           $scope.currentArtifact.libraryId = $scope.selectedLibrary1.id;
         }

         if ($scope.currentArtifact.documentType.id == "-1")
         {
            $scope.currentArtifact.documentType = null;
         }

         $scope.currentArtifact.tagDtos = $scope.tags;
         $scope.currentArtifact.annotationDtos = $scope.annotations;


         var refreshLibraryId = $scope.currentlySelectedLibraryId
         $scope.$apply(function() {

             Artifact.saveArtifact($scope.currentArtifact).then (function (response) {

                if (response.status == "406")
                {
                    $scope.errors = response.data;
                }
                else if (response.status == "201")
                {
                    addEditArtifact.dialog("close");
                    $scope.loadLibrary();
                    //refresh the artifact list - to reflect the newly added/edited artifact
                    $scope.loadArtifactList(refreshLibraryId);
                }
                else
                {
                    $scope.errors = response.data;
                }
             });
         });
    }

    $scope.loadLibrary();
    $scope.loadTags();
    $scope.loadDocTypes();

}]);



