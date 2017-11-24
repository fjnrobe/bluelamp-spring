angular.module('bluelamp', )
.controller('diagramLibraryController', ['$scope', 'Library', 'Diagram', function($scope, Library, Diagram) {

    $scope.pageTitle = "";
    $scope.pageDescription = "";
    //the library will be loaded dynamically. Initially, only level 1 entries are loaded.
    //when the user clicks on a libary entry to expand, the code will make a call back to
    //retrieve the children of that library
    $scope.referenceLibraryId = "";

    $scope.libraryList = []; //this will initially be the level 1 library entries only

    $scope.libraryCatalog = []; //this will be a list of loaded library entries
    $scope.diagramList = [];    //this will be loaded whenever user clicks on a library entry

    $scope.searchText = "";
	$scope.matchingDiagramsList = []; //loaded if the user wants to create a drill down on a shape and opts to search for an existing page
	$scope.selectedDiagram = "";		//set to the page id of the selected diagram when setting up a drill down

    //function to create an id for use as page id, shape id, connector id, etc
	$scope.generateId = function() {
		return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		  (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
		)
	}

    $scope.loadLibrary = function() {

       var library1 = Library.loadSubLibrary(0);
      if (library1 != null)
      {
          $scope.libraryList.push(library1);
          $scope.libraryCatalog.push(library1);
      };

       var library2 = Library.loadSubLibrary(1);
       if (library2 != null)
       {
            $scope.libraryList.push(library2);
            $scope.libraryCatalog.push(library2);
       };

       var library3 = Library.loadSubLibrary(3);
       if (library3 != null)
       {
          $scope.libraryList.push(library3);
          $scope.libraryCatalog.push(library3);
      };
    }

    //this function will load the children of the incoming library
    function loadSubLibrary(parentLibrary)
    {

    }

    //when the user clicks the search button on the diagram libary
    $scope.openSearchDialog = function()
    {
        $scope.searchText = "";
        searchDiagramDialog.dialog("open");
    }

	//when the user clicks search on the 'search diagrams' popup
	$scope.searchDiagrams = function()
	{
		//need to invoke actual backend end point to get the diagrams that meet the search criteria- dummy results for now
		$scope.matchingDiagramsList = [];

		//the results will have a pageName (which must be unique across the system, and a library description which is the level 1, level 2, level 3 entry
		$scope.matchingDiagramsList = [{pageId: 1, diagramTitle: "title one", diagramLibrary: "Health, CAPP STRS, Financials"},
							     {pageId: 2, diagramTitle: "title two", diagramLibrary: "Benefits, Forms"},
								 {pageId: 3, diagramTitle: "title three", diagramLibrary: "Contracts"}];
	}

    //on the editConnector popup, when the user clicks on a diagram, this gets invoked
    $scope.setSelectedDiagram = function(row) {

        $scope.selectedDiagram = row;
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
                    loadSubLibrary(item.library1);
                }
                loadDiagrams(item.library1.libraryId);
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
                loadSubLibrary(item.library2);
            }
            loadDiagrams(item.library2.libraryId);
            level2Clicked = true;
        }
    }

    function loadDiagrams(libraryId)
    {
        $scope.diagramList = Diagram.loadDiagrams(libraryId);
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

    //when the user right-clicks on a library entry to add a new diagram
    $scope.createNewDiagram = function(libraryId)
    {
        $scope.referenceLibraryId = libraryId;
        $scope.pageTitle = "";
        $scope.pageDescription = "";
        newPageDiagram.dialog("open");
    }

    $scope.saveNewDiagram = function()
    {
         var pageDtoTemplate = { pageDto : {pageId: $scope.generateId,
                                            pageTitle: $scope.pageTitle,
                                            pageDescription: $scope.pageDescription,
                                            libraryId: $scope.referenceLibraryId,
                                            tags: [],
                                            annotations: []}};

         Diagram.saveNewDiagram(pageDtoTemplate);
    }

    $scope.loadLibrary();

}]);



