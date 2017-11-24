angular.module('bluelamp', )
.controller('artifactLibraryController', ['$scope',
                                            'Library',
                                            'Artifact',
                                            'Tag',
                                            'Lov', function($scope, Library, Artifact, Tag, Lov) {

    //the library will be loaded dynamically. Initially, only level 1 entries are loaded.
    //when the user clicks on a libary entry to expand, the code will make a call back to
    //retrieve the children of that library
    $scope.referenceLibraryId = "";

    $scope.libraryList = []; //this will initially be the level 1 library entries only

    $scope.libraryCatalog = []; //this will be a list of loaded library entries
    $scope.artifactList = [];    //this will be loaded whenever user clicks on a library entry

    $scope.searchText = "";
	$scope.matchingArtifactsList = []; //loaded if the user wants to create a drill down on a shape and opts to search for an existing page
	$scope.selectedArtifact = "";		//set to the page id of the selected diagram when setting up a drill down
    $scope.docTypeList = [];

    $scope.currentArtifact = {} //the artifact being added/edited.
    $scope.docDetail = "";
    $scope.parentArtifact = {}; //if a parent artifact is set when creating a new artifact

    $scope.currentTags = [];
    //the selected tag/value
    $scope.selectedTagType = {};
    $scope.selectedTagValue = {};
    $scope.tagLibrary = []; //this will populate the dropdown of tag types
    //this will be bound to the tag values - and is set when the user selects a tag type
    $scope.tagValues = [];
    $scope.artifactList = [];

    $scope.selectedLibrary1 = {};
    $scope.library1List = [];

    $scope.selectedLibrary2 = {};
    $scope.library2List = [];

    $scope.selectedLibrary3 = {};
    $scope.library3List = [];

    //function to create an id for use as page id, shape id, connector id, etc
	$scope.generateId = function() {
		return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		  (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
		)
	}

    $scope.loadDocTypes = function()
    {
        $scope.docTypeList = Lov.getLovByTable('DocType');
    }

    $scope.loadTags = function()
    {
        $scope.tagLibrary = Lov.getLovByTable('Tag');
    }

    $scope.loadTagValues = function()
    {
        $scope.tagValues = Tag.getTagsByType($scope.selectedTagType.lovId);
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


    //when the user clicks the search button for a parent artifact
    $scope.openSearchDialog = function()
    {
        $scope.searchText = "";
        $scope.matchingArtifactsList = [];
        searchArtifactDialog.dialog("open");
    }

	//when the user clicks search on the 'search diagrams' popup
	$scope.searchArtifacts = function()
	{
		//the results will have a pageName (which must be unique across the system, and a library description which is the level 1, level 2, level 3 entry
		$scope.matchingArtifactsList = Artifact.searchArtifacts($scope.searchText);
    }

    //on the editConnector popup, when the user clicks on a diagram, this gets invoked
    $scope.setSelectedArtifact = function(row) {

        $scope.selectedArtifact = row;
    }

    //if the user links the artifact to a parent -this is called when the save button is pressed.
    $scope.setParentArtifact = function()
    {
        $scope.$apply(function () {
            $scope.currentArtifact.parentArtifact = $scope.selectedArtifact;
        });

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
                loadArtifacts(item.library1.libraryId);
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
            loadArtifacts(item.library2.libraryId);
            level2Clicked = true;
        }
    }

    function loadArtifacts(libraryId)
    {
        $scope.artifactsList = Artifact.loadArtifacts(libraryId);
    }


    //when the user right-clicks on a library entry to add a new artifact
    $scope.createNewArtifact = function(pLibraryId)
    {

        $scope.currentArtifact = initArtifact();
        $scope.currentArtifact.referenceArtifact.libraryId = pLibraryId;
        initLibraryLists($scope.currentArtifact.referenceArtifact.libraryId);
        $scope.loadTags();
        $scope.loadDocTypes();
        addEditArtifact.dialog("open");
    }

    //when the user right-clicks to edit an existing artifact
    //we need to move the artifact to currentArtifact so we can edit it
    $scope.setCurrentArtifact = function(artifactId) {

        $scope.currentArtifact = Artifact.getArtifactEntry(artifactId);

        initLibraryLists($scope.currentArtifact.referenceArtifact.libraryId);

        $scope.loadTags();
        $scope.loadDocTypes();

        addEditArtifact.dialog("open");

    }

    //use the incoming library id to set the the three library lists
    function initLibraryLists(pLibraryId)
    {
        $scope.selectedLibrary1 = null;
        $scope.selectedLibrary2 = null;
        $scope.selectedLibrary3 = null;

        var library1 = null;
        var library2 = null;
        var library3 = null;

        var libraryEntry = Library.getLibraryEntry(pLibraryId);

        if (libraryEntry.level == 3)
        {
            library3 = libraryEntry;
            library2 = Library.getLibraryEntry($scope.selectedLibrary3.parentLibraryId);
            library1 = Library.getLibraryEntry($scope.selectedLibrary2.parentLibraryId);
        } else if (libraryEntry.level == 2)
        {
            library2 = libraryEntry;
            library1 = Library.getLibraryEntry($scope.selectedLibrary2.parentLibraryId);
        } else
        {
            library1 = libraryEntry;
        }

        $scope.loadLibrary1List();
        $scope.selectedLibrary1 = library1;

        $scope.loadLibrary2List();
        $scope.selectedLibrary2 = library2;

        $scope.loadLibrary3List();
        $scope.selectedLibrary3 = library3;

    }

    function initArtifact()
    {
        var val =
        {referenceArtifact: {referenceArtifactId:$scope.generateId(),
                                                              documentTitle: "",
                                                              abbreviation: "",
                                                              detailedText: "",
                                                              lovDocumentType: "",
                                                              libraryId: -1,
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
        return val;
    }


    //called on popup load for the add/edit of the artifact
	$scope.loadLibrary1List = function()
	{
		$scope.library1List = [];
		$scope.library2List = [];
		$scope.library3List = [];
		$scope.artifactList = [];

		//set a default entry
		$scope.library1List.push({libraryId: -1, level: 1, description: '',
		                          abbreviation: "------------------------------", parentLibraryId : 0});
        $scope.library2List.push({libraryId: -1, level: 2, description: '',
                                  abbreviation: "------------------------------", parentLibraryId : 0});
        $scope.library3List.push({libraryId: -1, level: 3, description: '',
                                  abbreviation: "------------------------------", parentLibraryId : 0});

        var libraryEntries = Library.loadSubLibrary(0);
		$scope.library1List = $scope.library1List.concat(libraryEntries);

		$scope.selectedLibrary1 = $scope.library1List[0];
		$scope.selectedLibrary2 = $scope.library2List[0];
		$scope.selectedLibrary3 = $scope.library3List[0];
		$scope.selectedArtifact = $scope.artifactList[0];
	}

	//this would be called after the user has selected an entry in the library 1 list - the selected entry in library 1 drives what to put in library list 2
	$scope.loadLibrary2List = function()
	{
		$scope.library2List = [];
		//set a default entry
    	 $scope.library2List.push({libraryId: -1, level: 2, description: '',
                                          abbreviation: "------------------------------", parentLibraryId : 0});

		if ($scope.selectedLibrary1 != null)
		{
		    var libraryEntries = Library.loadSubLibrary($scope.selectedLibrary1.libraryId);
			$scope.library2List = $scope.library2List.concat(libraryEntries);

		}

		$scope.selectedLibrary2 = $scope.library2List[0];
		$scope.loadLibrary3List();
	}

	//this would be called after the user has selected an entry in the library 2 list - the selected entry in library 2 drives what to put in library list 3
	$scope.loadLibrary3List = function()
	{
		$scope.library3List = [];
		//set a default entry
		$scope.library3List.push({libraryId: -1, level: 3, description: '',
                                                  abbreviation: "------------------------------", parentLibraryId : 0});

		if ($scope.selectedLibrary2 != null)
		{
			 var libraryEntries = Library.loadSubLibrary($scope.selectedLibrary2.libraryId);
             $scope.library3List = $scope.library3List.concat(libraryEntries);

		}

		$scope.selectedLibrary3 = $scope.library3List[0];
	}

    $scope.saveArtifact = function()
    {
         //the library associated with an artifact is the lowest selected level
         if ($scope.selectedLibrary3 != null)
         {
            $scope.currentArtifact.referenceArtifact.libraryId = $scope.selectedLibrary3.libraryId;
         }
         else if ($scope.selectedLibrary2 != null)
         {
            $scope.currentArtifact.referenceArtifact.libraryId = $scope.selectedLibrary2.libraryId;
         }
         else
         {
           $scope.currentArtifact.referenceArtifact.libraryId = $scope.selectedLibrary1.libraryId;
         }

       Artifact.saveArtifact($scope.currentArtifact);
    }

    //called when the user clicks the 'add' button on the editShape popup for a new tag
	$scope.addTag = function()
	{
		if (($scope.selectedTagValue != null) && ($scope.selectedTagValue.tagId != null))
		{
			$scope.currentArtifact.referenceArtifact.tags.push($scope.selectedTagValue);
		}
	}

	//called when the user checks a checkbox in the list of existing tags to delete an entry
	$scope.deleteTag = function(tagRow)
	{
		for (var idx = 0; idx < $scope.currentArtifact.referenceArtifact.tags.length; idx++)
		{
			if (tagRow.tagId == $scope.currentArtifact.referenceArtifact.tags[idx].tagId )
			{
				$scope.currentArtifact.referenceArtifact.tags.splice(idx,1 );
				break;
			}
		}
	}

    $scope.loadLibrary();

}]);



