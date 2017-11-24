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
    getController().setCurrentArtifact(listItem[0].attributes['data-library-id'].value);
}

function saveArtifact()
{
  	addEditArtifact.dialog("close");
    getController().saveArtifact();
}

function handleSelectParentArtifact()
{
    getController().setParentArtifact();
    searchArtifactDialog.dialog("close");
}

$(function() {

    var form = document.getElementById('addEditArtifact');
    form.addEventListener('submit', function(event) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);

    $.contextMenu({
        selector: '.libraryItem',
        autoHide: true,
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
            "newArtifact": {name: "Create New Artifact",

                        icon: "edit",
                        callback: function (itemKey, opt, rootMenu, originalEvent)
                        {
                            handleNewArtifact(this);
                        }
            },
             "editArtifact": {name: "Edit Artifact",

                                    icon: "edit",
                                    callback: function (itemKey, opt, rootMenu, originalEvent)
                                    {
                                        handleEditArtifact(this);
                                    }
                        }
        }
    });

    //define the popup for adding a new artifact
    addEditArtifact = $("#addEditArtifact").dialog({
        autoOpen: false,
        height: 700,
        width:  700,
        modal: true,
        buttons: {
            "Save": function() {
                saveArtifact();
            },
            Cancel: function() {
                addEditArtifact.dialog("close");
            }
        }
    });

    //define the artifact search popup
    searchArtifactDialog = $("#searchArtifact").dialog({
        autoOpen: false,
        height: 700,
        width:  600,
        modal: true,
        buttons: {
            "Select": function() {
                handleSelectParentArtifact();
            },
            Cancel: function() {
                searchArtifactDialog.dialog("close");
            }
        }
    });

});