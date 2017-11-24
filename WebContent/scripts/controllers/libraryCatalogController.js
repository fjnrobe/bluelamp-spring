angular.module('bluelamp')
.controller('libraryCatalogController', ['$scope', 'Library', function($scope, Library) {

    //the library will be loaded dynamically. Initially, only level 1 entries are loaded.
    //when the user clicks on a libary entry to expand, the code will make a call back to
    //retrieve the children of that library
    $scope.libraryChangeType = "";  //will be used to set the edit mode of the library item
    $scope.referenceLibraryId = "";
    $scope.currentLibraryItem ={};   //when editing/deleting - this will be set

    $scope.entryLevel = "";         //'sibling' or 'child' - 'sibling' : add as same level
                                    //as referenceLibraryId, if 'child' - make a child
    $scope.libraryDescription = ""; //this will set/used when adding/editing library entries
    $scope.libraryAbbrev = "";
    $scope.libraryList = []; //this will initially be the level 1 library entries only

    $scope.libraryCatalog = []; //this will be a list of loaded library entries

    //function to create an id for use as page id, shape id, connector id, etc
	$scope.generateId = function() {
		return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		  (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
		)
	}


    $scope.loadLibrary = function() {

        var library1 = Library.loadSubLibrary(0)
        if (library1 != null)
        {
            $scope.libraryList.push(library1);
            $scope.libraryCatalog.push(library1);
        };
    }

    var level2Clicked = false;
    var level3Clicked = false;

    //when the user clicks on a library entry, the function is called with the selected item
    //Becausse the library is nested, a click to an inner item will also trigger a click on
    //the outer item (clicks responded from in to out).
    $scope.showHide = function(item)
    {
        //if there is no libary2, then it means that the method is being called for a level 1 item
        if (item.library2 == null)
        {
            //but, if level2Clicked is true, it means this is just an outer-click of an
            //inner level 2 item click.
            if (!level2Clicked)
            {
                item.library1.expanded = !item.library1.expanded;
                //if the item was expanded - we need to load the children
                if (item.library1.expanded)
                {
                  //  Library.loadSubLibrary(item.library1);
                }
            }
            else
            {
                level2Clicked = false;
            }
        }
        else
        {
            item.library2.expanded = !item.library2.expanded;
            //if the item was expanded - we need to load the children
            if (item.library2.expanded)
            {
             //   Library.loadSubLibrary(item.library2).success(function(data) {
                    //what to do on success
             //   });
            }

            level2Clicked = true;
        }
    }

    $scope.setAddLibraryItem = function(libraryId, level)
    {
        //wrap in apply so it refreshes page
        $scope.$apply(function () {
            $scope.libraryChangeType = "Create";
            $scope.referenceLibraryId = libraryId;
            $scope.entryLevel = level;
            $scope.libraryDescription = "";
            $scope.libraryAbbrev = ""
        });
    }

    $scope.setEditLibraryItem = function (libraryId)
    {
        //wrap in apply so it refreshes page
        $scope.$apply(function () {
            $scope.libraryChangeType = "Edit";
            $scope.currentLibraryItem =  getLibraryEntry(libraryId);
            $scope.libraryDescription = JSON.parse(JSON.stringify($scope.currentLibraryItem.description));
            $scope.libraryAbbrev = JSON.parse(JSON.stringify($scope.currentLibraryItem.abbreviation))
        });
    }

    $scope.deleteLibraryItem = function (libraryId)
    {
        var bFound = false;

        //wrap in apply so it refreshes page
        $scope.$apply(function () {

         //  Library.deleteLibraryEntry(libraryId).success( function(data)
         //  {
               var entry = getLibraryEntry(libraryId);

               for (lvl0 = 0; lvl0 < $scope.libraryCatalog.length; lvl0++)
               {
                    if (entry.libraryId == $scope.libraryCatalog[lvl0].libraryId)
                    {
                        $scope.libraryCatalog.splice(lvl0,1);
                    }
               }


                //dummy code for now - will need to invoke backend
                 if (entry.level == 1)
                 {
                     for (var lvl1 = 0; lvl1 < $scope.libraryList.length; lvl1++)
                     {
                         if (entry.libraryId == $scope.libraryList[lvl1].libraryId)
                         {
                             $scope.libraryList.splice(lvl1,1);
                             break;
                         }
                     }
                 }
                 else if (entry.level == 2)
                 {
                     for (var lvl1 = 0; lvl1 < $scope.libraryList.length; lvl1++)
                     {
                        for (var lvl2 = 0; lvl2 < $scope.libraryList[lvl1].subLibraryList.length; lvl2++)
                        {
                            if (entry.libraryId == $scope.libraryList[lvl1].subLibraryList[lvl2].libraryId)
                            {
                                $scope.libraryList[lvl1].subLibraryList.splice(lvl2,1);
                                bFound = true;
                                break;
                            }
                         }
                         if (bFound)
                         {
                            break;
                         }
                     }
                 }
                 else
                 {
                     for (var lvl1 = 0; lvl1 < $scope.libraryList.length; lvl1++)
                     {
                         for (var lvl2 = 0; lvl2 < $scope.libraryList[lvl1].subLibraryList.length; lvl1++)
                         {
                             for (var lvl3 = 0; lvl3 < $scope.libraryList[lvl1].subLibraryList[lvl2].subLibraryList.length; lvl3++)
                             {
                                 if (entry.libraryId == $scope.libraryList[lvl1].subLibraryList[lvl2].subLibraryList[lvl3].libraryId)
                                 {
                                     $scope.libraryList[lvl1].subLibraryList[lvl2].subLibraryList.splice(lvl3,1);
                                     bFound = true;
                                     break;
                                 }
                             }
                             if (bFound)
                             {
                                break;
                             }
                         }
                         if (bFound)
                         {
                             break;
                         }
                     }
                 }
           })
     //   });
    }

    $scope.saveLibraryEntry = function() {

        //wrap in apply so it refreshes page
        $scope.$apply(function () {

            if ($scope.libraryChangeType == "Create")
            {
                //find the reference library in the catalog.
                var referenceTitle = getLibraryEntry($scope.referenceLibraryId);

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
                    newParentId = referenceTitle.libraryId;
                }

                var newEntry = {libraryId: $scope.generateId(),
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
            }

            $scope.referenceLibraryId = "";
            $scope.entryLevel = "";
            $scope.libraryDescription = "";
            $scope.libraryAbbrev = "";
        });
    }

    //this function gets the library entry for the reference library
    function getLibraryEntry(referenceLibraryId)
    {
        var retValue = null;

        //dummy code for now - will need to invoke backend
        for (var idx = 0; idx < $scope.libraryCatalog.length; idx++)
        {
            if (referenceLibraryId == $scope.libraryCatalog[idx].libraryId)
            {
                retValue = $scope.libraryCatalog[idx];
                 break;
            }
        }

        return retValue;
    }

    function persistLibraryEntry(newEntry)
    {
      //  Library.persistLibraryEntry(newEntry).success(function (data)
      //  {
            var bDone = false;
            //real code will need to persist to back-end

            if (newEntry.level == 1)
            {
                $scope.libraryList.push(newEntry);
                $scope.libraryCatalog.push(newEntry);
            }
            else if (newEntry.level == 2)
            {
                for (var lvl1 = 0; lvl1 < $scope.libraryList.length; lvl1++)
                {
                    if (newEntry.parentLibraryId == $scope.libraryList[lvl1].libraryId)
                    {
                        $scope.libraryList[lvl1].subLibraryList.push(newEntry);
                        $scope.libraryCatalog.push(newEntry);
                        break;
                    }
                }
            }
            else
            {
                var bFound = false;
                for (var lvl1 = 0; lvl1 < $scope.libraryList.length; lvl1++)
                {
                    for (var lvl2 = 0; lvl2 < $scope.libraryList[lvl1].subLibraryList.length; lvl1++)
                    {
                        if (newEntry.parentLibraryId == $scope.libraryList[lvl1].subLibraryList[lvl2].libraryId)
                        {
                            $scope.libraryList[lvl1].subLibraryList[lvl2].subLibraryList.push(newEntry);
                            $scope.libraryCatalog.push(newEntry);
                            bFound = true;
                            break;
                        }
                    }
                    if (bFound)
                    {
                        break;
                    }
                }
            }
        //});
    }

    $scope.loadLibrary();
   
}]);



