angular.module('bluelamp' )
.controller('canvasController', [ '$q', '$scope',
                                            '$controller',
                                            'Library',
                                            'Artifact',
                                            'Tag',
                                            'Lov',
                                            'Diagram',
                                            function($q,
                                                    $scope, $controller, Library, Artifact, Tag, Lov, Diagram) {

    $scope.uiPageDto = {};
	$scope.pageTitle = "";
	$scope.pageDescription = "";

	$scope.selectedPredecessorPage; //this is set when a user chooses a page to nagivate to from the current page

	//reference to the array of shapes on the page
	$scope.pageShapes = [];
	
	$scope.currentShape;		//this gets set whenever the user right clicks on a shape to edit

	$scope.searchText = "";
	$scope.matchingDiagramsList = []; //loaded if the user wants to create a drill down on a shape and opts to search for an existing page
	$scope.selectedDiagram = "";		//set to the page id of the selected diagram when setting up a drill down
		
	//these will eventually come from a properties file - allows customization of the labels/names for the library levels
	$scope.library1Label = "Functional Area";
	$scope.library2Label = "Sub-Functional Area";
	$scope.library3Label = "Module";
	$scope.artifactLabel = "Artifact";

	$scope.pageBeingEdited = {};
	$scope.newPageAction = ""; //will be either 'promote' or 'drilldown'. gets set when the user choses to promote to a new page or drill down to a new page
	//page dto (UiPageDto) template
    $scope.nextPageId = "";
    $scope.pagesSaved = 0; //hack for now - when a drill down to new page is performed, the
    //new page as well as the current page (from which the drill down is occuring) are saved.
    //The saves are asynchronous so the order of the results of the save is unknown. if
    //there is an error in the saving of the new page data, we don't want to navigate to
    //the new page, we want the errors to be displayed. So - in the savePage method, if
    //both pages have been saved, then check to see if there are errors - if no errors
    //then navigate
	//the selected tag/value
	$scope.selectedTagType = {};
	$scope.selectedTagValue = "";

	//these gets set when the user right clicks to edit/delete/etc a shape - note: due to how the structure of the shape object is on the page, it can't be copied to a single object -
	//the shape object has a reference to itself in the properties property
	$scope.currentShapeSeqNumber = 0;
	$scope.currentShapeText = "";

	$scope.currentConnectingPage = "";

    //set a reference to the base controller
     $controller('baseController', { $scope: $scope });


    $scope.loadPage = function(pageId)
    {
       Diagram.loadPage(pageId).then (function (response)
       {
           if (response.status == "406")
           {
               $scope.errors = response.data;
           }
           else if (response.status == "201")
           {
               $scope.setCurrentPage(response.data);
               populatePage(response.data);
           }
       });

    }

    $scope.saveDrillDownPage = function(currentPageUiDto, newPageUiDto)
    {
        Diagram.saveDrillDownPage(newPageUiDto, currentPageUiDto ). then (function (response) {

            if (response.status == "201")
            {
                editPageDialog.dialog("close");

                $scope.navigateToDiagram(newPageUiDto.pageDto.id);

            }
            else
            {
                $scope.pageBeingEdited = JSON.parse(JSON.stringify($scope.currentPage));
                $scope.currentPage = JSON.parse(JSON.stringify(newPageUiDto));

                $scope.errors = response.data;
            }
        })
    }

    //persist the incoming page data. If there is a nextPageId, navigate to that
    //page upon save if no errors.
    $scope.savePage = function(uiPageDto)
    {
        Diagram.saveDiagram(uiPageDto).then (function (response) {

           if (response.status == "406")
           {
               $scope.errors = response.data;
           }
           else if (response.status == "201")
           {

           }
        });
    }



	//this function will reset the contents of the currentPage - all elements other than the pageDto
	$scope.initializePageDto = function()
	{
		$scope.currentPage.shapeDtos = [];
		$scope.currentPage.shapeRelationshipDtos = [];
		$scope.currentPage.predecessorPageDtos = [];
	}

	$scope.setPageShapes = function(pPageShapes)
	{
		$scope.pageShapes = pPageShapes;
	}
	
	$scope.getPageShapeIdx = function(pPageShape)
	{
		var idxVal = -1;
		for (var idx = 0; idx < pageShapes.length; idx++)
		{
			if ((pageShapes[idx] == pPageShape))
			{
				idxVal = idx;
				break;
			}	
		}
		
		return idxVal;
	}

    //when the user right-clicks a shape to create a drill down to a new page
    $scope.setupDrillDownToNewPage = function()
    {
//        copy the current page off to the side - so the popup for the new page can
//        reference the 'currentPage' scope attributes - when the page is saved, we'll
//        swap back
        $scope.pageBeingEdited = JSON.parse(JSON.stringify($scope.currentPage));
        $scope.setEditType("page");
        $scope.newPageAction = "drilldown";
        $scope.currentPage = $scope.createNewUiPageDto();
        $scope.initLibraryLists(null);
        $scope.annotations = [];
        $scope.errors = [];
        $scope.annotation = {id: $scope.generateId(), annotationText: ""};
        $scope.editPropertyTitle = "Create Diagram";
        editPageDialog.dialog("open");
    }


	//this function is called when a user right clicks to edit an artifact -
	//it will bind the necessary parts of the shape's properties for page display
	//we don't want to bind directly to the shape or there won't be a way to undo the changes
	//- we want the user to click 'save' so the values get
	//propogated to the shape object
	$scope.setCurrentShape = function(pCurrentShape)
	{
		 //force a refresh back to the html		 
		 $scope.$apply(function () {

            $scope.setEditType("shape");
			$scope.currentShape = pCurrentShape;
	
			$scope.tags = JSON.parse(JSON.stringify(pCurrentShape.properties.tags));
			$scope.annotation = {id: $scope.generateId(), annotationText: ""};
			$scope.annotations = JSON.parse(JSON.stringify(pCurrentShape.properties.annotations));
			
			if ($scope.currentShape.shape != "line")
			{
				$scope.currentShapeSeqNumber = JSON.parse(JSON.stringify(pCurrentShape.properties.sequenceNumber));
				$scope.notALine = true;
			}
			else
			{
				$scope.notALine = false;
			}
			
			$scope.currentShapeText = JSON.parse(JSON.stringify(pCurrentShape.properties.shapeText));
			
			//format text for display when deleting
			var shapeDesc = $scope.currentShape.shape;
			if (shapeDesc != 'line')
			{
				shapeDesc += "- sequence number: " + $scope.currentShapeSeqNumber;
			}
			$scope.shapeDescription = shapeDesc;

			$scope.selectedArtifact = pCurrentShape.properties.artifact;

            if ($scope.selectedArtifact != null)
            {
    			$scope.initLibraryLists($scope.selectedArtifact.libraryId);
    		}
    		else
    		{
    		    $scope.initLibraryLists(null);
    		}

        });
	}
	
	$scope.getCurrentShape = function()
	{
	
		return $scope.currentShape;
	}
		
	//helper function to find any entry in the library array  based on libraryId
	findLibraryEntry = function(pLibraryId)
	{
		var libraryEntry;
		for (var idx = 0; idx < $scope.libraryList.length; idx++)
		{
			if ($scope.libraryList[idx].libraryId == pLibraryId)
			{
				libraryEntry = $scope.libraryList[idx];
				break;
			}
		}
		
		return libraryEntry;
	}

	//whenever we add or edit a shape - we need to see if the user gave it a sequence other than the next value - if
	//so, we need to renumber the shapes
	$scope.resequence = function(pageShapes, currSeq, newSeq, currShapeIdx)
	{
		//if a shape is deleted, bump all shapes down by 1
		if (newSeq == -1)
		{
			for (var idx = 0; idx < pageShapes.length; idx++)
			{
			    if (!(pageShapes[idx].properties.sequenceNumber === "") )
			    {
                    if ((pageShapes[idx].properties.sequenceNumber >= currSeq))
                    {
                        pageShapes[idx].properties.sequenceNumber = pageShapes[idx].properties.sequenceNumber - 1;
                        pageShapes[idx].getElementAt(1).setText(pageShapes[idx].properties.sequenceNumber);
                    }
                }
			}		
		}
		//if the shape wasn't deleted, then all shapes with a seq number >= need to be bumped up by one , if the new seq number was already used
		else
		{
			var bumpUp = false;
			for (var idx = 0; idx < pageShapes.length; idx++)
			{
                if (!(pageShapes[idx].properties.sequenceNumber === "") )
                {

                    if ((pageShapes[idx].properties.sequenceNumber == newSeq) && (idx != currShapeIdx))
                    {
                        bumpUp = true;
                        break;
                    }
                }
			}
			if (bumpUp)
			{
				for (var idx = 0; idx < pageShapes.length; idx++)
				{
					if ((pageShapes[idx].properties.sequenceNumber >= newSeq) && (idx != currShapeIdx))
					{
						pageShapes[idx].properties.sequenceNumber = pageShapes[idx].properties.sequenceNumber + 1;
						pageShapes[idx].getElementAt(1).setText(pageShapes[idx].properties.sequenceNumber);
					}
				}
			}
		}		
		
		//now - if we ended up with the first shape seq number gone (ie, user resequenced shape #1 to #8) then 
		//we need to slide all shapes down by 1
		var slideDown = true;
		for (var idx = 0; idx < pageShapes.length; idx++)
		{
			if (pageShapes[idx].properties.sequenceNumber == 1)
			{
				slideDown = false;
				break;
			}
		}
		if (slideDown)
		{
			for (var idx = 0; idx < pageShapes.length; idx++)
			{
                if (!(pageShapes[idx].properties.sequenceNumber === "") )
                {

                    pageShapes[idx].properties.sequenceNumber = pageShapes[idx].properties.sequenceNumber - 1;
                    pageShapes[idx].getElementAt(1).setText(pageShapes[idx].properties.sequenceNumber);
                }
			}
		}	
	}

	//called when the user clicks save on the editshape popup - push the changes values onto the current change
	$scope.saveShape = function()
	{
		var postResequence = false;
		var currentSeq = -1;
		var newSeq = -1;
		
		$scope.currentShape.properties.tags = $scope.tags;
		$scope.currentShape.properties.annotations = $scope.annotations;
		
		//a change of sequence requires a renumbering of all greater sequence numbers on the page
		//if however, the sequence number is blank, then the shape won't be given a sequence number
		if ($scope.currentShape.properties.sequenceNumber != $scope.currentShapeSeqNumber)
		{
		    if (!($scope.currentShapeSeqNumber === "") )
		    {
    			currentSeq = $scope.currentShape.properties.sequenceNumber;
	    		newSeq = $scope.currentShapeSeqNumber;
		    	postResequence = true;
		    }
		}
		
		$scope.currentShape.properties.sequenceNumber = $scope.currentShapeSeqNumber;
		$scope.currentShape.getElementAt(1).setText($scope.currentShapeSeqNumber);
		$scope.currentShape.shapeHelper.setText($scope.currentShapeText);
		
		//if ($scope.selectedArtifact != null)
        //{
			$scope.currentShape.properties.artifact = $scope.selectedArtifact;
		//}
		
		////only an offpage connector will have a pageTitle 
		//if (($scope.currentShape.shape == "offConnector") || ($scope.currentShape.shape == "onConnector"))
		//{
	    //		$scope.currentShape.properties.pageTitle = $scope.currentConnectingPage;	
		//}
		
		//any final impacts to other shapes based on change of this shape are processed here
		if (postResequence)
		{
			$scope.resequence($scope.pageShapes, currentSeq, newSeq, $scope.getPageShapeIdx($scope.currentShape));
		}
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
	
	//when the user clicks save on the searchDiagram popup
	$scope.saveSelectedDiagram = function()
	{
		$scope.currentShape.properties.drillDownPageId = $scope.selectedDiagram.pageId;
		$scope.currentShape.properties.drillDownPageTitle = $scope.selectedDiagram.diagramTitle;

		//when a shape links to a drill down page, then there won't be any text - the title of the linked page takes precedence
		$scope.currentShape.shapeHelper.setText("");
	}


	 $scope.loadLibrary();
     $scope.loadTags();
     $scope.loadDocTypes();

	$scope.uiPageDto = document.getElementById("uiPageDto").innerHTML;
	$scope.currentPage = JSON.parse($scope.uiPageDto);

}]);