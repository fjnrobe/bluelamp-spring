//return a refence to the pages angular controller js
function getController()
{
    return angular.element(document.getElementById('diagramLibraryController')).scope();
}

function handleNewDiagram(listItem)
{
    getController().createNewDiagram(listItem[0].attributes['data-library-id'].value);
}

function saveNewDiagram()
{
    getController().saveNewDiagram();
}

function handleSelectDiagram()
{
    getController().saveSelectedDiagram();
    searchDiagramDialog.dialog("close");
    releasePen(getController().currentShape, 'handleSelectDiagram');
}

function openHelp(whichSection)
{
    helpPopup.dialog("open");

}

function saveNewTag()
{
    getController().saveNewTag();
}

$(function() {

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
            "newDiagram": {name: "Create New Diagram",

                        icon: "edit",
                        callback: function (itemKey, opt, rootMenu, originalEvent)
                        {
                            handleNewDiagram(this);
                        }
            }
        }
    });

    //configures the addEditProperties to be a 3 tabbed form
    $( "#tabs" ).tabs({
      active: 0
    });

    $("#txtSearch").keyup(function(event){
        if(event.keyCode == 13){
            $("#btnSearch").click();
        }
    });

    //define the popup for adding a new diagram
    newPageDiagram = $("#addEditProperties").dialog({
        autoOpen: false,
        height: 550,
        width:  700,
        modal: true,
        buttons: [
            {
                id: "btnSave",
                text: "Save",
                click: function() {
                    saveNewDiagram();
                }
            },
            {
                id: "btnCancel",
                text: "Cancel",
                click: function() {
                    newPageDiagram.dialog("close");
                }
            }
        ]
//        buttons: {
//            "Save": function() {
//                saveNewDiagram();
//            },
//            Cancel: function() {
//                newPageDiagram.dialog("close");
//            }
//        }
    });

    //define the artifact info popup
    artifactInfoDialog = $("#artifactInfoAI").dialog({
        autoOpen: false,
        height: 700,
        width:  600,
        modal: true,
        buttons: {
            Cancel: function() {
                artifactInfoDialog.dialog("close");
            }
        }
    });

    //define the searchDiagram popup
    searchDiagramDialog = $("#searchDiagram").dialog({
        autoOpen: false,
        height: 700,
        width:  600,
        modal: true,
        buttons: {
            "Select": function() {
                handleSelectDiagram();
            },
            Cancel: function() {
                searchDiagramDialog.dialog("close");
            }
        }
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

     $( "#helpDialog" ).accordion({active: 2});

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

});