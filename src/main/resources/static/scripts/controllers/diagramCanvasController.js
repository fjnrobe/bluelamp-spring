angular.module('bluelamp' )
.controller('canvasController', [ '$q', '$scope', '$timeout',
                                            '$controller',
                                            'Library',
                                            'Artifact',
                                            'Tag',
                                            'Lov',
                                            'Diagram',
                                            function($q,
                                                    $scope, $timeout,
                                                    $controller,
                                                    Library,
                                                    Artifact,
                                                    Tag,
                                                    Lov,
                                                    Diagram) {

    $scope.emailRecipient = "";
    $scope.uiPageDto = {};
	$scope.pageTitle = "";
	$scope.pageDescription = "";

	$scope.selectedPredecessorPage; //this is set when a user chooses a page to nagivate to from the current page

	//reference to the array of shapes on the page
	$scope.pageShapes = [];
	
	$scope.currentShape;		//this gets set whenever the user right clicks on a shape to edit
    $scope.diagramSearchText = "";
	$scope.selectedDiagram = {}; //set to the page id of the selected diagram when setting up a drill down
	$scope.selectedDiagramId = "";
	$scope.diagramList = [];

	//these will eventually come from a properties file - allows customization of the labels/names for the library levels
	$scope.artifactGroupLabel = "Associated Artifact";
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
    $scope.changes = false;
    $scope.selectedShapeTemplate = {id: -1}; //shapeTemplateDto
    $scope.saveAsTemplate = false;
    $scope.saveTemplateName = "";
    $scope.showSaveAsTemplate = false;
    $scope.showSharedCheckbox = false;
    $scope.shapeTemplates = []; //array of shapeTemplateDto

    //set a reference to the base controller
     $controller('baseController', { $scope: $scope });

    $scope.navigateToPredecessorPage = function()
    {
        $scope.navigateToDiagram($scope.selectedPredecessorPage.id);
    }

    $scope.loadPage = function(pageId)
    {
       Diagram.loadPage(pageId).then (function (response)
       {
           if (response.status == "406")
           {
               $scope.errors = response.data;
           }
           else if (response.status == "200")
           {
               $scope.setCurrentPage(response.data);
               populatePage(response.data);
           }
       });

    }

    $scope.saveDrillDownPage = function(currentPageUiDto, newPageUiDto)
    {
        Diagram.saveDrillDownPage(currentPageUiDto,newPageUiDto). then (function (response) {

            if (response.status == "201")
            {
                editPageDialog.dialog("close");

                $scope.navigateToDiagram(newPageUiDto.pageDto.id);

            }
            else
            {
                $scope.pageBeingEdited = $scope.clone($scope.currentPage);
                $scope.currentPage = $scope.clone(newPageUiDto);

                $scope.errors = response.data;
            }
        })
    }

    //persist the incoming page data.
    $scope.savePage = function(uiPageDto)
    {
        Diagram.saveDiagram(uiPageDto).then (function (response) {

           if (response.status == "406")
           {
               $scope.errors = response.data;
           }
           else if (response.status == "201")
           {
              $scope.changes = false;
           }
        });
    }

    //persist the incoming shape template
    $scope.saveTemplate = function(shapeTemplateDto)
    {
        Diagram.saveTemplate(shapeTemplateDto).then (function (response) {
            if (response.status == "406")
            {
                $scope.errors = response.data;
            }
            //good save
            else if (response.status == "201")
            {
                $scope.loadShapeTemplates();
                //stamp the templateId on the shape that was saved to create the template
                $scope.currentShape.properties.templateId = shapeTemplateDto.id;
                var fillInfo = new jsgl.fill.SolidFill('grey', .07, true);
                $scope.currentShape.getElementAt(0).setFill(fillInfo);

                $scope.saveTemplateName = "";
                $scope.saveAsTemplate = false;

                editShapeDialog.dialog("close");
            }
        });
    }

	//this function will reset the contents of the currentPage - all elements other than the pageDto
	$scope.initializePageDto = function()
	{
		$scope.currentPage.shapeDtos = [];
		$scope.currentPage.shapeRelationshipDtos = [];
	//	$scope.currentPage.predecessorPageDtos = [];
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

        $scope.pageBeingEdited = $scope.clone($scope.currentPage);

        $scope.setEditType("page");
        $scope.newPageAction = "drilldown";
        $scope.currentPage = $scope.createNewUiPageDto();
        $scope.pageTitle = "";
        $scope.pageDescription = "";
        $scope.initLibraryLists(null);
        $scope.annotations = [];
        $scope.errors = [];
        $scope.annotation = {id: $scope.generateId(), annotationText: ""};

        editPageDialog.dialog("open");
        $timeout(function () {
            $scope.editPropertyTitle = "Create Diagram";
        });
    }

    //when the user right-clicks a shape to create a drill down to an existing page
    $scope.setupDrillDownToExistingPage = function(pCurrentShape)
    {
//        copy the current page off to the side - so the popup for the new page can
//        reference the 'currentPage' scope attributes - when the page is saved, we'll
//        swap back

        $scope.initLibraryLists(null);
        $scope.diagramList = [];
      	$scope.selectedDiagram = {};
       	$scope.selectedDiagramId = "";
        $scope.currentShape = pCurrentShape;
        $scope.errors = [];

        searchDiagramDialog.dialog("open");
    }

    //when the user right clicks on a group select and chooses to promote to a new page
    $scope.setupPromoteToNewPage = function()
    {
//        copy the current page off to the side - so the popup for the new page can
//        reference the 'currentPage' scope attributes - when the page is saved, we'll
//        swap back
        $scope.pageBeingEdited = $scope.clone($scope.currentPage);
        $scope.setEditType("page");
        $scope.newPageAction = "promote";
        $scope.currentPage = $scope.createNewUiPageDto();
        $scope.initLibraryLists(null);
        $scope.annotations = [];
        $scope.errors = [];
        $scope.annotation = {id: $scope.generateId(), annotationText: ""};
        $scope.editPropertyTitle = "Create Diagram";
        editPageDialog.dialog("open");
    }

	//this function is called when a user right clicks to edit a shape
	//it will bind the necessary parts of the shape's properties for page display
	//we don't want to bind directly to the shape or there won't be a way to undo the changes
	//- we want the user to click 'save' so the values get
	//propogated to the shape object
	$scope.setCurrentShape = function(pCurrentShape)
	{
		 //force a refresh back to the html		 
		 $scope.$apply(function () {

            $scope.errors = [];
            $scope.setEditType("shape");
			$scope.currentShape = pCurrentShape;
	
			$scope.tags = $scope.clone(pCurrentShape.properties.tags);
			$scope.annotation = {id: $scope.generateId(), annotationText: ""};
			$scope.annotations = $scope.clone(pCurrentShape.properties.annotations);
			
			if ($scope.currentShape.shape != "line")
			{
				$scope.currentShapeSeqNumber = $scope.clone(pCurrentShape.properties.sequenceNumber);
			}

            if (($scope.currentShape.shape == "onConnector") || ($scope.currentShape.shape == "offConnector"))
            {
			    $scope.showCategoryFields = false;
            }

			$scope.currentShapeText = $scope.clone(pCurrentShape.properties.shapeText);

			$scope.selectedArtifact = pCurrentShape.properties.artifact;

            if ($scope.selectedArtifact != null)
            {
    			$scope.initLibraryLists($scope.selectedArtifact.libraryId);
    		}
    		else
    		{
    		    $scope.initLibraryLists(null);
    		}

    		 if ($scope.userProfile.editor == false)
             {
                angular.element('.ui-dialog-buttonpane').find('button:first').css('visibility','hidden');
             }

             if ($scope.getUserProfile().editor)
             {
                 if (pCurrentShape.properties.templateId == null)
                 {
                    $scope.saveAsTemplate = false;
                    $scope.saveTemplateName = "";
                    $scope.showSaveAsTemplate = true;
                    $scope.showSharedCheckbox = false;
                 }
                 else
                 {
                    $scope.showSaveAsTemplate = false;
                    $scope.showSharedCheckbox = true;

                    for (var tIdx = 0; tIdx < $scope.shapeTemplates.length; tIdx++)
                    {
                        if ($scope.shapeTemplates[tIdx].id == pCurrentShape.properties.templateId)
                        {
                            $scope.saveTemplateName = $scope.shapeTemplates[tIdx].templateName;
                        }
                    }
                 }
             }
             else
             {
                $scope.showSharedCheckbox = false;
                $scope.showSaveAsTemplate = false;
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
                    if ((parseInt(pageShapes[idx].properties.sequenceNumber) >= parseInt(currSeq)))
                    {
                        pageShapes[idx].properties.sequenceNumber = parseInt(pageShapes[idx].properties.sequenceNumber) - 1;
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

                    if ((parseInt(pageShapes[idx].properties.sequenceNumber) == parseInt(newSeq)) && (idx != currShapeIdx))
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
					if ((parseInt(pageShapes[idx].properties.sequenceNumber) >= parseInt(newSeq)) && (idx != currShapeIdx))
					{
						pageShapes[idx].properties.sequenceNumber = parseInt(pageShapes[idx].properties.sequenceNumber) + 1;
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
			if (parseInt(pageShapes[idx].properties.sequenceNumber) == 1)
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

                    pageShapes[idx].properties.sequenceNumber = parseInt(pageShapes[idx].properties.sequenceNumber) - 1;
                    pageShapes[idx].getElementAt(1).setText(pageShapes[idx].properties.sequenceNumber);
                }
			}
		}	
	}

    //called when the user clicks to save a shape as a template
    $scope.saveShapeAsTemplate = function()
    {
         //now create a new shapeTemplateDto and persist
        var newTemplateDto = {id: $scope.generateId(),
                              templateName: $scope.saveTemplateName,
                               referenceArtifactDto : $scope.selectedArtifact,
                               shapeType: $scope.currentShape.shape,
                               shapeText: $scope.currentShapeText,
                               drillDownPageId: -1,
                               tagDtos: $scope.tags,
                               annotationDtos: $scope.annotations};

         $scope.saveTemplate(newTemplateDto);
    }

	//called when the user clicks save on the editshape popup - push the changed values onto the current change
	$scope.saveShape = function()
	{
		var postResequence = false;
		var currentSeq = -1;
		var newSeq = -1;

		$scope.triggerChange();
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
		//$scope.currentShape.getElementAt(1).setText($scope.currentShapeSeqNumber);
		$scope.currentShape.shapeHelper.clearShape();
		$scope.currentShape.shapeHelper.addSequence();
		if ($scope.currentShape.shape != "line")
		{
    		$scope.currentShape.shapeHelper.addCommentGlyph();
    	}
		$scope.currentShape.shapeHelper.setText($scope.currentShapeText);
		
		$scope.currentShape.properties.artifact = $scope.selectedArtifact;

		//any final impacts to other shapes based on change of this shape are processed here
		if (postResequence)
		{
			$scope.resequence($scope.pageShapes, currentSeq, newSeq, $scope.getPageShapeIdx($scope.currentShape));
		}

		//if the user wants to save this shape as a template - persist the template
		if (($scope.saveTemplateName != "") && ($scope.saveAsTemplate))
		{
    		$scope.saveShapeAsTemplate();
		}
		else
		{
		    //if this is a shared shape, we need to push the changes to another other shape
		    //on the page that might be using the same template
		    if ($scope.currentShape.properties.templateId != null)
		    {
		        $scope.pushSharedPropertiesToOtherShapes();
		    }
		    editShapeDialog.dialog("close");
		}
	}

    //when a shape is saved - if it is a shared shape, look to see if there are
    //any other similar shapes of the same template and update template shared values

    $scope.pushSharedPropertiesToOtherShapes = function()
    {
        for (var idx = 0; idx < pageShapes.length; idx++)
        {
            if (pageShapes[idx].id != $scope.currentShape.id)
            {
                if (pageShapes[idx].properties.templateId == $scope.currentShape.properties.templateId)
                {
                    //remove all the shared tags and then add in from the updated tag list
                    for (var tagIdx = pageShapes[idx].properties.tags.length -1; tagIdx > -1; tagIdx--)
                    {
                        if (pageShapes[idx].properties.tags[tagIdx].sharedInd == true)
                        {
                            pageShapes[idx].properties.tags.splice(tagIdx,1);
                        }
                    }
                    for (var tagIdx = 0; tagIdx < $scope.tags.length; tagIdx++ )
                    {
                        if ($scope.tags[tagIdx].sharedInd == true)
                        {
                            pageShapes[idx].properties.tags.push(JSON.parse(JSON.stringify($scope.tags[tagIdx])))
                        }
                    }

                    //remove all the shared annotations and then add in from the updated list
                    for (var tagIdx = pageShapes[idx].properties.annotations.length -1; tagIdx > -1; tagIdx--)
                    {
                        if (pageShapes[idx].properties.annotations[tagIdx].sharedInd == true)
                        {
                            pageShapes[idx].properties.annotations.splice(tagIdx,1);
                        }
                    }
                    for (var tagIdx = 0; tagIdx < $scope.annotations.length; tagIdx++ )
                    {
                        if ($scope.annotations[tagIdx].sharedInd == true)
                        {
                            pageShapes[idx].properties.annotations.push(JSON.parse(JSON.stringify($scope.annotations[tagIdx])))
                        }
                    }

                    pageShapes[idx].shapeHelper.clearShape();
                    pageShapes[idx].shapeHelper.addSequence();
                    pageShapes[idx].shapeHelper.addCommentGlyph();
                    pageShapes[idx].shapeHelper.setText($scope.currentShapeText);
                    pageShapes[idx].properties.artifact = $scope.selectedArtifact;
                }
            }
        }
    }

	//on the editConnector popup, when the user clicks on a diagram, this gets invoked
	$scope.setSelectedDiagram = function(row) {
		
        $scope.selectedDiagram = row;
	}
	
	//when the user clicks save on the searchDiagram popup
	$scope.saveSelectedDiagram = function()
	{
		$scope.currentShape.properties.drillDownPageId = $scope.selectedDiagram.id;
		$scope.currentShape.shapeHelper.setText($scope.currentShape.properties.shapeText);
		$scope.changes = true;
	}

    //when the user selects an entry in the 1st library list on the diagram search popup
    $scope.loadSearchLibrary2List = function()
    {
        $scope.loadLibrary2List();
        $scope.loadDiagramList($scope.selectedLibrary1.id);
    }

    //when the user selects an entry in the 2nd library list on the diagram search popup
    $scope.loadSearchLibrary3List = function()
    {
        $scope.loadLibrary3List();
        $scope.loadDiagramList($scope.selectedLibrary2.id);
    }

    //in the diagram search popup - when a library entry is selected, the diagrams associated with
    //the library are loaded
    $scope.loadDiagramList = function(libraryId)
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

    $scope.deleteDiagram = function()
    {
         Diagram.deleteDiagram($scope.currentPage.pageDto.id).then(function (response) {
            if (response.status == "200")
            {
                $scope.navigateToPage("/diagramHome");
            }
            else
            {
                $scope.errors = response.data;
            }
         });
    }

    $scope.shareDiagram = function()
    {
        Diagram.shareDiagram($scope.currentPage.pageDto.id, $scope.emailRecipient).then (function (response) {

            if (response.status == "200")
            {
                sendEmailDialog.dialog("close");
            }
            else
            {
                $scope.popupErrors = response.data;
            }
        });
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

    $scope.loadShapeTemplates = function()
    {
        $scope.shapeTemplates = [{id: -1,
                                  templateName: "",
                                  referenceArtifactDto: {},
                                  shapeType: "",
                                  shapeText: "",
                                  drillDownPageId: -1,
                                  tagDtos: [],
                                  annotationDtos: []}];

        Diagram.loadShapeTemplates().then (function (response) {
            if (response.status == "406")
            {
            }
            else
            {
                $scope.shapeTemplates =
                $scope.shapeTemplates.concat(response.data);
            }
        });
    }

	$scope.loadLibrary();
    $scope.loadTags();
    $scope.loadDocTypes();
    $scope.loadShapeTemplates();

	$scope.uiPageDto = document.getElementById("uiPageDto").innerHTML;
	$scope.setCurrentPage (JSON.parse($scope.uiPageDto));
    var xx = $scope.currentPage.predecessorPageDtos.length;

}]);