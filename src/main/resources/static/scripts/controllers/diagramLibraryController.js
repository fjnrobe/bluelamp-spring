angular.module('bluelamp' )
.controller('diagramLibraryController', ['$q', '$scope', '$controller',
                    'Library', 'Diagram',
            function($q, $scope, $controller, Library, Diagram) {

    $scope.pageTitle = "";
    $scope.pageDescription = "";
    //the library will be loaded dynamically. Initially, only level 1 entries are loaded.
    //when the user clicks on a libary entry to expand, the code will make a call back to
    //retrieve the children of that library
    $scope.referenceLibraryId = "";

    $scope.libraryList = []; //this will initially be the level 1 library entries only

    $scope.diagramList = [];    //this will be loaded whenever user clicks on a library entry

    $scope.searchText = "";
	$scope.matchingDiagramsList = []; //loaded if the user wants to create a drill down on a shape and opts to search for an existing page
	$scope.selectedDiagram = "";		//set to the page id of the selected diagram when setting up a drill down

    //set a reference to the base controller
    $controller('baseController', { $scope: $scope });

//    //when the user clicks the search button on the diagram libary
//    $scope.openSearchDialog = function()
//    {
//        $scope.searchText = "";
//        searchDiagramDialog.dialog("open");
//    }
//
//	//when the user clicks search on the 'search diagrams' popup
//	$scope.searchDiagrams = function()
//	{
//		//need to invoke actual backend end point to get the diagrams that meet the search criteria- dummy results for now
//		$scope.matchingDiagramsList = [];
//
//		//the results will have a pageName (which must be unique across the system, and a library description which is the level 1, level 2, level 3 entry
//		$scope.matchingDiagramsList = [{pageId: 1, diagramTitle: "title one", diagramLibrary: "Health, CAPP STRS, Financials"},
//							     {pageId: 2, diagramTitle: "title two", diagramLibrary: "Benefits, Forms"},
//								 {pageId: 3, diagramTitle: "title three", diagramLibrary: "Contracts"}];
//	}

    //on the editConnector popup, when the user clicks on a diagram, this gets invoked
    $scope.setSelectedDiagram = function(row) {

        $scope.selectedDiagram = row;
    }

    //invoked when the user clicks on a library level
    $scope.showHideDiagrams  = function(item)
    {
         //expand/collapse the library catalog
        currentlySelectedLibraryId = $scope.showHide(item);
        loadDiagrams(currentlySelectedLibraryId);
    }

    function loadDiagrams(libraryId)
    {
         if (libraryId != null)
        {
           Diagram.loadDiagrams(libraryId).then(function (response) {
                if (response.status == "406")
                {
                    $scope.errors = response.data;
                }
                else
                {
                    $scope.diagramList = response.data;
                }
            });
        }
    }

    //when the user right-clicks on a library entry to add a new diagram
    $scope.createNewDiagram = function(libraryId)
    {
        $scope.currentPage = $scope.createNewUiPageDto();
        $scope.currentPage.pageDto.libraryId = libraryId;
        $scope.referenceLibraryId = libraryId;
        $scope.initLibraryLists(libraryId);
        $scope.isPage = true;
        $scope.annotations = [];
        $scope.annotation = {id: $scope.generateId(), annotationText: ""};
        $scope.editPropertyTitle = "Create Diagram";
        newPageDiagram.dialog("open");
    }

    $scope.saveNewDiagram = function()
    {
        $scope.$apply(function() {

            $scope.savePageEdits();

            Diagram.saveDiagram($scope.currentPage).then (function (response) {

            if (response.status == "406")
            {
                $scope.errors = response.data;
            }
            else if (response.status == "201")
            {
                newPageDiagram.dialog("close");

                $scope.navigateToDiagram($scope.currentPage.pageDto.id);
//                //refresh the artifact list - to reflect the newly added/edited artifact
//                loadDiagrams(currentlySelectedLibraryId);
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



