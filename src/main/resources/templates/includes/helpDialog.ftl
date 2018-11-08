<div id="helpDialog"  ng-cloak>
    <h3>Library Catalog</h3>
    <div>
        <p>The <b>Library Catalog</b> is the folder structure for your artifacts and diagrams. It can be configured using any structure that makes sense for your organization.</p>
        <p>The catalog can have any number of root folders (folders without a parent folder). Root folders can have up to two sub-folder levels.

        <h4>Navigating the Catalog</h4>
        <p>Moving the mouse over the catalog will boldface the selected folder, starting from the root folder. Click on a folder to expand or collapse it, showing the sub-folders.</p>
        <p>The [] following a folder name indicates the number of sub-folders.</p>
        <h4>Creating New Folders</h4>
        <p>Right-click on the selected folder to open a menu with the following options:</p>

        <ul>
            <li><u>Add New - This Level</u></li> this option will open a popup to create a new folder that will be placed at the same level as the currently selected folder.
            <li><u>Add New Sub-Category</u></li> create a new sub-folder of the currently selected folder. This option will only appear when selecting a root folder or the first child of a root folder.
            <li><u>Edit</u></li> modify the selected folder. The folder name and parent folder can be updated.
            <li><u>Delete</u></li> delete the selected folder. When a folder is deleted, any sub-folders are deleted as well. Any artifacts and diagrams within the deleted folders will be moved to the 'unassigned library'.
        </ul>
    </div>
    <h3>Artifacts</h3>
    <div>
        <p><b>Artifacts</b> are the documents of your system. Artifact entries serve as placeholders for whatever sort of documentation your organization utilizes. An artifact definition includes a title, a description of what the artifact is, and the catalog entry where the artifact resides. Additionally, comments and tags can be added to capture helpful information for other users of the system. Lastly, the external document that the artifact entry represents can be uploaded.</p>

        <h4>Artifact Catalog</h4>
        <p>Artifacts are displayed using the library catalog. The number of artifacts in a given folder is shown in the ( ) following the folder name. Clicking on a folder will display the artifacts in the bottom panel.</p>

        <h4>Searching for Artifacts</h4>
        <p>Perform a keyword search in the 'artifact search' textbox and hit enter or click on the search. Any artifacts that match the keyword (within the title, description, comments, or tags) will be displayed on the bottom panel.</p>

        <h4>Creating Artifacts</h4>
        <p>Right-click on the selected folder to open the Create New  Artifact menu option. Within the artifact popup window, the library will default to the selected folder. The folder can be changed if needed.</p>

        <h4>Editing / Deleting Artifacts</h4>
        <p>Locate the artifact and then right-click on the artifact in the bottom panel. You can then edit the artifact or delete it.</p>
    </div>
    <h3>Diagrams</h3>
    <div>
        <p><b>Diagrams</b> capture the processes of your organization. They can describe processes at whatever level of detail is needed. Diagrams can reference your artifacts.</p>

        <h4>Diagram Catalog</h4>
        <p>Diagrams are displayed using the library catalog. The number of diagrams in a given folder is shown in the ( ) following the folder name.</p>

        <h4>Searching for Diagrams</h4>
        <p>Perform a keyword search in the 'diagram search' textbox and hit enter or click on the search. Any diagrams that match the keyword (within the title, description, comments, or tags) will be displayed on the bottom panel.</p>

        <h4>Creating Diagrams</h4>
        <p>Right-click on the selected folder to open the Create New  Diagram menu option. Within the diagram popup window, the library will default to the selected folder. The folder can be changed if needed.</p>

        <h4>Editing / Deleting Diagrams</h4>
        <p>Locate the diagram. In the bottom panel, the diagram name link is clicked to open the diagram for edit or delete.</p>
    </div>
</div>
