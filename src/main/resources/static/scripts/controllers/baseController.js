angular.module('bluelamp')
.controller('baseController', ['$scope', 'Library', function($scope, Library) {

    $scope.currentlySelectedLibraryId = null;   //this is the library entry that has been clicked on for view/expansion

    $scope.libraryList = []; //this will initially be the level 1 library entries only. This is the
                             //list that the page binds to and maintains the library info and levels,

    $scope.selectedLibrary1 = {};
    $scope.library1List = [];

    $scope.selectedLibrary2 = {};
    $scope.library2List = [];

    $scope.selectedLibrary3 = {};
    $scope.library3List = [];

    $scope.expandedLibraryItems = [];

    $scope.errors = [];      //any errors reported will be a list of ErrorDto
    //function to create an id for use as page id, shape id, connector id, etc
	$scope.generateId = function() {
		return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		  (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
		)
	}

    $scope.loadLibrary = function() {

       //all 0 level library entries have '-1' as the parent id
       Library.loadSubLibrary("-1").then(function(data)
       {
            updateLibraryList(data);
       });
    }

    var level2Clicked = false;
    var level3Clicked = false;

    //when the user clicks on a library entry, the function is called with the selected item
    //Because the library is nested, a click to an inner item will also trigger a click on
    //the outer item (clicks responded from in to out).
    $scope.showHide = function(item)
    {
        //we will return the selected library id
       currentlySelectedLibraryId = null;

        //if there is no library2, then it means that the method is being called for a level 1 item
        if (item.library2 == null)
        {
            //but, if level2Clicked is true, it means this is just an outer-click of an
            //inner level 2 item click.
            if (!level2Clicked)
            {
                item.library1.expanded = !item.library1.expanded;
                currentlySelectedLibraryId = item.library1.id;
                //if the item was expanded - we need to load the children
                if (item.library1.expanded)
                {
                     $scope.expandedLibraryItems.push(item.library1.id);

                     Library.loadSubLibrary(item.library1.id).then(function(data)
                     {
                       //reset/refresh the child list
                       item.library1.subLibraryList = data;

                     });
                }
                else
                {
                    for (idx = 0; idx < $scope.expandedLibraryItems.length; idx++)
                    {
                        if ($scope.expandedLibraryItems[idx] == item.library1.id )
                        {
                            $scope.expandedLibraryItems.splice(idx,1);
                        }
                    }
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
            currentlySelectedLibraryId = item.library2.id;

            if (item.library2.expanded)
            {
                $scope.expandedLibraryItems.push(item.library2.id);

                Library.loadSubLibrary(item.library2.id).then(function(data)
                {
                    //reset/refresh the child list
                    item.library2.subLibraryList = data;

                });
            }
            else
            {
                for (idx = 0; idx < $scope.expandedLibraryItems.length; idx++)
                {
                    if ($scope.expandedLibraryItems[idx] == item.library2.id )
                    {
                        $scope.expandedLibraryItems.splice(idx,1);
                    }
                }
            }

            level2Clicked = true;
        }

        return currentlySelectedLibraryId;
    }

    //this function refreshes the base library list with the incoming list.
    function updateLibraryList(newLibraryList)
    {
        $scope.libraryList = newLibraryList;

        //the newLibraryList will be the resultant list. Get the expanded state
        //of each entry for the current library list
        for (var idx = 0; idx < $scope.libraryList.length; idx++)
        {
            if (isLibraryExpanded($scope.libraryList[idx].id))
            {
                $scope.libraryList[idx].expanded = true;

                Library.loadSubLibrary($scope.libraryList[idx].id).then(function(data)
                {
                    //reset/refresh the child list
                    var subList = data;

                    for (var libIdx = 0; libIdx < $scope.libraryList.length; libIdx++)
                    {
                        var entry = $scope.getLibraryEntry(subList[0].parentLibraryId);
                        if (entry != null)
                        {
                            entry.subLibraryList = data;
                        }

                        //load the sublists for any expanded children
                         for (var childIdx = 0; childIdx < subList.length; childIdx++)
                         {
                            if (isLibraryExpanded(subList[childIdx].id))
                            {
                                subList[childIdx].expanded = true;

                                Library.loadSubLibrary(subList[childIdx].id).then(function(data)
                                {
                                    //reset/refresh the child list
                                    var subSubList = data;

                                    var entry = $scope.getLibraryEntry(subSubList[0].parentLibraryId);
                                    if (entry != null)
                                    {
                                        entry.subLibraryList = data;
                                    }
                                });
                            }
                         }
                    }
                })
            }
       }


    }

    //this function returns true if the incoming library id is expanded
    function isLibraryExpanded(libId)
    {
        var isExpanded = false;

        for (var expandIdx = 0; expandIdx < $scope.expandedLibraryItems.length; expandIdx++)
        {
            if ($scope.expandedLibraryItems[expandIdx] == libId)
            {
                isExpanded = true;
                break;
            }
        }

        return isExpanded;
    }

    //this function returns the library entry within the libraryList for the incoming id -searching
    //all levels as needed
    $scope.getLibraryEntry = function(libId)
    {
        var libraryEntry = null;

        //search through the 1st level entries
        for (var idx1 = 0; idx1 < $scope.libraryList.length; idx1++)
        {
            if ($scope.libraryList[idx1].id == libId)
            {
                libraryEntry = $scope.libraryList[idx1];
                break;
            }
            else
            {
                if ($scope.libraryList[idx1].subLibraryList != null)
                {
                    //search through the second level entries
                    for (var idx2 = 0; idx2 < $scope.libraryList[idx1].subLibraryList.length; idx2++)
                    {
                        if ($scope.libraryList[idx1].subLibraryList[idx2].id == libId)
                        {
                            libraryEntry = $scope.libraryList[idx1].subLibraryList[idx2];
                            break;
                        }
                        else
                        {
                            if ($scope.libraryList[idx1].subLibraryList[idx2].subLibraryList != null)
                            {
                                for (var idx3 = 0; idx3 < $scope.libraryList[idx1].subLibraryList[idx2].subLibraryList.length;
                                        idx3++)
                                {
                                    if ($scope.libraryList[idx1].subLibraryList[idx2].subLibraryList[idx3].id == libId)
                                    {
                                        libraryEntry = $scope.libraryList[idx1].subLibraryList[idx2].subLibraryList[idx3];
                                        break;
                                    }
                                }
                            }
                        }
                        if (libraryEntry != null)
                        {
                            break;
                        }
                    }
                    if (libraryEntry != null)
                    {
                        break;
                    }
                }
            }
        }
        return libraryEntry;
    }

    //called on popup load for the add/edit of the artifact
	$scope.loadLibrary1List = function(pSelectedLibrary1, pSelectedLibrary2, pSelectedLibrary3)
	{
		$scope.library1List = [];
		$scope.library2List = [];
		$scope.library3List = [];


        $scope.selectedLibrary1 = pSelectedLibrary1;
        $scope.selectedLibrary2 = pSelectedLibrary2;
        $scope.selectedLibrary3 = pSelectedLibrary3;
        $scope.selectedArtifact = {};

		//set a default entry
		$scope.library1List.push({id: -1, level: 0, description: '',
		                          abbreviation: "------------------------------", parentLibraryId : 0});
        $scope.library2List.push({id: -1, level: 1, description: '',
                                  abbreviation: "------------------------------", parentLibraryId : 0});
        $scope.library3List.push({id: -1, level: 2, description: '',
                                  abbreviation: "------------------------------", parentLibraryId : 0});

       //all 0 level library entries have '-1' as the parent id
       Library.loadSubLibrary("-1").then(function(data)
       {
    		$scope.library1List = $scope.library1List.concat(data);
            if (pSelectedLibrary1 != null)
            {
                $scope.selectedLibrary1 = pSelectedLibrary1;
                Library.loadSubLibrary(pSelectedLibrary1.id).then(function(data)
                {
                    $scope.library2List = $scope.library1List.concat(data);
                    if (pSelectedLibrary2 != null)
                    {
                        $scope.selectedLibrary2 = pSelectedLibrary2;
                        Library.loadSubLibrary(pSelectedLibrary2.id).then (function (data)
                        {
                            $scope.library3List = $scope.library3List.concat(data);
                            if (pSelectedLibrary3 != null)
                            {
                                $scope.selectedLibrary3 = pSelectedLibrary3
                            }
                            else
                            {
                                $scope.selectedLibrary3 = $scope.library3List[0];
                            }
                        })
                    }
                    else
                    {
                        $scope.selectedLibrary2 = $scope.library2List[0];
                        $scope.selectedLibrary3 = $scope.library3List[0];
                    }
                })
            }
            else
            {
                $scope.selectedLibrary1 = $scope.library1List[0];
                $scope.selectedLibrary2 = $scope.library2List[0];
                $scope.selectedLibrary3 = $scope.library3List[0];
            }
       });
	}

	//this would be called after the user has selected an entry in the library 1 list - the selected entry in library 1 drives what to put in library list 2
	$scope.loadLibrary2List = function()
	{
		$scope.library2List = [];
		//set a default entry
    	 $scope.library2List.push({id: -1, level: 2, description: '',
                                          abbreviation: "------------------------------", parentLibraryId : 0});

		if ($scope.selectedLibrary1 != null)
		{
		    Library.loadSubLibrary($scope.selectedLibrary1.id).then(function(data)
            {
                 $scope.library2List = $scope.library2List.concat(data);
                 $scope.selectedLibrary2 = $scope.library2List[0];
                 $scope.loadLibrary3List();
            })
		}
		else
		{
            $scope.selectedLibrary2 = $scope.library2List[0];
            $scope.loadLibrary3List();
        }
	}

	//this would be called after the user has selected an entry in the library 2 list - the selected entry in library 2 drives what to put in library list 3
	$scope.loadLibrary3List = function()
	{
		$scope.library3List = [];
		//set a default entry
		$scope.library3List.push({id: -1, level: 3, description: '',
                                                  abbreviation: "------------------------------", parentLibraryId : 0});

		if ($scope.selectedLibrary2 != null)
		{
			  Library.loadSubLibrary($scope.selectedLibrary2.id).then(function(data)
              {
                 $scope.library3List = $scope.library3List.concat(data);
         		 $scope.selectedLibrary3 = $scope.library3List[0];
              })
		}
		else
		{
		    $scope.selectedLibrary3 = $scope.library3List[0];
		}
	}

	//use the incoming library id to set the the three library lists
    $scope.initLibraryLists = function(pLibraryId)
    {
        $scope.selectedLibrary1 = null;
        $scope.selectedLibrary2 = null;
        $scope.selectedLibrary3 = null;

        var library1 = null;
        var library2 = null;
        var library3 = null;

        //get the library entry and its ancestors
        var libraryEntry = Library.getLibraryEntry(pLibraryId);
        libraryEntry.then (function (libraryList) {

            if (libraryList.length == 3)
            {
                library3 = libraryList[0];
                library2 = libraryList[1];
                library1 = libraryList[2];
            }
            else if (libraryList.length == 2)
            {
                library2 = libraryList[0];
                library1 = libraryList[1];
            }
            else if (libraryList.length == 1)
            {
                library1 = libraryList[0];
            }

            $scope.loadLibrary1List(library1, library2, library3);
        });
    }

}]);



