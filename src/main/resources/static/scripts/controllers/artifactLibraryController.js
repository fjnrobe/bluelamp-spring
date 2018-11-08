angular.module('bluelamp')
.controller('artifactLibraryController', [ '$q', '$scope', '$timeout',
                                            '$controller',
                                            'Library',
                                            'Artifact',
                                            'Tag',
                                            'Lov', function($q,
                                                    $scope, $timeout, $controller, Library, Artifact, Tag, Lov) {

    $scope.currentlySelectedLibraryId = null;
    $scope.artifactSearchText = "";
    $scope.artifactFilterCriteria = "";
	$scope.selectedArtifact = "";		//set to the page id of the selected diagram when setting up a drill down

    $scope.currentArtifact = {} //the artifact being added/edited. - artifactDto
    $scope.defaultDocType = {id:"-1",
                                 lovTable: "DocType",
                                 shortName: "select document type",
                                 longName: "select document type"};

    $scope.parentArtifact = {}; //if a parent artifact is set when creating a new artifact
    $scope.artifactGroupLabel = "Categorize";
    $scope.currentTags = [];
    //the selected tag/value
    $scope.selectedTagType = {};
    $scope.selectedTagValue = "";

    $scope.newDocTypeShortDesc = ""; //this is used when adding a new document type
    $scope.newDocTypeLongDesc = ""; //this is used when adding a new document type

    $scope.showDocumentUpload = false;  //determines whether the file upload button should
                                        //be displayed - for a new artifact or when
                                        //changing a document on an existing artifact
    $scope.popupErrors = [];

    //set a reference to the base controller
    $controller('baseController', { $scope: $scope });

    $scope.setShowDocumentUpload = function(showIt)
    {
        $scope.showDocumentUpload = showIt;
    }

    //invoked when the user clicks on a library level
    $scope.showHideArtifacts  = function(item)
    {
         //expand/collapse the library catalog
        var selectedLibraryId = $scope.showHide(item);

        if (selectedLibraryId != null)
        {
            $scope.currentlySelectedLibraryId = selectedLibraryId;

            if (item.library3 != null)
            {
                $scope.artifactFilterCriteria = "library: (" + item.library3.description + ")";
            }
            else if (item.library2 != null)
            {
                $scope.artifactFilterCriteria = "library: (" + item.library2.description + ")";
            }
            else
            {
                $scope.artifactFilterCriteria = "library: (" + item.library1.description + ")";
            }

            $scope.loadArtifactList($scope.currentlySelectedLibraryId);

        }


    }

    //invoked when the user clicks the 'document type' link on the artifact popup to add a new document type
    $scope.openNewDocType = function()
    {
        $scope.popupErrors = [];
        $scope.newDocTypeShortDesc = "";
        $scope.newDocTypeLongDesc = "";
        addDocType.dialog("open");
    }

    //invoked when the user clicks save on the new doc type popup
    $scope.saveNewDocType = function()
    {
        var lovDto = {id: $scope.generateId(),
                      lovTable : 'DocType',
                      shortName: $scope.newDocTypeShortDesc,
                      longName: $scope.newDocTypeLongDesc};

         //wrap in apply so it refreshes page
        $scope.$apply(function () {
            Tag.addTagType(lovDto ).then (function (response) {

                if (response.status == "406")
                {
                    $scope.popupErrors = response.data;
                }
                else
                {
                    $scope.docTypeList.push(lovDto);
                    addDocType.dialog("close");
                }
            });
        })
    }

    //when the user right-clicks on a library entry to add a new artifact
    $scope.createNewArtifact = function(pLibraryId)
    {
       // $scope.$apply(function() {
            $scope.errors = [];
            $scope.annotation = {id: $scope.generateId(), annotationText: ""};
            $scope.annotations = [];
            $scope.tags = [];
            $scope.currentArtifact = initArtifact();
            $scope.currentArtifact.libraryId = pLibraryId;
            $scope.initLibraryLists($scope.currentArtifact.libraryId);

            $scope.isArtifact = true;
            $scope.showDocumentUpload = true;
            addEditArtifact.dialog("open");
            $timeout(function(){
                $scope.editPropertyTitle = "Create New Artifact";
            });
      //  });
    }

    //when the user right-clicks to edit an existing artifact
    //we need to move the artifact to currentArtifact so we can edit it
    $scope.setCurrentArtifact = function(artifactId) {

         Artifact.getArtifactEntry(artifactId).then(function (response) {
            if (response.status == "406")
            {
                $scope.errors = response.data;
            }
            else
            {
                $scope.errors = [];
                $scope.currentArtifact = response.data;
                $scope.initLibraryLists($scope.currentArtifact.libraryId);
                $scope.annotations = $scope.currentArtifact.annotationDtos;
                $scope.tags = $scope.currentArtifact.tagDtos;
                $("#fileUpload").val('');
                if ($scope.currentArtifact.documentName != null)
                {
                   $scope.showDocumentUpload = false;
                }
                else
                {
                    $scope.showDocumentUpload = true;
                }

                $scope.setEditType("artifact");
                if ($scope.userProfile.editor == false)
                {
                    angular.element('.ui-dialog-buttonpane').find('button:first').css('visibility','hidden');

                }
                addEditArtifact.dialog("open");
            }
         });
    }

    function initArtifact()
    {

        var val =
        {id:$scope.generateId(),
              documentTitle: "",
              abbreviation: "",
              detailedText: "",
              documentType: $scope.defaultDocType,
              libraryId : "",
              documentContent: null,
              documentName: null,
              tagDtos: [],
              annotationDtos: []};

        return val;
    }

    $scope.deleteArtifact = function(artifactId)
    {
         var refreshLibraryId = $scope.currentlySelectedLibraryId;
         Artifact.deleteArtifact(artifactId).then(function (response) {
            if (response.status == "406")
            {
                $scope.popupErrors = response.data;
                errorMsgPopup.dialog("open");
            }
            else
            {
                $scope.errors = [];
                $scope.currentArtifact = null;
                $scope.loadLibrary();
                $scope.initLibraryLists(null);
                $scope.loadArtifactList(refreshLibraryId);
            }
         });
    }

    //function called when the user clicks on the 'remove' button in the addEditProperties.ftl
    //when editing a document. this will remove the document from the artifact as well
    //as set the showDocumentUpload to true to allow attaching a new document
    $scope.removeDocument = function()
    {
        $scope.currentArtifact.documentContent = null;
        //the document name will remain. on the back end, if there is a name but no
        //content, then the system will purge the actual file
        $scope.setShowDocumentUpload(true);
    }

    $scope.saveArtifact = function()
    {
         //the library associated with an artifact is the lowest selected level
         if ($scope.selectedLibrary3.id != null)
         {
            $scope.currentArtifact.libraryId = $scope.selectedLibrary3.id;
         }
         else if ($scope.selectedLibrary2.id != null)
         {
            $scope.currentArtifact.libraryId = $scope.selectedLibrary2.id;
         }
         else
         {
           $scope.currentArtifact.libraryId = $scope.selectedLibrary1.id;
         }

         if ($scope.currentArtifact.documentType.id == "-1")
         {
            $scope.currentArtifact.documentType = null;
         }

         $scope.currentArtifact.tagDtos = $scope.tags;
         $scope.currentArtifact.annotationDtos = $scope.annotations;

         //the file upload is shown for new artifacts that can have a doc attached,
         //or existing artifacts where the existing doc was removed/replaced by
         //clicking on the replace button. Either way, if the upload input was
         //shown, blank out the document name, which will trigger a delete on
         //the backend if an existing file. if the file was replaced, it will
         //be replaced below
         if ($scope.showDocumentUpload)
         {
                $scope.currentArtifact.documentName = null;
         }

         if (document.getElementById('fileUpload').files.length > 0)
         {
             var f = document.getElementById('fileUpload').files[0];
             var r = new FileReader();

             r.onload = function(event) {

                $scope.currentArtifact.documentContent = event.target.result;
                $scope.currentArtifact.documentName = f.name;

                $scope.persistArtifact();
             }
             r.readAsDataURL(f);
         }
         else
         {
            $scope.persistArtifact();
         }
    }

    $scope.persistArtifact= function() {

         var refreshLibraryId = $scope.currentlySelectedLibraryId;

         $scope.$apply(function() {

             Artifact.saveArtifact($scope.currentArtifact).then (function (response) {

                if (response.status == "406")
                {
                    $scope.errors = response.data;
                }
                else if (response.status == "201")
                {
                    addEditArtifact.dialog("close");
                    $scope.loadLibrary();
                    //refresh the artifact list - to reflect the newly added/edited artifact
                    $scope.loadArtifactList(refreshLibraryId);
                }
                else
                {
                    $scope.errors = response.data;
                }
             });
         });
    }

    $scope.artifactSearch = function()
    {
        if ($scope.artifactSearchText != "")
        {
             Artifact.artifactSearch($scope.artifactSearchText).then(function (response) {
                if (response.status == "406")
                {
                }
                else
                {
                    $scope.artifactList = response.data;
                    $scope.artifactFilterCriteria = "search by (" + $scope.artifactSearchText + ")";
                }
             });
        }
    }

    $scope.loadLibrary();
    $scope.loadTags();
    $scope.loadDocTypes();

}]);



