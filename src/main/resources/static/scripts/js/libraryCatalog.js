	//return a refence to the pages angular controller js
    function getController()
    {
        return angular.element(document.getElementById('libraryCatalogController')).scope();
    }

    //listItem - will be a reference to the LI item that was clicked on
    //level - 'sibling' or 'child' - if 'sibling', then we are adding for current level
    //                               if 'child', will be a subcategory of listItem
	function handleAddNewLibraryItem(listItem, level )
    {
        //the reference library entry will be used to determine the level that the
        //new library entry will be put into
        getController().setAddLibraryItem(listItem[0].attributes['data-library-id'].value, level);
        newLibrary.dialog("open");
    }

    function handleEditLibraryItem( listItem )
    {
        getController().setEditLibraryItem(listItem[0].attributes['data-library-id'].value);
        newLibrary.dialog("open");
    }

    function handleDeleteLibraryItem(listItem )
    {
        if (confirm("Are you sure you want to delete this library entry? All sub-categories will be deleted as well. All artifacts and diagrams will be moved to the Unassigned Library") == true)
        {
            getController().deleteLibraryItem(listItem[0].attributes['data-library-id'].value);
        }
    }

    function openHelp(whichSection)
    {
        helpPopup.dialog("open");

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
                "addNewSibling": {name: "Add New - This Level",

                            icon: "edit",
                            callback: function (itemKey, opt, rootMenu, originalEvent)
                            {
                                handleAddNewLibraryItem(this, 'sibling');
                            }
                },
                "addNewChild": {name: "Add New Sub-Category",

                            visible: function( key, opt)
                            {
                                //don't allow sub-categories to the 'unassigned library (-99)
                                if (( this[0].attributes['data-library-level'].value < 2) &&
                                    ( this[0].attributes['data-library-id'].value != -99 ) )
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
                                handleAddNewLibraryItem(this, 'child');
                            }
                },

                "edit": {name: "Edit",
                            icon: "edit",
                            callback: function (itemKey, opt, rootMenu, originalEvent)
                            {
                                handleEditLibraryItem(this );
                            }
                },
                "delete": {name: "Delete",
                            visible: function( key, opt)
                            {
                                if (this[0].attributes['data-library-id'].value != -99)
                                {
                                    return true;
                                }
                                else
                                {
                                    return false;
                                }
                            },
                            icon: "delete",
                            callback: function (itemKey, opt, rootMenu, originalEvent)
                            {
                                handleDeleteLibraryItem( this);
                            }
                }
            }
        });

        //define the popup for adding a new library
        newLibrary = $("#newLibrary").dialog({
            autoOpen: false,
            height: 300,
            width:  700,
            modal: true,
            buttons: {
                "Save": function() {
                    getController().saveLibraryEntry();
                     newLibrary.dialog("close");
                },
                Cancel: function() {
                    newLibrary.dialog("close");
                }
            }
        });

        $( "#helpDialog" ).accordion({active: 0});

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