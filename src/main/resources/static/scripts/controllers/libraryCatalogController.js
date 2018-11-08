angular.module('bluelamp')
.controller('libraryCatalogController', ['$scope', '$controller', 'Library', function($scope, $controller, Library) {

    //the library will be loaded dynamically. Initially, only level 1 entries are loaded.
    //when the user clicks on a libary entry to expand, the code will make a call back to
    //retrieve the children of that library
    $scope.libraryChangeType = "";  //will be used to set the edit mode of the library item
    $scope.referenceLibraryId = "";
    $scope.showMoveLibraryFields = false;

    $scope.currentLibraryItem ={};   //when editing/deleting - this will be set

    $scope.entryLevel = "";         //'sibling' or 'child' - 'sibling' : add as same level
                                    //as referenceLibraryId, if 'child' - make a child
    $scope.libraryDescription = ""; //this will set/used when adding/editing library entries
    $scope.libraryAbbrev = "";

    //set a reference to the base controller
    $controller('baseController', { $scope: $scope });

    $scope.setAddLibraryItem = function(libraryId, level)
    {
        //wrap in apply so it refreshes page
        $scope.$apply(function () {
            $scope.showMoveLibraryFields = false;
            $scope.libraryChangeType = "Create";
            $scope.referenceLibraryId = libraryId;
            $scope.entryLevel = level;
            $scope.libraryDescription = "";
            $scope.libraryAbbrev = ""

            $scope.initLibraryLists(libraryId);
        });
    }

    $scope.setEditLibraryItem = function (libraryId)
    {
        //wrap in apply so it refreshes page
        $scope.$apply(function () {
            $scope.libraryChangeType = "Edit";

            $scope.showMoveLibraryFields = true;
            $scope.initLibraryLists(libraryId);
            $scope.currentLibraryItem = $scope.getLibraryEntry(libraryId);
            $scope.libraryDescription = JSON.parse(JSON.stringify($scope.currentLibraryItem.description));
            $scope.libraryAbbrev = JSON.parse(JSON.stringify($scope.currentLibraryItem.abbreviation))

        });
    }

    $scope.deleteLibraryItem = function (libraryId)
    {
        var bFound = false;

        //wrap in apply so it refreshes page
        $scope.$apply(function () {

           Library.deleteLibraryEntry(libraryId).then( function(data)
           {
               $scope.loadLibrary();
           })
        });
    }

    //when the user clicks save on the library popup - for add or edit
    $scope.saveLibraryEntry = function() {

        //wrap in apply so it refreshes page
        $scope.$apply(function () {

            //the library associated with an artifact is the lowest selected level
            if ($scope.selectedLibrary3.id != null)
            {
                $scope.referenceLibraryId = $scope.selectedLibrary3.id;
            }
            else if ($scope.selectedLibrary2.id != null)
            {
                $scope.referenceLibraryId = $scope.selectedLibrary2.id;
            }
            else
            {
               $scope.referenceLibraryId = $scope.selectedLibrary1.id;
            }

            if ($scope.libraryChangeType == "Create")
            {
                //find the reference library in the catalog.
                var referenceTitle = $scope.getLibraryEntry($scope.referenceLibraryId);

                //if $scope.entryLevel = 'sibling' , then make the new entry at same
                //level as referencetitle and with same parent
                //if $scope.entryLevel = 'child', make new entry a child of referencetitle
                var newLevel = 0;
                var newParentId = 0;
                if ($scope.entryLevel == 'sibling')
                {
                    newLevel = referenceTitle.level;
                    newParentId = referenceTitle.parentLibraryId;
                }
                else
                {
                    newLevel = referenceTitle.level + 1;
                    newParentId = referenceTitle.id;
                }

                var newEntry = {id: $scope.generateId(),
                                level: newLevel,
                                description: $scope.libraryDescription,
                                abbreviation: $scope.libraryAbbrev,
                                parentLibraryId: newParentId,
                                subLibraryList: [], expanded: false };

                persistLibraryEntry(newEntry);
            }
            else if ($scope.libraryChangeType == "Edit")
            {
                $scope.currentLibraryItem.description = $scope.libraryDescription;
                $scope.currentLibraryItem.abbreviation = $scope.libraryAbbrev;
                $scope.currentLibraryItem.parentLibraryId = $scope.referenceLibraryId;
                persistLibraryEntry($scope.currentLibraryItem);

            }

            $scope.referenceLibraryId = "";
            $scope.entryLevel = "";
            $scope.libraryDescription = "";
            $scope.libraryAbbrev = "";
        });
    }

    //performs the actual persistence of the library entry (add and update)
    function persistLibraryEntry(newEntry)
    {

        Library.persistLibraryEntry(newEntry).then(function (data)
        {
            $scope.loadLibrary();
        });
    }

    $scope.loadLibrary();
   
}]);



