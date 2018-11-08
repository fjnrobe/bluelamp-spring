angular.module('bluelamp', [])
.controller('baseController', ['$scope', '$timeout', 'Library',
                                'Lov', 'Tag','Artifact',
                                function($scope, $timeout,
                                 Library, Lov, Tag, Artifact) {

    var uiPageDtoTemplate = { pageDto : {id: -1, pageTitle: 'new page',
                                        pageDescription: 'a description for the page',
                                        libraryId: 0, artifactId: 0,
   	                                    tagDtos: [], annotationDtos: []},
   	shapeDtos: [],
   	shapeRelationshipDtos: [],
   	predecessorPageDtos: []};

    $scope.editPropertyTitle = "";
    $scope.isArtifact = false;
    $scope.isShape = false;
    $scope.isPage = false;
    $scope.showCategoryFields = true;
    $scope.notALine = true;
    $scope.currentlySelectedLibraryId = null;   //this is the library entry that has been clicked on for view/expansion
    $scope.tagLibrary = []; //this will populate the dropdown of tag types
    $scope.docTypeList = [];
	$scope.currentPage = {};	//this is a reference to the uiPageDto for the page on the canvas

	$scope.tags = [];

    $scope.newTagTypeShortDesc = ""; //this is used when adding a new tag type
    $scope.newTagTypeLongDesc = ""; //this is used when adding a new tag type

	$scope.pageTitle = "";   //this is the bound field when editing a page
	$scope.pageDescription = ""; //this is the bound field when editing a page
	$scope.annotation = {}; //{id: $scope.generateId(), annotationText: "", sharedInd: false}
	$scope.annotations = [];    //this is the list that is bound to the page when editing

    $scope.libraryList = []; //this will initially be the level 1 library entries only. This is the
                             //list that the page binds to and maintains the library info and levels,

    $scope.selectedLibrary1 = {};
    $scope.library1List = [];

    $scope.selectedLibrary2 = {};
    $scope.library2List = [];

    $scope.selectedLibrary3 = {};
    $scope.library3List = [];

    $scope.selectedArtifact = {};
    $scope.artifactList = [];    //this will be loaded whenever user clicks on a library entry

    $scope.expandedLibraryItems = [];

    $scope.itemToHighLight = null;

    $scope.errors = [];      //any errors reported will be a list of ErrorDto
    $scope.popupErrors = [];

    //the following fields are for the artifactInfo.ftl popup
    $scope.currentArtifact = null;

    $scope.library1Description = "";
    $scope.library2Description = "";
    $scope.library3Description = "";

    //see UserSecurityDto
    $scope.userProfile = {};

    $scope.getUserProfile = function()
    {
        return $scope.userProfile;
    }

//    $scope.uiPageDto = document.getElementById("uiPageDto").innerHTML;
//    $scope.loadUserProfile = function()
//    {
//        Security.getCurrentUserProfile().then (function (response) {
//
//            if (response.status == "200")
//            {
//                $scope.userProfile = response.data;
//            }
//        });
//    }

    $scope.resetChangeTrigger = function()
    {
        $timeout(function(){
            $scope.changes = false;
        });
    }

    $scope.triggerChange = function()
    {
          $timeout(function(){
              $scope.changes = true;
          });
    }

    $scope.changeTriggered = function()
    {
          return $scope.changes;
    }

    $scope.navigateToPage = function(pageString)
    {
        window.location = pageString;
    }

    $scope.navigateToDiagram = function(pPageId)
    {
         window.location = "/canvas/page/" + pPageId;
    }

    //the addEditProperties popup is configured based on the type of object
    //being edited - options are "page" , "shape", or "artifact"
    $scope.setEditType = function(pObjectType) {
         $scope.isArtifact = false;
         $scope.isShape = false;
         $scope.isPage = false;
         $scope.notALine = true;
         $scope.showCategoryFields = true;

         if (pObjectType == "artifact")
         {
            $scope.isArtifact = true;
         }
         else if (pObjectType == "shape")
         {
            $scope.isShape = true;
         }
         else if (pObjectType == "page")
         {
            $scope.isPage = true;
         }
         else if (pObjectType == "line")
         {
            $scope.isShape = true;
            $scope.notAline = false;
         }
    }

    //function to make a copy of the incoming object
    $scope.clone = function(objectToClone)
    {
        return JSON.parse(JSON.stringify(objectToClone));
    }

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

//       //default the item to highlight to the currently highlighted item
//       if ($scope.currentlySelectedLibraryId != null)
//       {
//           $scope.itemToHighLight =  $scope.currentlySelectedLibraryId;
//       }
//
//       //remove the highlight from all library items - we'll reselect the highlighted
//       //item at the bottom of this method
//       $(".libraryItem").removeClass("selected");

        //we will return the selected library id
       var selectedLibrary = null;
       $scope.currentlySelectLibraryItem = this;


        if (item.library3 != null)
        {
            selectedLibrary = item.library3.id;
            item.library3.isSelected = true;
            level3Clicked = true;
        }
        else
           {

            //if there is no library2, then it means that the method is being called for a level 1 item
            if (item.library2 == null)
            {
                //but, if level2Clicked is true, it means this is just an outer-click of an
                //inner level 2 item click.
                if (!level2Clicked)
                {
                    item.library1.expanded = !item.library1.expanded;
                    selectedLibrary = item.library1.id;
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
                if (!level3Clicked)
                {
                    item.library2.expanded = !item.library2.expanded;
                    //if the item was expanded - we need to load the children
                    selectedLibrary = item.library2.id;

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
                else
                {
                    level3Clicked = false;
                    level2Clicked = true;
                }
            }
        }

        if (selectedLibrary != null)
        {
            itemToHighLight = selectedLibrary;
            $scope.currentlySelectedLibraryId = selectedLibrary;
        }

//        $("#"+ itemToHighLight).first().addClass("selected");
        angular.element("#" + itemToHighLight).addClass("selected");
        return $scope.currentlySelectedLibraryId;

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
     //   $scope.selectedArtifact = {};

		//set a default entry
		$scope.library1List.push({id: null, level: 0, description: " ",
		                          abbreviation: " ", parentLibraryId : 0});
        $scope.library2List.push({id: null, level: 1, description: " ",
                                  abbreviation: " ", parentLibraryId : 0});
        $scope.library3List.push({id: null, level: 2, description: " ",
                                  abbreviation: " ", parentLibraryId : 0});

       //all 0 level library entries have '-1' as the parent id
       Library.loadSubLibrary("-1").then(function(data)
       {
    		$scope.library1List = $scope.library1List.concat(data);
            if (pSelectedLibrary1 != null)
            {
                $scope.selectedLibrary1 = pSelectedLibrary1;
                Library.loadSubLibrary(pSelectedLibrary1.id).then(function(data)
                {
                    $scope.library2List = $scope.library2List.concat(data);
                    if (pSelectedLibrary2 != null)
                    {
                        $scope.selectedLibrary2 = pSelectedLibrary2;
                        Library.loadSubLibrary(pSelectedLibrary2.id).then (function (data)
                        {
                            $scope.library3List = $scope.library3List.concat(data);
                            if (pSelectedLibrary3 != null)
                            {
                                $scope.selectedLibrary3 = pSelectedLibrary3;
                                $scope.loadArtifactList(pSelectedLibrary3.id);
                            }
                            else
                            {
                                $scope.loadArtifactList(pSelectedLibrary2.id);
                                $scope.selectedLibrary3 = $scope.library3List[0];
                            }
                        })
                    }
                    else
                    {
                        $scope.loadArtifactList(pSelectedLibrary1.id);
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
                $scope.loadArtifactList(null);

            }
       });
	}

	//this would be called after the user has selected an entry in the library 1 list - the selected entry in library 1 drives what to put in library list 2
	$scope.loadLibrary2List = function()
	{
		$scope.library2List = [];
		//set a default entry
		$scope.library2List.push({id: null, level: 2, description: " ",
        		                          abbreviation: " ", parentLibraryId : 0});

		if ($scope.selectedLibrary1 != null)
		{
		    Library.loadSubLibrary($scope.selectedLibrary1.id).then(function(data)
            {
                 $scope.library2List = $scope.library2List.concat(data);
                 $scope.selectedLibrary2 = $scope.library2List[0];
                 $scope.loadArtifactList($scope.selectedLibrary1.id);
                 $scope.loadLibrary3List();
            })
		}
		else
		{
            $scope.selectedLibrary2 = $scope.library2List[0];
            $scope.loadLibrary3List();
            $scope.loadArtifactList(null);

        }
	}

	//this would be called after the user has selected an entry in the library 2 list - the selected entry in library 2 drives what to put in library list 3
	$scope.loadLibrary3List = function()
	{
		$scope.library3List = [];
		//set a default entry
		$scope.library3List.push({id: null, level: 2, description: " ",
		                          abbreviation: " ", parentLibraryId : 0});

		if ($scope.selectedLibrary2 != null)
		{
			  Library.loadSubLibrary($scope.selectedLibrary2.id).then(function(data)
              {
                 $scope.library3List = $scope.library3List.concat(data);
         		 $scope.selectedLibrary3 = $scope.library3List[0];
              });
              $scope.loadArtifactList($scope.selectedLibrary2.id);
		}
		else
		{
		    $scope.selectedLibrary3 = $scope.library3List[0];
            $scope.loadArtifactList(null);

		}
	}

    $scope.loadArtifactList = function(pSelectedLibraryId)
    {
        var libraryId = pSelectedLibraryId;
        $scope.artifactList = [];
        if (libraryId != null)
        {
            Artifact.loadArtifacts(libraryId).then(function (response) {
                if (response.status == "406")
                {
                    $scope.errors = response.data;
                }
                else
                {
                    $scope.artifactList = response.data;
                    $scope.selectedArtifact = $scope.currentShape.properties.artifact;
                }
            });
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

        if (pLibraryId != null)
        {
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
        else
        {
           $scope.loadLibrary1List(library1, library2, library3);
        }
    }

    //invoked when the add/edit artifact popup is displayed
    $scope.loadTags = function()
    {
        Lov.getLovByTable('Tag').then(function(lovTableEntries) {

           $scope.tagLibrary = lovTableEntries;
        });
    }

    //invoked when the add/edit artifact popup is displayed
    $scope.loadDocTypes = function()
    {
        $scope.docTypeList = [];

        $scope.docTypeList.push($scope.defaultDocType);

        Lov.getLovByTable('DocType').then(function(lovTableEntries) {

             $scope.docTypeList = $scope.docTypeList.concat(lovTableEntries);
        });
    }

    //creates a new UiPageDto
	 $scope.createNewUiPageDto = function()
	{
		var uiPageDto =  JSON.parse(JSON.stringify(uiPageDtoTemplate));
		uiPageDto.pageDto.id = $scope.generateId();

		return uiPageDto;
	}

    //pCurrentPage is a uiPageDto object
    $scope.setCurrentPage = function(pCurrentPage)
    {
            $scope.currentPage = pCurrentPage;
    }

    $scope.getCurrentPage = function()
    {
        return $scope.currentPage;
    }

    //this function is called when a user clicks to edit the page properties - it will bind the necessary parts of the pages's properties for page display
    //we don't want to bind directly to currentPage or there won't be a way to undo the changes - we want the user to click 'save' so the values get
    //propogated to the page
    $scope.setForPageEdit = function()
    {
        //force a refresh back to the html
        $scope.$apply(function () {

            $scope.errors = [];
            if ($scope.currentPage.pageDto.artifactId != null)
            {
                $scope.selectedArtifact.referenceArtifactId =
                $scope.currentPage.pageDto.artifactId
            }
            $scope.initLibraryLists( $scope.currentPage.pageDto.libraryId);
            $scope.annotation = {id: $scope.generateId(), annotationText: "", sharedInd: false};
            $scope.annotations = $scope.clone($scope.currentPage.pageDto.annotationDtos);
            $scope.tags = $scope.clone($scope.currentPage.pageDto.tagDtos);
            $scope.pageTitle = $scope.currentPage.pageDto.pageTitle;
            $scope.pageDescription = $scope.currentPage.pageDto.pageDescription;
            $scope.setEditType("page");
            $timeout(function(){
                $scope.editPropertyTitle = "Edit Page Properties";
            });

        });
    }

    //push the page changes to the currentPage Dto
	$scope.savePageEdits = function()
	{
	    //force a refresh back to the html
        //$scope.$apply(function () {

            $scope.triggerChange();
            $scope.currentPage.pageDto.pageTitle = $scope.pageTitle;
            $scope.currentPage.pageDto.pageDescription = $scope.pageDescription;
            $scope.currentPage.pageDto.tagDtos = $scope.tags;
            $scope.currentPage.pageDto.annotationDtos = $scope.annotations;

             //the library associated with an artifact is the lowest selected level
             if ($scope.selectedLibrary3.id != null)
             {
                $scope.currentPage.pageDto.libraryId = $scope.selectedLibrary3.id;
             }
             else if ($scope.selectedLibrary2.id != null)
             {
                $scope.currentPage.pageDto.libraryId = $scope.selectedLibrary2.id;
             }
             else
             {
               $scope.currentPage.pageDto.libraryId = $scope.selectedLibrary1.id;
             }

            if ($scope.selectedArtifact == null)
            {
                $scope.currentPage.pageDto.artifactId = -1;
            }
            else
            {
                $scope.currentPage.pageDto.artifactId = $scope.selectedArtifact.referenceArtifactId;
            }
       // });
	}

    //called when the user clicks the 'add' button on the edit artifact popup for a new annotation
	$scope.addAnnotation = function()
	{
		if ($scope.annotation.annotationText != null)
		{
		    $scope.annotation.id =  $scope.generateId();
			$scope.annotations.push($scope.annotation);
			$scope.annotation = {id: $scope.generateId(), annotationText: "", sharedInd: false};
		}
	}

	//called when the user checks a checkbox in the list of existing annotations
	$scope.deleteAnnotation = function(annotationRow)
	{
		for (var idx = 0; idx < $scope.annotations.length; idx++)
		{
			if (annotationRow == $scope.annotations[idx] )
			{
				$scope.annotations.splice(idx,1 );
				break;
			}
		}
	}

     //called when the user clicks the 'add' button on the editShape popup for a new tag
	$scope.addTag = function()
	{
		if (($scope.selectedTagType != null) && ($scope.selectedTagValue != null))
		{

		    var newTagDto = {id: $scope.generateId(), tagValue: $scope.selectedTagValue,
		        lovDto: $scope.selectedTagType, sharedInd: $scope.selectedTagShared};
			$scope.tags.push(newTagDto);

		    $scope.selectedTagType = {};
		    $scope.selectedTagValue = "";
		    $scope.selectedTagShared = false;
		}
	}

    //called when the user checks a checkbox in the list of existing tags to delete an entry
    $scope.deleteTag = function(tagRow)
    {
        for (var idx = 0; idx < $scope.tags.length; idx++)
        {
            if (tagRow.id == $scope.tags[idx].id )
            {
                $scope.tags.splice(idx,1 );
                break;
            }
        }
    }

    //invoked when the user clicks the 'tags' link on the artifact popup to add a new tag
    $scope.openNewTag = function()
    {
        $scope.popupErrors = [];
        $scope.newTagTypeShortDesc = "";
        $scope.newTagTypeLongDesc = "";
        addTagType.dialog("open");
    }

    //invoked when the user clicks save on the new tag type popup
    $scope.saveNewTag = function()
    {
        var lovDto = {id: $scope.generateId(),
                      lovTable : 'Tag',
                      shortName: $scope.newTagTypeShortDesc,
                      longName: $scope.newTagTypeLongDesc};

         //wrap in apply so it refreshes page
        $scope.$apply(function () {
            Tag.addTagType(lovDto ).then (function (response) {

                if (response.status == "406")
                {
                    $scope.popupErrors = response.data;
                }
                else
                {
                    $scope.tagLibrary.push(lovDto);
                    addTagType.dialog("close");
                }
            });
        })
    }

    $scope.showArtifact = function()
	{
	    if ($scope.selectedArtifact != null)
	    {
             Artifact.getArtifactEntry($scope.selectedArtifact.id).then (function (results)
             {
                    $scope.currentArtifact = results.data;

                    Library.getLibraryEntry($scope.currentArtifact.libraryId).then (function (data)
                    {

                        if (data.length == 1)
                        {
                            $scope.library1Description = data[0].description;
                        }
                        else if (data.length == 2)
                        {
                            $scope.library1Description = data[0].description;
                            $scope.library2Description = data[1].description;
                        }
                        else
                        {
                            $scope.library1Description = data[0].description;
                            $scope.library2Description = data[1].description;
                            $scope.library3Description = data[2].description;
                        }

                        artifactInfoDialog.dialog("open");
                    });
             });
	    }
	}

    angular.element(document).ready(function () {
            $scope.userProfile = JSON.parse(
            document.getElementById("userProfile").innerHTML);

    });

}]);



