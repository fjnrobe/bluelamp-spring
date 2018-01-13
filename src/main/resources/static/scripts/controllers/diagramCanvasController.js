angular.module('bluelamp', [])
.controller('canvasController', [ '$q', '$scope',
                                            '$controller',
                                            'Library',
                                            'Artifact',
                                            'Tag',
                                            'Lov', function($q,
                                                    $scope, $controller, Library, Artifact, Tag, Lov) {


	$scope.pageTitle = "";
	$scope.pageDescription = "";

	$scope.currentPage = {};	//this is a reference to the uiPageDto for the page on the canvas
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
	
	$scope.newPageAction = ""; //will be either 'promote' or 'drilldown'. gets set when the user choses to promote to a new page or drill down to a new page
	//page dto (UiPageDto) template
	 var pageDtoTemplate = { pageDto : {pageId: -1, pageTitle: 'new page', pageDescription: 'a description for the page', library: 0, tags: [], annotations: []},
	 shapes: [],
	 referenceArtifact: {},
	 connections: [],
	 predecessorPages: []};
	//the selected tag/value
	$scope.selectedTagType = {};
	$scope.selectedTagValue = {};
	//this will be bound to the tag values - and is set when the user selects a tag type
	$scope.tagValues = [];
	$scope.artifactList = [];

	$scope.selectedLibrary1 = {};
	$scope.library1List = [];

	$scope.selectedLibrary2 = {};
	$scope.library2List = [];

	$scope.selectedLibrary3 = {};
	$scope.library3List = [];

	$scope.selectedArtifact = {};

	//these gets set when the user right clicks to edit/delete/etc a shape - note: due to how the structure of the shape object is on the page, it can't be copied to a single object -
	//the shape object has a reference to itself in the properties property
	$scope.currentShapeTags = [];
	$scope.currentShapeSeqNumber = 0;
	$scope.currentShapeText = "";
	$scope.currentShapeAnnotation = "";
	$scope.currentShapeAnnotations = [];

	$scope.currentConnectingPage = "";

	 //set a reference to the base controller
     $controller('baseController', { $scope: $scope });

	//creates a new UiPageDto
	 $scope.createNewPageDto = function()
	{
		var uiPageDto =  JSON.parse(JSON.stringify(pageDtoTemplate));
		uiPageDto.pageDto.pageId = $scope.generateId();
		
		return uiPageDto;
	}

	//this function will reset the contents of the currentPage - all elements other than the pageDto
	$scope.initializePageDto = function()
	{
		$scope.currentPage.shapes = [];
		$scope.currentPage.referenceArtifact = {};
		$scope.currentPage.connections = [];
		//$scope.currentPage.predecessorPages = [];
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

	$scope.loadArtifactList();

	//this would be called after the user has selected an entry in the library 3 list - the selected entry in library 3 drives what to put in artifact
	$scope.loadArtifactList = function()
	{
		$scope.artifactList = [];
		$scope.artifactList.push({referenceArtifactId: -1, documentTitle: "------------------------------", abbreviation: "------------------------------", libraryId: -1});
		
		if ($scope.selectedLibrary3 != null)
		{
			//also load any artifacts linked directly to this library entry		
			for (var idx1=0; idx1 < $scope.artifactListLibrary.length; idx1++)
			{
				if ($scope.artifactListLibrary[idx1].libraryId == $scope.selectedLibrary3.libraryId)
				{
					$scope.artifactList.push($scope.artifactListLibrary[idx1]);				
				}			
			}
		}
		
		$scope.selectedArtifact = $scope.artifactList[0];
		
	}
	
	//pCurrentPage is a uiPageDto object
	$scope.setCurrentPage = function(pCurrentPage)
	{
		$scope.$apply(function () {
			$scope.currentPage = pCurrentPage;
		});
	}

	//this function is called when a user clicks to edit the page properties - it will bind the necessary parts of the pages's properties for page display
	//we don't want to bind directly to currentPage or there won't be a way to undo the changes - we want the user to click 'save' so the values get
	//propogated to the page
	$scope.setForPageEdit = function()
	{
		//force a refresh back to the html		 
		$scope.$apply(function () {

			$scope.currentShapeTags = JSON.parse(JSON.stringify($scope.currentPage.pageDto.tags));
			$scope.currentShapeAnnotation = "";
			$scope.currentShapeAnnotations = JSON.parse(JSON.stringify($scope.currentPage.pageDto.annotations));
			
			//clear all all selections
			$scope.selectedLibrary1 = null;
			$scope.selectedLibrary2 = null;
			$scope.selectedLibrary3 = null;
			$scope.selectedArtifact = null;
			var library1 = null;
			var library2 = null;
			var library3 = null;
			var artifact = null;
			
			//clear the lists - but load the first library level
			$scope.loadLibrary1List();
			
			//this is tricky - we have the artifact id - but we want to default the (up to) 3 library levels for the dropdowns
			if ($scope.currentPage.pageDto.artifactId > -1) 
			{
				for (var idx = 0; idx < $scope.artifactListLibrary.length; idx++)
				{
					if ($scope.artifactListLibrary[idx].referenceArtifactId == $scope.currentPage.pageDto.artifactId )
					{
						artifact = $scope.artifactListLibrary[idx];					
						break;
					}
				}
				//get the library entry for the artifact
				var libraryEntry = findLibraryEntry(artifact.libraryId);
				
				if (libraryEntry != null)
				{
					if (libraryEntry.level == 3)
					{
						library3 = libraryEntry;
						library2 = findLibraryEntry(library3.parentLibraryId);
						library1 = findLibraryEntry(library2.parentLibraryId);

						$scope.selectedLibrary1 = library1;						

						$scope.loadLibrary2List();
						$scope.selectedLibrary2 = library2;

						$scope.loadLibrary3List();
						$scope.selectedLibrary3 = library3;

						$scope.loadArtifactList();
						$scope.selectedArtifact = artifact;
					}
					else if (libraryEntry.level == 2)
					{
						library2 = libraryEntry;
						library1 = findLibraryEntry(library2.parentLibraryId);
					
						$scope.selectedLibrary1 = library1;
						
						$scope.loadLibrary2List();
						$scope.selectedLibrary2 = library2;
						
						$scope.loadArtifactList();
						$scope.selectedArtifact = artifact;
					} 
					else
					{
						$scope.selectedLibrary1 = libraryEntry;
							
					}
				}
			}
		});
	}

	//this function is called when a user right clicks to edit an artifact - it will bind the necessary parts of the shape's properties for page display
	//we don't want to bind directly to the artifact or there won't be a way to undo the changes - we want the user to click 'save' so the values get
	//propogated to the shape object
	$scope.setCurrentShape = function(pCurrentPage)
	{
		 //force a refresh back to the html		 
		 $scope.$apply(function () {
          
			$scope.currentShape = pCurrentShape;
	
			$scope.currentShapeTags = JSON.parse(JSON.stringify(pCurrentShape.properties.tags));
			$scope.currentShapeAnnotation = "";
			$scope.currentShapeAnnotations = JSON.parse(JSON.stringify(pCurrentShape.properties.annotations));
			
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
			
			//clear all all selections
			$scope.selectedLibrary1 = null;
			$scope.selectedLibrary2 = null;
			$scope.selectedLibrary3 = null;
			$scope.selectedArtifact = null;
			var library1 = null;
			var library2 = null;
			var library3 = null;
			var artifact = null;
			
			//clear the lists - but load the first library level
			$scope.loadLibrary1List();
			
			//this is tricky - we have the artifact id - but we want to default the (up to) 3 library levels for the dropdowns
			if (pCurrentShape.properties.artifactId > -1) 
			{
				for (var idx = 0; idx < $scope.artifactListLibrary.length; idx++)
				{
					if ($scope.artifactListLibrary[idx].referenceArtifactId == pCurrentShape.properties.artifactId )
					{
						artifact = $scope.artifactListLibrary[idx];					
						break;
					}
				}
				//get the library entry for the artifact
				var libraryEntry = findLibraryEntry(artifact.libraryId);
				
				if (libraryEntry != null)
				{
					if (libraryEntry.level == 3)
					{
						library3 = libraryEntry;
						library2 = findLibraryEntry(library3.parentLibraryId);
						library1 = findLibraryEntry(library2.parentLibraryId);

						$scope.selectedLibrary1 = library1;						

						$scope.loadLibrary2List();
						$scope.selectedLibrary2 = library2;

						$scope.loadLibrary3List();
						$scope.selectedLibrary3 = library3;

						$scope.loadArtifactList();
						$scope.selectedArtifact = artifact;
					}
					else if (libraryEntry.level == 2)
					{
						library2 = libraryEntry;
						library1 = findLibraryEntry(library2.parentLibraryId);
					
						$scope.selectedLibrary1 = library1;
						
						$scope.loadLibrary2List();
						$scope.selectedLibrary2 = library2;
						
						$scope.loadArtifactList();
						$scope.selectedArtifact = artifact;
					} 
					else
					{
						$scope.selectedLibrary1 = libraryEntry;
							
					}
				}
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
	
//	$scope.loadTagValues = function()
//	{
//		$scope.tagValues = [];
//		for (var idx = 0; idx < $scope.tagValueLibrary.length; idx++)
//		{
//			if ($scope.tagValueLibrary[idx].lovTagType == $scope.selectedTagType.shortName)
//			{
//				$scope.tagValues.push($scope.tagValueLibrary[idx]);
//			}
//		}
//	}
	
	//called when the user clicks the 'add' button on the editShape popup for a new tag
	$scope.addTag = function()
	{		
		if (($scope.selectedTagValue != null) && ($scope.selectedTagValue.tagValue != null))
		{
			$scope.currentShapeTags.push($scope.selectedTagValue);	
		}
	}
	
	
	//called when the user checks a checkbox in the list of existing tags to delete an entry
	$scope.deleteTag = function(tagRow)
	{
		for (var idx = 0; idx < $scope.currentShapeTags.length; idx++)
		{
			if ((tagRow.lovTagType == $scope.currentShapeTags[idx].lovTagType ) &&
			     (tagRow.tagValue == $scope.currentShapeTags[idx].tagValue ))
			{
				$scope.currentShapeTags.splice(idx,1 );
				break;
			}	 
		}
	}
	
	//called when the user clicks the 'add' button on the editShape popup for a new annotation
	$scope.addAnnotation = function()
	{
		if ($scope.currentShapeAnnotation != null)
		{
			$scope.currentShapeAnnotations.push($scope.currentShapeAnnotation);
			$scope.currentShapeAnnotation = "";
		}		
	}
	
	//called when the user checks a checkbox in the list of existing annotations
	$scope.deleteAnnotation = function(annotationRow)
	{
		for (var idx = 0; idx < $scope.currentShapeAnnotations.length; idx++)
		{
			if (annotationRow == $scope.currentShapeAnnotations[idx] )
			{
				$scope.currentShapeAnnotations.splice(idx,1 );
				break;
			}	 
		}
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
				if ((pageShapes[idx].properties.sequenceNumber >= currSeq))
				{
					pageShapes[idx].properties.sequenceNumber = pageShapes[idx].properties.sequenceNumber - 1;
					pageShapes[idx].getElementAt(1).setText(pageShapes[idx].properties.sequenceNumber);
				}
			}		
		}
		//if the shape wasn't deleted, then all shapes with a seq number >= need to be bumped up by one , if the new seq number was already used
		else
		{
			var bumpUp = false;
			for (var idx = 0; idx < pageShapes.length; idx++)
			{
				if ((pageShapes[idx].properties.sequenceNumber == newSeq) && (idx != currShapeIdx))
				{
					bumpUp = true;
					break;
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
				pageShapes[idx].properties.sequenceNumber = pageShapes[idx].properties.sequenceNumber - 1;
				pageShapes[idx].getElementAt(1).setText(pageShapes[idx].properties.sequenceNumber);
			}	
		}	
	}
	
	//called when the user clicks save on the edit page popup - push the changes values onto the current page
	$scope.savePageEdits = function()
	{
		
		$scope.currentPage.pageDto.tags = $scope.currentShapeTags;
		$scope.currentPage.pageDto.annotations = $scope.currentShapeAnnotations;
		
		if ($scope.selectedArtifact == null)
		{
			$scope.currentPage.pagedDto.artifactId = -1;
		}
		else
		{
			$scope.currentPage.pageDto.artifactId = $scope.selectedArtifact.referenceArtifactId;
		}
	}

	//called when the user clicks save on the editshape popup - push the changes values onto the current change
	$scope.saveShape = function()
	{
		var postResequence = false;
		var currentSeq = -1;
		var newSeq = -1;
		
		$scope.currentShape.properties.tags = $scope.currentShapeTags;
		$scope.currentShape.properties.annotations = $scope.currentShapeAnnotations;
		
		//a change of sequence requires a renumbering of all greater sequence numbers on the page
		if ($scope.currentShape.properties.sequenceNumber != $scope.currentShapeSeqNumber)
		{
			currentSeq = $scope.currentShape.properties.sequenceNumber;
			newSeq = $scope.currentShapeSeqNumber;
			postResequence = true;
		}
		
		$scope.currentShape.properties.sequenceNumber = $scope.currentShapeSeqNumber;
		$scope.currentShape.getElementAt(1).setText($scope.currentShapeSeqNumber);
		$scope.currentShape.shapeHelper.setText($scope.currentShapeText);
		
		if ($scope.selectedArtifact == null)
		{
			$scope.currentShape.properties.artifactId = -1;
		}
		else
		{
			$scope.currentShape.properties.artifactId = $scope.selectedArtifact.referenceArtifactId;
		}
		
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

	//on page startup/ testing only - create a new page
	var newPageDto = $scope.createNewPageDto();
	$scope.currentPage = newPageDto;

}]);