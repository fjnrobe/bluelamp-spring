angular.module('bluelamp' )
.controller('diagramLibraryController', ['$q', '$scope', '$timeout', '$controller',
                    'Library', 'Diagram',
            function($q, $scope, $timeout, $controller, Library, Diagram) {

    $scope.pageTitle = "";
    $scope.pageDescription = "";
    $scope.diagramFilterCriteria = "";
    //the library will be loaded dynamically. Initially, only level 1 entries are loaded.
    //when the user clicks on a libary entry to expand, the code will make a call back to
    //retrieve the children of that library
    $scope.referenceLibraryId = "";

    $scope.libraryList = []; //this will initially be the level 1 library entries only

    $scope.diagramList = [];    //this will be loaded whenever user clicks on a library entry

	$scope.selectedDiagram = "";		//set to the page id of the selected diagram when setting up a drill down

    //set a reference to the base controller
    $controller('baseController', { $scope: $scope });

    //on the editConnector popup, when the user clicks on a diagram, this gets invoked
    $scope.setSelectedDiagram = function(row) {

        $scope.selectedDiagram = row;
    }

    //invoked when the user clicks on a library level
    $scope.showHideDiagrams  = function(item)
    {
         //expand/collapse the library catalog
        currentlySelectedLibraryId = $scope.showHide(item);
        if (currentlySelectedLibraryId != null)
                {
                    if (item.library3 != null)
                    {
                        $scope.diagramFilterCriteria = "library: (" + item.library3.description + ")";
                    }
                    else if (item.library2 != null)
                    {
                        $scope.diagramFilterCriteria = "library: (" + item.library2.description + ")";
                    }
                    else
                    {
                        $scope.diagramFilterCriteria = "library: (" + item.library1.description + ")";
                    }

                }
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

        newPageDiagram.dialog("open");
        $timeout(function(){
            $scope.editPropertyTitle = "Create Diagram";
        });
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

    $scope.diagramSearch = function()
    {
        if ($scope.diagramSearchText != "")
        {
             Diagram.diagramSearch($scope.diagramSearchText).then(function (response) {
                if (response.status == "406")
                {
                }
                else
                {
                    $scope.diagramList = response.data;
                    $scope.diagramFilterCriteria = "search by (" + $scope.diagramSearchText + ")";
                }
             });
        }
    }

    $scope.loadLibrary();
    $scope.loadTags();
    $scope.loadDocTypes();

}]);



