//return a refence to the pages angular controller js
function getController()
{
    return angular.element(document.getElementById('artifactLibraryController')).scope();
}

function handleNewArtifact(listItem)
{
    getController().createNewArtifact(listItem[0].attributes['data-library-id'].value);
}

function handleEditArtifact(listItem)
{
    getController().setCurrentArtifact(listItem[0].attributes['data-artifact-id'].value);
}

function handleDeleteArtifact(listItem)
{
    getController().deleteArtifact(listItem[0].attributes['data-artifact-id'].value);
}

function saveArtifact()
{
    getController().saveArtifact();
}

function saveNewTag()
{
    getController().saveNewTag();
}

function saveNewDocType()
{
    getController().saveNewDocType();
}

function openHelp(whichSection)
{
    helpPopup.dialog("open");

}

$(function() {

    var form = document.getElementById('addEditProperties');
    form.addEventListener('submit', function(event) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);

    $("#txtSearch").keyup(function(event){
        if(event.keyCode == 13){
            $("#btnSearch").click();
        }
    });

    $( "#tabs" ).tabs({
      active: 0
    });

    $.contextMenu({
        selector: '.libraryItem',
        autoHide: true,

        events  : {
            show: function(options) {

                //don't create popup to create new artifacts unless the user has the EDITOR role
                return (getController().getUserProfile().editor == true);
            }
        },
        items: {
            "newArtifact": {name: "Create New Artifact",

                        icon: "edit",
                        callback: function (itemKey, opt, rootMenu, originalEvent)
                        {
                            handleNewArtifact(this);
                        }
            }
        }
    });

    $.contextMenu({
        selector: '.artifactItem',
        autoHide: true,
        items: {
             "viewArtifact": {name: "View Artifact",
                              visible: function( key, opt)
                              {
                                   if (getController().getUserProfile().editor == false)
                                   {
                                       return true;
                                   }
                                   else
                                   {
                                       return false;
                                   }
                              },
                             icon: "edit",
                             callback: function (itemKey, opt, rootMenu, originalEvent)
                             {
                                   handleEditArtifact(this);
                             }

             },
             "editArtifact": {name: "Edit Artifact",
                              visible: function( key, opt)
                              {
                                    if (getController().getUserProfile().editor == true)
                                    {
                                        return true;
                                    }
                                    else
                                    {
                                        return false;
                                    }
                              },
                              icon: "edit",
                              callback: function (itemKey, opt, rootMenu, originalEvent)
                              {
                                    handleEditArtifact(this);
                              }
             },
             "deleteArtifact": {name: "Delete Artifact",
                                visible: function( key, opt)
                                   {
                                         if (getController().getUserProfile().editor == true)
                                         {
                                             return true;
                                         }
                                         else
                                         {
                                             return false;
                                         }
                                   },
                                    icon: "delete",
                                    callback: function( itemkey, opt, rootMenu, originalEvent)
                                    {
                                        handleDeleteArtifact(this);
                                    }
             }
        }
    });

    //define the popup for adding a new artifact
    addEditArtifact = $("#addEditProperties").dialog({
        autoOpen: false,
        height: 550,
        width:  700,
        modal: true,
         buttons: [
                {
                    id: "btnSave",
                    text: "Save",
                    click: function() {
                        saveArtifact();
                    }
                },
                {
                    id: "btnCancel",
                    text: "Cancel",
                    click: function() {
                        addEditArtifact.dialog("close");
                    }
                }
            ]

    });

    addTagType = $("#frmAddTagType").dialog({
        autoOpen: false,
        height: 250,
        width: 400,
        modal: true,
        buttons: {
            "Save": function() {
                saveNewTag();
            },
            Cancel: function() {
                addTagType.dialog("close");
            }
        }
    });

    addDocType = $("#frmAddDocType").dialog({
        autoOpen: false,
        height: 250,
        width: 400,
        modal: true,
        buttons: {
            "Save": function() {
                saveNewDocType();
            },
            Cancel: function() {
                addDocType.dialog("close");
            }
        }
    });

    $( "#helpDialog" ).accordion({active: 1});
    //define the popup the help
    helpPopup = $("#helpDialog").dialog({
        autoOpen: false,
        height: 600,
        width:  400,
        modal: true,
        buttons: {
            Cancel: function() {
                helpPopup.dialog("close");
            }
        }
    });

    //define the popup for errors
    errorMsgPopup = $("#errorDialog").dialog({
        autoOpen: false,
        height: 300,
        width:  500,
        modal: true,
        buttons: {
            Cancel: function() {
                errorMsgPopup.dialog("close");
            }
        }
    });

});