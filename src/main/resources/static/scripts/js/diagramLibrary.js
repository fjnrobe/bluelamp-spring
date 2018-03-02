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

$(function() {

    $.contextMenu({
        selector: '.libraryItem',
        autoHide: true,
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

    //define the popup for adding a new diagram
    newPageDiagram = $("#addEditProperties").dialog({
        autoOpen: false,
        height: 700,
        width:  700,
        modal: true,
        buttons: {
            "Save": function() {
                saveNewDiagram();
            },
            Cancel: function() {
                newPageDiagram.dialog("close");
            }
        }
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

});