<div id="diagramHelpDialog"  ng-cloak>
    <h3>Creating and Editing a Diagram</h3>
    <div>
        <p>When a diagram is first created, the <i>canvas</i> is blank with a <i>palette</i> displayed. The palette contains all the available shapes. The palette can be dragged around the screen as needed. To hide it, click on the 'Show Palette' checkbox in the top-right corner of the header bar. The top-right corner also contains the 'save', 'edit diagram properties', 'erase page objects', 'reload', and 'delete' icons.</p>
        <p><b>Very Important!</b> The diagram is only saved when the 'save digram' icon is clicked. All changes on the diagram including any shape edits are not saved unless this icon is clicked. Once clicked, the icon will clear indicating that the changes have been saved.</p>
    </div>
    <h3>Shape Types</h3>
    <div>
        <p>There are two categories of shapes: <b>New Shapes</b> and <b>Shared Shapes</b></p>
        <ul>
            <li>
                <u>New Shapes</u>: These are the shapes in the top row of the palette (circle, square, etc). When placed on the canvas, the are only for the use of the current diagram.
            </li>
            <li>
                <u>Shared Shapes</u>: When a shape represents a common piece of business flow (such as a 'login' process or a 'search process'), it would be helpful to be able to define the shape and then save it for use on other diagrams. Any shape can be converted to a Shared Shape in the edit window for the shape. See the section <b>Shared Shapes</b> for details
            </li>
        </ul>
    </div>
    <h3>Shared Shapes</h3>
    <div>
        <h4>Creating Shared Shapes</h4>
        <p>
            After a new shape is placed on the palette, open up the Edit window for it. At the bottom of the window, check the 'save as template' checkbox and then enter a template name. Upon saving the shape, all the attributes of the shape will be saved as a template and will appear in the 'shared shapes' dropdown in the shape palette.
        </p>
        <p>Once a shape is saved as a template, it will appear on the canvas in a light grey color. Additionally, the bottom of the edit window will display the template name of the shape.</p>
        <h4>Editing Shared Shapes</h4>
        <p>When a shared shape is edited, all other occurances of the shape, on the same diagram or other diagrams, will reflect the changes made to the following attributes:</p>
        <ul>
            <li>text</li>
            <li>artifact</li>
            <li>shared comments</li>
            <li>shared tags</li>
        </ul>
        <p>
         When editing shared shapes, a 'shared' checkbox will appear in the comments and tags tabs. When checked, any comments or tags added will appear in all other occurances of this shape. When not checked, the comment or tag appears in only the current shape.
        </p>
    </div>
    <h3>Placing Shapes</h3>
    <div>
        <p>Click on a shape in the palette (the shape will turn bold), or select a shared shape from the dropdown, and then click anywhere on the canvas to place the shape. Multiple shapes can be placed by continuing to click on the canvas. Click on the shape in the palette to turn off the shape placement.</p>
        <p><b>Lines</b> can only be drawn between shapes. Click inside a shape to start the line and then drag and release within a second shape to complete the line.</p>
    </div>
    <h3>Editing Shapes</h3>
    <div>
        <p>Right click on a shape to open the shape menu. The available options are:</p>
        <ul>
            <li><u>Edit Shape</u> opens the shape edit window. Used to specify the shape text, add comments, or tags, or associate to an artifact</li>
            <li><u>Resize</u> when chosen, the mouse cursor changes to indicate a resize is in effect. Click the mouse anywhere to extend the shape's border to the mouse location. If you click above or below the shape, the height is adjusted, while clicking to the left or right will change the width. You can click inside the shape to make it smaller</li>
            <li><u>Create Drilldown</u> A drilldown is a link to another page that expands or 'blows up' the definition of the currently selected shape. A drilldown can be to a new page, or an existing page. When choosing a new page, a window will appear to enter the new page information, after which, the current page is saved and you are navigated to the new page. When drilling to an existing page, a diagram search window will appear to search for the new page to link to. Once selected, you return to the current diagram, but the shape's text will now appear as a link, indicating a drill down exists.</li>
            <li><u>Delete</u> Deletes the shape</li>
        </ul>
    </div>
    <h3>Working with Multiple Shapes</h3>
    <div>
        <p>You can select a group of shapes to move, delete, align vertically or horizontally, or promote to a new page. To <b>select a group of shapes</b>, use the 'Group Select' palette shape and then click/drag to draw a square around the shapes. Releasing the mouse will turn all selected shapes green. Alternatively, hold the ctrl key and click on multiple shapes. For either option, click the escape key to cancel the option.</p>
        <p>If the 'Group Select' was used to select the shapes, right-click inside of the green square (but not within a shape) to view the available options. You can do a horizontal or vertical alignment which will align according to the leftmost shape's position. Selecting <u>delete</u> will delete all selected shapes. To move all shapes, click and drag within the green square. Finally, you can <u>promote</u> the selected shapes to a new page**. If you selected the shapes with the ctrl key, right-click on any shape to either align vertically or horizontally. The first shape that was clicked will establish the alignment.</p>
        <p><b>Promote Shapes**</b> Promoting shapes will move all selected shapes to a new diagram. Once selected, a window will appear allowing you to give the new diagram a title, description, and library location. Once entered, you will be navigated to the new page. In place of the moved shapes will be a single shape that has a drill down link to your new page.</p>
    </div>
    <h3>More About Shape Properties</h3>
    <div>
        <ul>
            <li><u>Sequence</u> By default all shapes, except lines get a sequence. If a sequence is not desired, leave it blank. If a sequence value is modified, any other shapes with a higher sequence number will be adjusted as needed.</li>
            <li><u>Text</u> The text can have multiple lines. The text will be displayed in the shape using the same number of lines as in the text (no smart wordwrap at this time)</li>
            <li><u>Library</u> To associate the shape with an artifact, locate it by selecting the appropriate library. The second and third levels will change based on the higher level folder selected. When an artifact is selected, an 'open' button will appear, allowing you to view the associated document. To remove an artifact association just blank out the topmost folder selection.</li>
            <li><u>Comments</u> Comments can be added to the shape. When a shape has comments, a 'comment' graphic will appear on the shape in the canvas.</li>
            <li><u>Tags</u> Tags can be added to allow for later search capability of the diagram.</li>
        </ul>
    </div>
</div>
