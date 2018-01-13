      //https://swisnl.github.io/jQuery-contextMenu/		
	  //what shape has claimed the use of the mouse
	  var activeShapeId = 0;
	  var selectedMenuShapeIdx = -1;  //currently selected shape by a context menu - references index in pageShapes global list
	  var deleteDialog;               //reference to the delete dialog popup confirmation
	  var pageNewShape = null;		  //set the the new shape being created
	  var pageShapes = [];	          //global list of shapes on the page
	  var panelX = 0;                //location of mouse on panel - x
	  var panelY = 0;                //location of mouse on panel - y
	  var resizeTriggered = false;
	  var defaultRadius = 70;
	  var defaultSquareWidth = 100;
	  var defaultSquareHeight = 100;
	  var defaultRecHeight = 100;
	  var defaultRecWidth = 150;
	  var defaultElipseWidth = 150;
	  var defaultElipseHeight = 100;
	  var defaultDiamondWidth = 150;
	  var defaultDiamondHeight = 100;
	  var lastActiveShape = null; //when a shape relinquishes the pen (releasePen), the shape is held here.
	 
	  var pageCache = [];	//for testing only holds each 'saved' page

	//connect two shapes based on provided start/end vectors, using a specified connection type
	//the two shapes are a jsgl.group objects extended with properties/helper/eventhandler 
	//start/endVector are jsgl.Vector2D types
	//the connection type is: 'one way connector', 'two way connector', 'note', or 'off page' 
	//if lineElement is provided (jsgl.LineElement) - then use it as the object to hold the connection - otherwise, create a new line
	//  --the lineElement will be returned
	function connectShapes(startingShape, endingShape, startVector, endVector, connectionType, lineElement)  
	{
		//if we don't already have a started line element 
		if (lineElement == null)
		{
			lineElement = myPanel.createGroup();					
			lineElement.id = getController().generateId();
			lineElement.shape = 'line';
			lineElement.shapeEventHandler = new LineShapeEventHandler(lineElement);			
			lineElement.properties = new LineProperties(lineElement, getNextSequenceNumber());
			lineElement.properties.relationshipType = connectionType;
			lineElement.shapeHelper = new LineShapeHelper(lineElement);
			lineElement.setLocationXY(0,0);

			var newLine = myPanel.createLine();				
			lineElement.addElement(newLine);
			
			//create a sequence container - but not use for lines
			var seqLabel = myPanel.createLabel();
			lineElement.addElement(seqLabel);
			
			//the text element will be created when the line is completed - at this point, we don't know where the
			//center of the line is - see the MouseUpListener method
			
			//pageShapes.push(lineElement);		
			//myPanel.addElement(lineElement);		
		}
		var line = lineElement.getElementAt(0);
	  
	  //find out which of the points on the startingShape are closest to the starting vector, we will then set the start
	  //of the line to that border point	  
	  var closestBorderPoint = startingShape.shapeHelper.closestBorderPoint(startVector);
	  
	  line.setStartX(closestBorderPoint.location.getX());
	  line.setStartY(closestBorderPoint.location.getY());
	  
	  //link this line to this border point - when the shape moves - we'll need to know which lines to adjust
	  var lineInfo1 = {lineId: lineElement.id, startEndInd: 'S', linkedShapeId: endingShape.id };
	  
	  closestBorderPoint.linkedLines.push(lineInfo1);
	  
	  //set the border points on the line as well as what object the line is linked to
	  lineElement.properties.startPointVector = new jsgl.Vector2D(closestBorderPoint.location.getX(), closestBorderPoint.location.getY());
	  lineElement.properties.startObjectId = startingShape.id;

	  //find out which of the points on the endingShape are closest to the starting point, we will then set the end 
	  //of the line to that border point
	  closestBorderPoint = endingShape.shapeHelper.closestBorderPoint(endVector);
	  line.setEndX(closestBorderPoint.location.getX());
	  line.setEndY(closestBorderPoint.location.getY());
	  
	  //link this line to this border point - when the circle moves - we'll need to know which lines to adjust
	  var lineInfo2 = {lineId: lineElement.id, startEndInd: 'E', linkedShapeId: startingShape.id};
	  
	  closestBorderPoint.linkedLines.push(lineInfo2);
	  
	  //set the border points on the line as well as what object the line is linked to
	  lineElement.properties.endPointVector = new jsgl.Vector2D(closestBorderPoint.location.getX(), closestBorderPoint.location.getY());
	  lineElement.properties.endObjectId = endingShape.id;
  
	  //if the arrow type is 'two way connector' then draw an arrowhead on the from side
	  if (lineElement.properties.relationshipType == 'two way connector')
	  {
		  //draw an arrow at the start of the line
		  var arrowElement = createArrow(line.getEndX(),
		  line.getEndY(),
		  line.getStartX(),
		  line.getStartY());
						 
		  lineElement.properties.startArrowElement = arrowElement;
		  myPanel.addElement(arrowElement);					   
	  }
  	  
	  //draw an arrow at the end of the line as long as the line is not a note connector
	  if (lineElement.properties.relationshipType != 'note')
	  {
		  var arrowElement = createArrow(line.getStartX(),
		  line.getStartY(),
		  line.getEndX(),
		  line.getEndY());
							 
		  lineElement.properties.endArrowElement = arrowElement;
		  myPanel.addElement(arrowElement);					
	  }

	  return lineElement;
	}

    //base 'class' for the properties of shapes	
	function ShapeProperties(shape, nextSeqNbr)
	{
		this.canBeDrillDown = false;
		this.drillDownPageId = -1;   //if this shape links to a detailed page, this is the page id
		this.drillDownPageTitle = ""; //if this shape links to a detailed page, this is the title of that page
		this.borderPoints = [];
		this.currentShape = shape;
		this.sequenceNumber = nextSeqNbr;
		this.shapeText = "";
		this.tags = [];
		this.annotations = [];
		this.artifactId = -1;	
		this.width = 0;
		this.height = 0;		
	};
	
	ShapeProperties.prototype.setBorderPoints = function()
	{
		//should be implemented
	}

	ShapeProperties.prototype.getBorderPoints = function() 
	{
		return this.borderPoints;
	}
	
	ShapeProperties.prototype.resetBorderPoints = function()
	{
		//should be implemented
	}
	
	ShapeProperties.prototype.getWidth = function()
	{
		return this.width;
	}
	
	ShapeProperties.prototype.getHeight = function()
	{
		return this.height;
	}
	
	ShapeProperties.prototype.setWidth = function(pWidth)
	{
		this.width = pWidth;
	}
		
	ShapeProperties.prototype.setHeight = function(pHeight)
	{
		this.height = pHeight;
	}
	
	function GroupSelectProperties()
	{
		this.originalX = -1;
		this.originalY = -1;
		this.startX = -1;
		this.startY = -1;
		this.endX = -1;
		this.endY = -1;
		this.originalStartX = -1;
		this.originalStartY = -1;
		this.managedShapes = [];  //this will be the shapes within the groups
		this.isDrawing = false;   //the group select has two actions - draw the group select boundry (isDrawing = true) and then moving the group (isDrawing = false)
								  //we need to know what the group is doing to know what to do with the group is moved
	}
	
	GroupSelectProperties.prototype = Object.create (ShapeProperties.prototype);
	
	
	function angle(cx, cy, ex, ey) {
	  var dy = cy - ey;
	  var dx = ex - cx;
	  var theta = Math.atan2(dy, dx); // range (-PI, PI]
	  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
	  return theta;
	}

	//this method will take in the x,y starting and ending locations of a line, convert those locations to the traditional x/y graph (which puts 0,0 in the center with negative X values
	//to the left of 0,0 and positive to right, and positive y values above,while negative below, and then return the angle
	function angle360(sx, sy, ex, ey) {
		
	  var theta = angle(sx, sy, ex, ey); // range (-180, 180]
	  if (theta < 0) theta = 360 + theta; // range [0, 360)
	  return theta;
	}	
	
	function createArrow(startX, startY, endX, endY)
	{
		var arrowHead = myPanel.createPolygon();
		
		//tip of arrow is at end of line
		arrowHead.addPointXY(endX, endY);
		  
		var lineAngle = angle360(startX, startY, endX, endY);
		var length = 12;
		
		//compute the angle for the right side of the arrowhead
		var rightSideAngle = lineAngle + 45 + 180;
		if (rightSideAngle > 360)
		{
			rightSideAngle -= 360;
		}
		var rightSideAngleRad = rightSideAngle * Math.PI / 180;
		rightSideAngleRad = rightSideAngleRad * -1;
		
		var rightX = endX + Math.cos(rightSideAngleRad) * length;
		var rightY = endY + Math.sin(rightSideAngleRad) * length;
		
		arrowHead.addPointXY(rightX, rightY);
		
		//compute the angle for the left side of the arrowhead
		var leftSideAngle = lineAngle - 45 + 180;
		var leftSideAngleRad = (leftSideAngle * Math.PI) / 180;
		leftSideAngleRad = leftSideAngleRad * -1;
		
		var leftX = endX + Math.cos(leftSideAngleRad) * length;
		var leftY = endY + Math.sin(leftSideAngleRad) * length;
		
		arrowHead.addPointXY(leftX, leftY);
		
		return arrowHead;
	}
	
	function ShapeDto(shapeType)
	{		
		this.shapeId = -1;
		this.sequenceNumber = -1;
		this.referenceArtifacts = {};
		this.shapeType = shapeType;
		this.drillDownPageId = -1;		
		this.radius = -1;
		this.width = -1;
		this.height = -1;
		this.centerX = -1;
		this.centerY = -1;
		this.shapeText = '';
		this.tags = [];
		this.annotations = [];
	  };
	  
	function shapeRelationshipDto () {		
		this.relationshipId = -1;
		this.fromShapeId = -1;
		this.toShapeId = -1;
		this.lovRelationshipType = '';
		this.startXLocation = -1;
		this.startYLocation = -1;
		this.endXLocation = -1;
		this.endYLocation = -1;
		this.relationshipGraphicId = -1;
		this.tags = [];
		this.annotations = [];
	};

	
	function OffPageProperties(shape, nextSeqNbr)
	{
		
		ShapeProperties.call(this, shape, nextSeqNbr);
		this.width = 50;
		this.height = 50;					
	}

	OffPageProperties.prototype = Object.create( ShapeProperties.prototype);
		
	OffPageProperties.prototype.getSequenceYOffset = function()
	{
		return (this.height - 10) * -1;   //this is the 'Y' location of the sequence label
	}
	
	OffPageProperties.prototype.setBorderPoints = function() 
	{
		var innerDiamond = this.currentShape.getElementAt(0);
			
		this.borderPoints = [];
			
		var centerX = this.currentShape.getX();
		var centerY = this.currentShape.getY();
			
		//each border point will be an object of : {location: Vector2D, linkedLines: [ {lineId: number, startEndInd: 'S' or 'E'}]}
		var topRightBorderVector = new jsgl.Vector2D( (centerX + this.getWidth() / 2), centerY - (this.height / 2));
		var borderPoint = {location: topRightBorderVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);
		
		var centerRightBorderVector = new jsgl.Vector2D(centerX + (this.getWidth() / 2), centerY);
		borderPoint = {location: centerRightBorderVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);
		
		var bottomBorderVector = new jsgl.Vector2D(centerX, centerY + (this.height / 2));
		var borderPoint = {location: bottomBorderVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);
		
		var centerLeftBorderVector = new jsgl.Vector2D(centerX-(this.getWidth() / 2), centerY);			
		var borderPoint = {location: centerLeftBorderVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);			
		
		var topLeftBorderVector = new jsgl.Vector2D(centerX-(this.getWidth() / 2), centerY - (this.height / 2));			
		var borderPoint = {location: topLeftBorderVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);
		
		var topCenterBorderVector = new jsgl.Vector2D(centerX, centerY - (this.height / 2));			
		var borderPoint = {location: topCenterBorderVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);
		
	}
		
	OffPageProperties.prototype.resetBorderPoints = function() 
	{
		var innerDiamond = this.currentShape.getElementAt(0);
		
		var centerX = this.currentShape.getX();
		var centerY = this.currentShape.getY();
		
		//each border point will be an object of : {location: Vector2D, linkedLines: [ {lineId: number, startEndInd: 'S' or 'E'}]}
		
		var topRightBorderVector = new jsgl.Vector2D(centerX + (this.getWidth() / 2), centerY - (this.getHeight() / 2));
		var borderPointData = this.borderPoints[0];
		borderPointData.location = topRightBorderVector;
		
		var centerRightBorderVector = new jsgl.Vector2D(centerX + (this.getWidth() / 2), centerY);
		var borderPointData = this.borderPoints[1];
		borderPointData.location = centerRightBorderVector;
		
		var bottomBorderVector = new jsgl.Vector2D(centerX, centerY + (this.getHeight() / 2));
		var borderPointData = this.borderPoints[2];
		borderPointData.location = bottomBorderVector;
		
		var centerLeftBorderVector = new jsgl.Vector2D(centerX -(this.getWidth() / 2), centerY);		
		var borderPointData = this.borderPoints[3];
		borderPointData.location = centerLeftBorderVector;	

		var topLeftBorderVector = new jsgl.Vector2D(centerX -(this.getWidth() / 2), centerY - (this.getHeight() / 2));					
		var borderPointData = this.borderPoints[4];
		borderPointData.location = topLeftBorderVector;	
		
		var topCenterBorderVector = new jsgl.Vector2D(centerX, centerY - (this.getHeight() / 2));	
		var borderPointData = this.borderPoints[5];
		borderPointData.location = topCenterBorderVector;	
    };
	  
	function DiamondProperties(shape, nextSeqNbr, pWidth, pHeight)
	{
		this.width = pWidth;
		this.height = pHeight;
		ShapeProperties.call(this,shape,nextSeqNbr)
	}
	
	DiamondProperties.prototype = Object.create ( ShapeProperties.prototype);
		
	DiamondProperties.prototype.getSequenceYOffset = function()
	{
		return (this.height / 2)  * -1;   //this is the 'Y' location of the sequence label
	}
	
	DiamondProperties.prototype.setBorderPoints = function() 
	{
		
		var innerDiamond = this.currentShape.getElementAt(0);
		
		this.borderPoints = [];
		
		var centerX = this.currentShape.getX();
		var centerY = this.currentShape.getY();
		
		//each border point will be an object of : {location: Vector2D, linkedLines: [ {lineId: number, startEndInd: 'S' or 'E'}]}
		var topBorderVector = new jsgl.Vector2D(centerX, centerY - (this.height / 2));
		var borderPoint = {location: topBorderVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);
		
		var bottomBorderVector = new jsgl.Vector2D(centerX, centerY + (this.height / 2));
		borderPoint = {location: bottomBorderVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);
		
		var rightBorderVector = new jsgl.Vector2D(centerX -  (this.width / 2), centerY);
		var borderPoint = {location: rightBorderVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);
		
		var leftBorderVector = new jsgl.Vector2D(centerX +  (this.width / 2), centerY);			
		var borderPoint = {location: leftBorderVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);			
	}
		
	DiamondProperties.prototype.resetBorderPoints = function() {
			
		var innerDiamond = this.currentShape.getElementAt(0);
		
		var centerX = this.currentShape.getX();
		var centerY = this.currentShape.getY();
		
		//each border point will be an object of : {location: Vector2D, linkedLines: [ {lineId: number, startEndInd: 'S' or 'E'}]}
		
		var topBorderVector = new jsgl.Vector2D(centerX, centerY - (this.height / 2));
		var borderPointData = this.borderPoints[0];
		borderPointData.location = topBorderVector;
		
		var bottomBorderVector = new jsgl.Vector2D(centerX, centerY + (this.height / 2));
		var borderPointData = this.borderPoints[1];
		borderPointData.location = bottomBorderVector;
		
		var rightBorderVector = new jsgl.Vector2D(centerX -  (this.width / 2), centerY);
		var borderPointData = this.borderPoints[2];
		borderPointData.location = rightBorderVector;
		
		var leftBorderVector = new jsgl.Vector2D(centerX +  (this.width / 2), centerY);			
		var borderPointData = this.borderPoints[3];
		borderPointData.location = leftBorderVector;			
	};
	  
    function SquareProperties(shape, nextSeqNbr, pWidth, pHeight)
	{
		
		ShapeProperties.call(this,shape, nextSeqNbr);
		this.width = pWidth;
		this.height = pHeight;
		this.canBeDrillDown = true;
	}
	
	SquareProperties.prototype = Object.create (ShapeProperties.prototype);
	
	SquareProperties.prototype.getSequenceYOffset = function()
	{
		return (this.height / 2) * -1;   //this is the 'Y' location of the sequence label
	}
	
	SquareProperties.prototype.setBorderPoints = function() {
		
		var innerSquare = this.currentShape.getElementAt(0);
		
		this.borderPoints = [];
		
		var centerX = this.currentShape.getX();
		var centerY = this.currentShape.getY();
		
		//each border point will be an object of : {location: Vector2D, linkedLines: [ {lineId: number, startEndInd: 'S' or 'E'}]}
		var topCenterVector = new jsgl.Vector2D(centerX, centerY - (this.getHeight()/2));
		var borderPoint = {location: topCenterVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);
		
		var topRightBorderVector = new jsgl.Vector2D(centerX + (this.getWidth()/2), centerY - (this.getHeight()/2));
		borderPoint = {location: topRightBorderVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);
		
		var centerRightBorderVector = new jsgl.Vector2D(centerX +  (this.getWidth()/2), centerY);
		var borderPoint = {location: centerRightBorderVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);
		
		var bottomRightBorderVector = new jsgl.Vector2D(centerX +  (this.getWidth()/2), centerY + (this.getHeight()/2));			
		var borderPoint = {location: bottomRightBorderVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);			
		
		var bottomCenterBorderVector = new jsgl.Vector2D(centerX, centerY + (this.getHeight()/2));			
		var borderPoint = {location: bottomCenterBorderVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);			
		
		var bottomLeftBorderVector = new jsgl.Vector2D(centerX - (this.getWidth()/2), centerY + (this.getHeight()/2));			
		var borderPoint = {location: bottomLeftBorderVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);	
		
		var centerLeftBorderVector = new jsgl.Vector2D(centerX - (this.getWidth()/2), centerY);			
		var borderPoint = {location: centerLeftBorderVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);	
		
		var topLeftBorderVector = new jsgl.Vector2D(centerX - (this.getWidth()/2), centerY - (this.getHeight()/2));			
		var borderPoint = {location: topLeftBorderVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);	
		
	}
		
	SquareProperties.prototype.resetBorderPoints = function() {
			
		var innerDiamond = this.currentShape.getElementAt(0);
		
		var centerX = this.currentShape.getX();
		var centerY = this.currentShape.getY();
		
		//each border point will be an object of : {location: Vector2D, linkedLines: [ {lineId: number, startEndInd: 'S' or 'E'}]}
		//each border point will be an object of : {location: Vector2D, linkedLines: [ {lineId: number, startEndInd: 'S' or 'E'}]}
		var topCenterVector = new jsgl.Vector2D(centerX, centerY - (this.getHeight()/2));
		var borderPointData = this.borderPoints[0];
		borderPointData.location = topCenterVector;
		
		var topRightBorderVector = new jsgl.Vector2D(centerX + (this.getWidth()/2), centerY - (this.getHeight()/2));
		var borderPointData = this.borderPoints[1];
		borderPointData.location = topRightBorderVector;
		
		var centerRightBorderVector = new jsgl.Vector2D(centerX +  (this.getWidth()/2), centerY);
		var borderPointData = this.borderPoints[2];
		borderPointData.location = centerRightBorderVector;
		
		var bottomRightBorderVector = new jsgl.Vector2D(centerX +  (this.getWidth()/2), centerY + (this.getHeight()/2));			
		var borderPointData = this.borderPoints[3];
		borderPointData.location = bottomRightBorderVector;
		
		var bottomCenterBorderVector = new jsgl.Vector2D(centerX, centerY + (this.getHeight()/2));			
		var borderPointData = this.borderPoints[4];
		borderPointData.location = bottomCenterBorderVector;
		
		var bottomLeftBorderVector = new jsgl.Vector2D(centerX - (this.getWidth()/2), centerY + (this.getHeight()/2));			
		var borderPointData = this.borderPoints[5];
		borderPointData.location = bottomLeftBorderVector;
		
		var centerLeftBorderVector = new jsgl.Vector2D(centerX - (this.getWidth()/2), centerY);			
		var borderPointData = this.borderPoints[6];
		borderPointData.location = centerLeftBorderVector;			
		
		var topLeftBorderVector = new jsgl.Vector2D(centerX - (this.getWidth()/2), centerY - (this.getHeight()/2));			
		var borderPointData = this.borderPoints[7];
		borderPointData.location = topLeftBorderVector;	
	};
	  
	function ElipseProperties(shape, nextSeqNbr)
	{
		ShapeProperties.call(this,shape,nextSeqNbr);
		this.canBeDrillDown = true;
	}

	ElipseProperties.prototype = Object.create(ShapeProperties.prototype);
	
	ElipseProperties.prototype.getSequenceYOffset = function()
	{
		return (this.getHeight() / 2) * -1;   //this is the 'Y' location of the sequence label
	}
	
	ElipseProperties.prototype.setWidth = function(pWidth)
	{
		this.currentShape.getElementAt(0).setWidth(pWidth);
	}
		
	ElipseProperties.prototype.getWidth = function()
	{
		return this.currentShape.getElementAt(0).getWidth();
	}
		
	ElipseProperties.prototype.setHeight = function(pHeight)
	{
		this.currentShape.getElementAt(0).setHeight(pHeight);
	}
		
	ElipseProperties.prototype.getHeight = function()
	{
		return this.currentShape.getElementAt(0).getHeight();
	}
		
	ElipseProperties.prototype.setBorderPoints = function() {
		
		var innerElipse = this.currentShape.getElementAt(0);
		
		this.borderPoints = [];
		
		var centerX = this.currentShape.getX();
		var centerY = this.currentShape.getY();
		
		//each border point will be an object of : {location: Vector2D, linkedLines: [ {lineId: number, startEndInd: 'S' or 'E'}]}
		var topCenterVector = new jsgl.Vector2D(centerX, centerY - (innerElipse.getHeight() / 2));
		var borderPoint = {location: topCenterVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);
		
		var centerRightBorderVector = new jsgl.Vector2D(centerX +  (innerElipse.getWidth() / 2), centerY);
		var borderPoint = {location: centerRightBorderVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);
		
		var bottomCenterBorderVector = new jsgl.Vector2D(centerX, centerY + (innerElipse.getHeight() / 2));			
		var borderPoint = {location: bottomCenterBorderVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);			
		
		var centerLeftBorderVector = new jsgl.Vector2D(centerX - (innerElipse.getWidth() / 2), centerY);			
		var borderPoint = {location: centerLeftBorderVector, linkedLines: []};				
		this.borderPoints.push(borderPoint);

	}
		
	ElipseProperties.prototype.resetBorderPoints = function() {
			
		var innerElipse = this.currentShape.getElementAt(0);
		
		var centerX = this.currentShape.getX();
		var centerY = this.currentShape.getY();
		
		//each border point will be an object of : {location: Vector2D, linkedLines: [ {lineId: number, startEndInd: 'S' or 'E'}]}
		var topCenterVector = new jsgl.Vector2D(centerX, centerY - (innerElipse.getHeight() / 2));
		var borderPointData = this.borderPoints[0];
		borderPointData.location = topCenterVector;
		
		var centerRightBorderVector = new jsgl.Vector2D(centerX +  (innerElipse.getWidth() / 2), centerY);
		var borderPointData = this.borderPoints[1];
		borderPointData.location = centerRightBorderVector;
		
		var bottomCenterBorderVector = new jsgl.Vector2D(centerX, centerY + (innerElipse.getHeight() / 2));			
		var borderPointData = this.borderPoints[2];
		borderPointData.location = bottomCenterBorderVector;
		
		var centerLeftBorderVector = new jsgl.Vector2D(centerX - (innerElipse.getWidth() / 2), centerY);			
		var borderPointData = this.borderPoints[3];
		borderPointData.location = centerLeftBorderVector;			
		
	};
	  
	function CircleProperties(shape, nextSeqNbr, pRadius)
	{	
		ShapeProperties.call(this, shape, nextSeqNbr);
		this.canBeDrillDown = true;
		this.radius = pRadius;
		this.showHover = true;	
	}
	
	CircleProperties.prototype = Object.create (ShapeProperties.prototype);
	
	CircleProperties.prototype.getRadius = function() {
		return this.radius;
	}
		
	CircleProperties.prototype.setRadius = function(pRadius) {
		this.radius = pRadius;
	}
	
	CircleProperties.prototype.getSequenceYOffset = function()
	{
		return ( this.getRadius() - 10) * -1;   //this is the 'Y' location of the sequence label
	}
	
	CircleProperties.prototype.setBorderPoints = function() {
			
		this.borderPoints = [];
			
		var innerCircle = this.currentShape.getElementAt(0);
		
		var centerX = this.currentShape.getX();
		var centerY = this.currentShape.getY();
		var radius = innerCircle.getRadius();
		
		var borderX;
		var borderY;
		var degree = 0;
		for (var idx = 0; idx < 8; idx++)
		{
			borderX = centerX + (radius * Math.cos(degree * Math.PI / 180));
			borderY = centerY + (radius * Math.sin(degree  * Math.PI / 180));
			
			//a border point will be a small filled circle with an event handler and properties object
			//we wont add to the canvas until the user hovers over the shape - then the 'magically' appear
			borderPoint = {location: new jsgl.Vector2D(borderX, borderY), linkedLines: []};	
			this.borderPoints.push(borderPoint);
			degree += 45;
		}			
	};
		
	CircleProperties.prototype.resetBorderPoints = function() {
			
		var innerCircle = this.currentShape.getElementAt(0);
		
		var centerX = this.currentShape.getX();
		var centerY = this.currentShape.getY();
		var radius = innerCircle.getRadius();
		
		var borderX;
		var borderY;
		var degree = 0;
		for (var idx = 0; idx < this.borderPoints.length; idx++)
		{
			borderX = centerX + (radius * Math.cos(degree * Math.PI / 180));
			borderY = centerY + (radius * Math.sin(degree  * Math.PI / 180));
				
			//each border point will be an object of : {location: Vector2D, linkedLines: [ {lineId: number, startEndInd: 'S' or 'E'}]}
			var borderPoint = new jsgl.Vector2D(borderX, borderY);
			var borderPointData = this.borderPoints[idx];								
			borderPointData.location = borderPoint;
			
			degree += 45;
		}			
	};
		
	function LineProperties(shape)
	{
		
		this.startPointVector = null;
		this.endPointVector = null;
		this.startObjectId = -1;
		this.endObjectId = -1;		
		this.relationshipType = "";           //will be 'one way connector', 'two way connector', 'page', or 'note'
		this.startArrowElement = null; //this will be a reference to the polygon shape that is in the myPanel elements list
		this.endArrowElement = null; //this will be a reference to the polygon shape that is in the myPanel elements list
		ShapeProperties.call(this,shape,-1);
	};
	
	LineProperties.prototype = Object.create(ShapeProperties.prototype);
	
	LineProperties.prototype.getSequenceYOffset = function()
	{
		return ( -12);   //this is the 'Y' location of the sequence label
	}
	
	//'base class' for the shape helpers
	function ShapeHelper(shape)
	{
		this.currentShape = shape;
	}
	
	//this returns the shape's center x/y location in relation to the entire panel drawing space
	ShapeHelper.prototype.getShapeCenterPoint = function()
	{
		return this.currentShape.getLocation();
	}
	
	//whenever a shape moves or resized, we need to reposition/resize the associated linkages
	ShapeHelper.prototype.adjustLinkedLines = function()
	{
		//for each border point 
		for (var borderIdx = 0; borderIdx < this.currentShape.properties.borderPoints.length; borderIdx++)
		{
			var borderPoint = this.currentShape.properties.borderPoints[borderIdx];
			
			//cycle through the list of attached lines
			for (var linkedLineIdx = 0; linkedLineIdx < borderPoint.linkedLines.length; linkedLineIdx++)
			{
				//find the line in the global list of page shapes					
				for (var shapeIdx = 0; shapeIdx < pageShapes.length; shapeIdx++)
				{
					//when we find the line
					if (pageShapes[shapeIdx].id == borderPoint.linkedLines[linkedLineIdx].lineId)
					{						
						var lineToUpdate = pageShapes[shapeIdx].getElementAt(0);
						var lineGroup = pageShapes[shapeIdx];
						
						//we need to update either the start or end of the line x/y
						if (borderPoint.linkedLines[linkedLineIdx].startEndInd == 'S')
						{
							//find the location that is closest to the end of the line - so it takes the shortest route from start to end
							var newVector = new jsgl.Vector2D(lineToUpdate.getEndX(), lineToUpdate.getEndY());
							var closestBorderPoint = this.currentShape.shapeHelper.closestBorderPoint(newVector);
						
							lineToUpdate.setStartX(closestBorderPoint.location.getX());
							lineToUpdate.setStartY(closestBorderPoint.location.getY());
							lineGroup.properties.startPointVector = new jsgl.Vector2D(closestBorderPoint.location.getX(), closestBorderPoint.location.getY());
							
							//now - go to the other end of the line and update it as well
							var objectIdAtOtherEnd = lineGroup.properties.endObjectId;
							if (objectIdAtOtherEnd != -1)
							{
								newVector = new jsgl.Vector2D(lineToUpdate.getStartX(), lineToUpdate.getStartY());
								var otherObject = pageShapes[getShapeIndex(objectIdAtOtherEnd)];
								closestBorderPoint = otherObject.shapeHelper.closestBorderPoint(newVector);
								lineToUpdate.setEndX(closestBorderPoint.location.getX());
								lineToUpdate.setEndY(closestBorderPoint.location.getY());
								lineGroup.properties.endPointVector = new jsgl.Vector2D(closestBorderPoint.location.getX(), closestBorderPoint.location.getY());
							}
							
						}
						else
						{
							//find the location that is closest to the end of the line - so it takes the shortest route from start to end
							var newVector = new jsgl.Vector2D(lineToUpdate.getStartX(), lineToUpdate.getStartY());
							var closestBorderPoint = this.currentShape.shapeHelper.closestBorderPoint(newVector);

							lineToUpdate.setEndX(closestBorderPoint.location.getX());
							lineToUpdate.setEndY(closestBorderPoint.location.getY());
							lineGroup.properties.endPointVector = new jsgl.Vector2D(closestBorderPoint.location.getX(), closestBorderPoint.location.getY());
								
							//now - go to the other end of the line and update it as well
							var objectIdAtOtherEnd = lineGroup.properties.startObjectId;
							if (objectIdAtOtherEnd != -1)
							{
								newVector = new jsgl.Vector2D(lineToUpdate.getEndX(), lineToUpdate.getEndY());
								var otherObject = pageShapes[getShapeIndex(objectIdAtOtherEnd)];
								closestBorderPoint = otherObject.shapeHelper.closestBorderPoint(newVector);
								lineToUpdate.setStartX(closestBorderPoint.location.getX());
								lineToUpdate.setStartY(closestBorderPoint.location.getY());
								lineGroup.properties.startPointVector = new jsgl.Vector2D(closestBorderPoint.location.getX(), closestBorderPoint.location.getY());
							}
						}
						
						//if there is an arrow at the end of the line - remove it from the panel and redraw
						if (lineGroup.properties.endArrowElement != null)
						{
							myPanel.removeElement(lineGroup.properties.endArrowElement);
							var newArrowElement = createArrow(lineToUpdate.getStartX(), lineToUpdate.getStartY(), lineToUpdate.getEndX(), lineToUpdate.getEndY());										
							lineGroup.properties.endArrowElement = newArrowElement;
							myPanel.addElement(newArrowElement);
						}
						
						//if there is an arrow at the start of the line - remove it from the panel and redraw
						if (lineGroup.properties.startArrowElement != null)
						{
							myPanel.removeElement(lineGroup.properties.startArrowElement);
							var newArrowElement = createArrow(lineToUpdate.getEndX(), lineToUpdate.getEndY(), lineToUpdate.getStartX(), lineToUpdate.getStartY());										
							lineGroup.properties.startArrowElement = newArrowElement;
							myPanel.addElement(newArrowElement);
						}
						
						//update the location of the text of the line (if any)															
						var centerPoint = lineGroup.shapeHelper.getCenterPoint();
						for (var lblIdx = 2; lblIdx < lineGroup.getElementsCount(); lblIdx++)
						{
							lineGroup.getElementAt(lblIdx).setX(centerPoint.getX());
							//for the y location - as there could be multiple lines - we just want to adjust the y location by the change between the old y and 
							//the new y - this will keep the label at the same relative location above/below the line
							var origY = lineGroup.getElementAt(lblIdx).getY();
							lineGroup.getElementAt(lblIdx).setY(origY + (centerPoint.getY() - origY));
						}
					}
				}
			}	
		}
	}	
	
	//by default all shapes are in a group with the center of 0,0 - lines are unique in that the line is not in a group centered at the center of the line (but is 
	//positioned as an offset from 0,0 - ie, the group is at 0,0, while the line's x/y are some values greater
	ShapeHelper.prototype.getCenterPoint = function()
	{
		return new jsgl.Vector2D(0,0);			
	}
	
	//returns the vector of the center of the shape's group in terms of the entire panel
	ShapeHelper.prototype.getLocationXY = function() 
	{
		return this.currentShape.getLocation();
	}
	
	//returns the Y axis location for the shape's group container
	ShapeHelper.prototype.getLocationY = function() 
	{
		return this.currentShape.getY();
	}
	
	//returns the X axis location for the shape's group container
	ShapeHelper.prototype.getLocationX = function() 
	{
		return this.currentShape.getX();
	}
	
	//this method creates the sequence label element
	ShapeHelper.prototype.addSequence = function ()
	{
		//remove the sequence label if there
		if (this.currentShape.getElementsCount() >= 2)
		{
			this.currentShape.removeElement(this.currentShape.getElementAt(l));
		}
		
		var seqLabel = myPanel.createLabel();
		seqLabel.setText(this.currentShape.properties.sequenceNumber);
		seqLabel.setBold(true);
		seqLabel.setFontSize(12);
			
		seqLabel.setX(0);
		seqLabel.setY(this.currentShape.properties.getSequenceYOffset());
		seqLabel.setHorizontalAnchor(jsgl.HorizontalAnchor.CENTER);					
		this.currentShape.addElement(seqLabel);
			
	}
	
	//this method will create 1+ label entries for the circle to hold the incoming text.
	//the incoming text can have line breaks - each break will get its own label
	//the labels will start as the 3rd element of the containing group list
	ShapeHelper.prototype.setText = function(pText)
	{
		this.currentShape.properties.shapeText = pText;
		var labelArray = pText.split('\n');

		//if this shape has a drillwdown - put the drill down title above the shape text
		if (this.currentShape.properties.drillDownPageId != -1) {
		
			labelArray.unshift(this.currentShape.properties.drillDownPageTitle);
		}
						
		//each label is 14 px tall. 
		var fontHeight = 14;
		
		//determine how many labels will be needed
		var labelCnt = labelArray.length;
		
		//Determine how many labels are needed above the center point
		var labelCountAboveCenter = Math.floor( labelCnt / 2);
		
		//set yIndex above the center point
		var yIndex = fontHeight * labelCountAboveCenter * -1;

		//clear out any existing labels - from last to first
		for (var l = this.currentShape.getElementsCount() - 1; l > 1; l--)
		{
			this.currentShape.removeElement(this.currentShape.getElementAt(l));
		}
		
		//create new labels
		for (var l = 0; l < labelArray.length; l++)
		{
			var seqTitle = myPanel.createLabel();
			seqTitle.setText(labelArray[l]);
			seqTitle.setBold(true);
			seqTitle.setFontSize(12);
			
			//if this shape links to another page, then display the text as a hyperlink
			if (this.currentShape.properties.drillDownPageId != -1)
			{
				seqTitle.setUnderlined(true);
				seqTitle.setFontColor("rgb(0,0,255)");
			}
			
			//on page connectors also display as a hyperlink
			if (this.currentShape.shape == "onConnector")
			{
				seqTitle.setUnderlined(true);
				seqTitle.setFontColor("rgb(0,0,255)");
			}
			
			var centerPoint = this.currentShape.shapeHelper.getCenterPoint();
		
			seqTitle.setX(centerPoint.getX());
			seqTitle.setY(centerPoint.getY() + yIndex);		
			
			seqTitle.setVerticalAnchor(jsgl.VerticalAnchor.CENTER);
			seqTitle.setHorizontalAnchor(jsgl.HorizontalAnchor.CENTER);					
			this.currentShape.addElement(seqTitle);
			
			//slide the next label down
			yIndex += fontHeight;
		}
	}

	//each border point will be an object of : {location: Vector2D, linkedLines: [ {lineId: number, startEndInd: 'S' or 'E'}]}
	//return the entry that is the closest border point to the incoming x,y value. 
	ShapeHelper.prototype.closestBorderPoint = function(vector)
	{
		var shortestLength = 9999;
		var shortestBorderLocation = -1;
		for (var i = 0; i < this.currentShape.properties.borderPoints.length; i++)
		{   
			var borderVector = this.currentShape.properties.borderPoints[i].location;
			var thisLength = Math.sqrt(Math.pow(borderVector.getX() - vector.getX(),2) + Math.pow(borderVector.getY() - vector.getY(),2));
			if ( thisLength < shortestLength)
			{
				shortestLength = thisLength;
				shortestBorderLocation = i;
				
			};
		};
		
		return this.currentShape.properties.borderPoints[shortestBorderLocation];
	};
	
	//remove the link between this shape and a child shape
	ShapeHelper.prototype.removeDrillDown = function() 
	{
		this.currentShape.properties.drillDownPageId = -1;
		this.currentShape.properties.drillDownPageTitle = "";
		//tis will reset the text of the shape to the shape text (if present)
		this.setText(this.currentShape.properties.shapeText);

	}

	function GroupSelectHelper(shape)
	{
		this.currentShape = shape;
	}
	
	GroupSelectHelper.prototype = Object.create(ShapeHelper.prototype);
	
	GroupSelectHelper.prototype.boundriesSet = function()
	{
		var bset = false;
		if (this.currentShape.properties.endX != -1)
		{
			bset = true;
		}
		
		return bset;
	}
	
	//determine if a given x/y location is within the boundries of the group selector
	GroupSelectHelper.prototype.isPointInsideShape = function(locationX, locationY)
	{
		var inShape = false;

		if (this.boundriesSet())
		{
			//set the min/max values for the group 
			var minX = Math.min(this.currentShape.properties.startX, this.currentShape.properties.endX);
			var	maxX = Math.max(this.currentShape.properties.startX, this.currentShape.properties.endX);
			var	minY = Math.min(this.currentShape.properties.startY, this.currentShape.properties.endY);
			var	maxY = Math.max(this.currentShape.properties.startY, this.currentShape.properties.endY);
		
			if ((locationX >= minX) && (locationX <= maxX) && 
			(locationY >= minY) && (locationY <= maxY)) 
			{
				inShape = true;
			}
		}

		return inShape;
	}

	//returns a jsgl.Vector2D that is the center of the group select
	GroupSelectHelper.prototype.getCenterPoint = function()
	{
			//set the min/max values for the group 
			var minX = Math.min(this.currentShape.properties.startX, this.currentShape.properties.endX);
			var	maxX = Math.max(this.currentShape.properties.startX, this.currentShape.properties.endX);
			var	minY = Math.min(this.currentShape.properties.startY, this.currentShape.properties.endY);
			var	maxY = Math.max(this.currentShape.properties.startY, this.currentShape.properties.endY);
		
			return new jsgl.Vector2D(((maxX - minX) / 2) + minX, ((maxY - minY) / 2) + minY);
	}
	
	//this function finds all the shapes that are within the boundries of the group and adds them to the group's managedShapes list
	GroupSelectHelper.prototype.selectShapes = function()
	{
		this.currentShape.properties.managedShapes = [];
		
		//spin through all shapes on the page and find those whose center point is within the boundries of the group select
		for (var shapeIdx = 0; shapeIdx < pageShapes.length; shapeIdx++)
		{
			if (this.isPointInsideShape(pageShapes[shapeIdx].shapeHelper.getLocationX(), pageShapes[shapeIdx].shapeHelper.getLocationY()))
			{
				this.currentShape.properties.managedShapes.push(pageShapes[shapeIdx]);
				
				//change the shape to green
				var innerShape = pageShapes[shapeIdx].getElementAt(0);	
				innerShape.getStroke().setColor('green');
			}	
		}		
	}
	
	//when the group is moved after shapes are selected - this method will move all shapes within the group
	GroupSelectHelper.prototype.moveShapes = function(eventArgs)
	{
		//each shape within the group will have its center moved. Lines however will not be adjusted - instead, the logic that moves 
		//a given shape will then adjust the connected line(s)
		var xAdj = this.currentShape.properties.startX - this.currentShape.properties.originalStartX ;
		var yAdj = this.currentShape.properties.startY - this.currentShape.properties.originalStartY;
		
		for (var idx = 0; idx < this.currentShape.properties.managedShapes.length; idx++)
		{
			 //move the shape
			 this.currentShape.properties.managedShapes[idx].setLocationXY(this.currentShape.properties.managedShapes[idx].getX() + xAdj, 
																		   this.currentShape.properties.managedShapes[idx].getY() + yAdj);
			 
			 //we need to update all the border points of the circle
			this.currentShape.properties.managedShapes[idx].properties.resetBorderPoints();				 
		
			//adjust any attached lines
			this.currentShape.properties.managedShapes[idx].shapeHelper.adjustLinkedLines();
		}
	}
	
	//when the user hits 'escape' after moving a group of selected shapes - this will clear the selection
	GroupSelectHelper.prototype.releaseShapes = function()
	{
		for (var shapeIdx = 0; shapeIdx < this.currentShape.properties.managedShapes.length; shapeIdx++)
		{
			//change the shape to back to blue
			var innerShape = this.currentShape.properties.managedShapes[shapeIdx].getElementAt(0);	
			innerShape.getStroke().setColor("rgb(0,0,255)");
		}
		
	}
	
	//when the user hits 'delete' - delete all shapes
	GroupSelectHelper.prototype.deleteShapes = function()
	{
		for (var shapeIdx = this.currentShape.properties.managedShapes.length - 1; shapeIdx >= 0; shapeIdx--)
		{
			deleteShape(this.currentShape.properties.managedShapes[shapeIdx]);			
			this.currentShape.properties.managedShapes.splice(shapeIdx,1);			
		}		
	}
	
	function CircleShapeHelper(shape)
	{
		this.currentShape = shape;
	}

	CircleShapeHelper.prototype = Object.create (ShapeHelper.prototype);
	
		//determine if the incoming x,y location falls within the circle
	CircleShapeHelper.prototype.isPointInsideShape = function(pointX, pointY)
	{
		//find distance between center of circle and point
		var distance = Math.sqrt( Math.pow((pointX - this.currentShape.getX()),2) + Math.pow((pointY - this.currentShape.getY()),2) );
		
		//if distance < cirlce radius, then point is inside circle
		//if distance = radius, then point is on circle border
		//if distance > circle radius, point is outside of circle
		
		//note: circles are held in a group object and are the first element
		if (distance < this.currentShape.getElementAt(0).getRadius())
		{
			return true;
		}
		else
		{
			return false;
		};
	};
		
		
		//if the shape is being rezied - we need to redraw the circle and adjust the border points
		//the incoming x/y are the locations of the mouse
	CircleShapeHelper.prototype.resize = function(pX, pY)
	{
		//determine distance to center of circle - this will be our new radius
		var newRadius = Math.sqrt(Math.pow(this.currentShape.getX() - pX,2) + Math.pow(this.currentShape.getY() - pY,2));
		
		//update the radius which will trigger a repaint of the circle
		this.currentShape.getElementAt(0).setRadius(newRadius);
		
		//reset the border points
		this.currentShape.properties.resetBorderPoints();
		
		defaultRadius = newRadius;
	}
	  
	function OffPageShapeHelper(shape)
	{
		this.currentShape = shape;
	}
	
	OffPageShapeHelper.prototype = Object.create(ShapeHelper.prototype);
	
		//determine if the incoming x,y location falls within the diamond
	OffPageShapeHelper.prototype.isPointInsideShape = function(pointX, pointY)
	{
		var isInside = false;

		var polygon = [];
		
		 for (var n = 0; n < this.currentShape.properties.borderPoints.length; n++) {
			
			var point = {x:  this.currentShape.properties.borderPoints[n].location.getX(),
						 y:  this.currentShape.properties.borderPoints[n].location.getY()};
						 
			polygon.push(point);
		 }
		 
		var minX = polygon[0].x, maxX = polygon[0].x;
		var minY = polygon[0].y, maxY = polygon[0].y;
		for (var n = 1; n < polygon.length; n++) {
			var q = polygon[n];
			minX = Math.min(q.x, minX);
			maxX = Math.max(q.x, maxX);
			minY = Math.min(q.y, minY);
			maxY = Math.max(q.y, maxY);
		}

		if (pointX >= minX && pointX <= maxX && pointY >= minY && pointY <= maxY) {
			isInside = true;
		}
		
		return isInside;
	
	};
	
	  
	function DiamondShapeHelper(shape)
	{
		this.currentShape = shape;
	}

	DiamondShapeHelper.prototype = Object.create(ShapeHelper.prototype);
	
	//determine if the incoming x,y location falls within the diamond
	DiamondShapeHelper.prototype.isPointInsideShape = function(pointX, pointY)
	{
		var isInside = false;

		var polygon = [];
		
		 for (var n = 0; n < this.currentShape.properties.borderPoints.length; n++) {
			
			var point = {x:  this.currentShape.properties.borderPoints[n].location.getX(),
						 y:  this.currentShape.properties.borderPoints[n].location.getY()};
						 
			polygon.push(point);
		 }
		 
		var minX = polygon[0].x, maxX = polygon[0].x;
		var minY = polygon[0].y, maxY = polygon[0].y;
		for (var n = 1; n < polygon.length; n++) {
			var q = polygon[n];
			minX = Math.min(q.x, minX);
			maxX = Math.max(q.x, maxX);
			minY = Math.min(q.y, minY);
			maxY = Math.max(q.y, maxY);
		}

		if (pointX >= minX && pointX <= maxX && pointY >= minY && pointY <= maxY) {
			isInside = true;
		}
		
		return isInside;
	
	};
		
		
	//this is a helper method the the resize function. the incoming values are where the user clicked on the screen. We
	//need to determine if the incoming point is inside/outside of of the diamond, and also what is the intended adjustment size of the diamond
	DiamondShapeHelper.prototype.resizeFactor = function(pX, pY) 
	{		
		var polygon = [];
		
		//build a list of the points
		for (var n = 0; n < this.currentShape.properties.borderPoints.length; n++) {
			
			var point = {x:  this.currentShape.properties.borderPoints[n].location.getX(),
						 y:  this.currentShape.properties.borderPoints[n].location.getY()};
					 
			polygon.push(point);
		}
		 
		//and see of the points the user clicked closest to
		var minX = polygon[1].x, maxX = polygon[1].x;
		var minY = polygon[1].y, maxY = polygon[1].y;
		for (var n = 0; n < polygon.length; n++) {
			var q = polygon[n];
			minX = Math.min(q.x, minX);
			maxX = Math.max(q.x, maxX);
			minY = Math.min(q.y, minY);
			maxY = Math.max(q.y, maxY);
		}

		var adjustX = 0;
		var adjustY = 0;
		
		if (pX > maxX)
		{
			adjustX = pX - maxX;
			adjustY = adjustX * .66;
			
		}
		else if (pX < minX)
		{
			adjustX = minX - pX;
			adjustY = adjustX * .66;

		}
		else if (pY < minY)
		{	
			adjustY = minY - pY;
			adjustX = adjustY * 1.5;
		}	
		else if (pY > maxY)
		{
			adjustY = pY - maxY;
			adjustX = adjustY * 1.5;
		}
		//we are inside the shape - find which border we are closest to
		else
		{
			var lb = pX - minX;
			var rb = maxX - pX;
			var tb = pY - minY ;
			var bb = maxY - pY;
		
			var lbOrrbVal = 0;							
			var tbOrbbVal = 0;
			
			if (lb < rb)
			{				
				lbOrrbVal = lb;
			}
			else
			{					
				lbOrrbVal = rb;
			}
			if (tb < bb)
			{				
				tbOrbbVal = tb;
			}
			else
			{				
				tbOrbbVal = bb;
			}
			
			if (lbOrrbVal < tbOrbbVal)
			{
				adjustX = lbOrrbVal * -1;
				adjustY = .66 * adjustX;
			}
			else
			{
				adjustY =  -1 * tbOrbbVal;
				adjustX = 1.5 * adjustY;
			}				
		}
		
		var newAdjust = new jsgl.Vector2D();
		newAdjust.setX(adjustX * 2);
		newAdjust.setY(adjustY * 2);
		
		return newAdjust;

	}
		
	//if the diamond is being rezied - we need to redraw the diamond and adjust the border points
	//the incoming x/y are the locations of the mouse
	DiamondShapeHelper.prototype.resize = function(pX, pY)
	{
			
		var adjustVector = this.resizeFactor(pX, pY);
		
		var newWidth = this.currentShape.properties.getWidth() + adjustVector.getX();
		var newHeight = this.currentShape.properties.getHeight() + adjustVector.getY();
		
		this.currentShape.properties.setWidth(newWidth);
		this.currentShape.properties.setHeight(newHeight);
		
		//for the diamond - we need to clear and reset the border points
		var diamond = this.currentShape.getElementAt(0);
		diamond.clearPoints();
		diamond.addPointXY(0, 0 - (this.currentShape.properties.getHeight() / 2));
		diamond.addPointXY(0 + (this.currentShape.properties.getWidth() / 2), 0);
		diamond.addPointXY(0, 0 + (this.currentShape.properties.getHeight() / 2));
		diamond.addPointXY(0 - (this.currentShape.properties.getWidth() / 2), 0);
		
		//reset the border points
		this.currentShape.properties.resetBorderPoints();
		
	}
	  
	function SquareShapeHelper(shape)
	{
		this.currentShape = shape;
	}
	
	SquareShapeHelper.prototype = Object.create (ShapeHelper.prototype);
	
	//determine if the incoming x,y location falls within the square
	SquareShapeHelper.prototype.isPointInsideShape = function(pointX, pointY)
	{
		var isInside = false;

		var polygon = [];
		
		//for the square - compare against the corner points only - at locations 1, 3, 5, 7
		 for (var n = 1; n < this.currentShape.properties.borderPoints.length; n++) {
			
			if (n % 2 == 1)
			{
				var point = {x:  this.currentShape.properties.borderPoints[n].location.getX(),
							 y:  this.currentShape.properties.borderPoints[n].location.getY()};
						 
				polygon.push(point);
			}
		 }
		 
		var minX = polygon[1].x, maxX = polygon[1].x;
		var minY = polygon[1].y, maxY = polygon[1].y;
		for (var n = 1; n < polygon.length; n++) {
			var q = polygon[n];
			minX = Math.min(q.x, minX);
			maxX = Math.max(q.x, maxX);
			minY = Math.min(q.y, minY);
			maxY = Math.max(q.y, maxY);
		}

		if (pointX >= minX && pointX <= maxX && pointY >= minY && pointY <= maxY) {
			isInside = true;
		}
		
		return isInside;
	
	};
	
		
	//this is a helper method to the resize function. the incoming values are where the user clicked on the screen. We
	//need to determine if the incoming point is inside/outside of of the square, and also what is the intended adjustment size of the square
	SquareShapeHelper.prototype.resizeFactor = function(pX, pY) 
	{		
		var polygon = [];
		
		//for the square - compare against the corner points only - at locations 1, 3, 5, 7
		for (var n = 1; n < this.currentShape.properties.borderPoints.length; n++) {
			
			if (n % 2 == 1)
			{
				var point = {x:  this.currentShape.properties.borderPoints[n].location.getX(),
							 y:  this.currentShape.properties.borderPoints[n].location.getY()};
						 
				polygon.push(point);
			}
		}
		 
		var minX = polygon[1].x, maxX = polygon[1].x;
		var minY = polygon[1].y, maxY = polygon[1].y;
		for (var n = 1; n < polygon.length; n++) {
			var q = polygon[n];
			minX = Math.min(q.x, minX);
			maxX = Math.max(q.x, maxX);
			minY = Math.min(q.y, minY);
			maxY = Math.max(q.y, maxY);
		}

		var adjustX = 0;
		var adjustY = 0;
		
		if (pX > maxX)
		{
			if (this.currentShape.shape == 'square')
			{
				adjustX = pX - maxX;
				adjustY = adjustX;
			}
			else
			{
				adjustX = pX - maxX;
				adjustY = adjustX * .66;
			}					
		}
		else if (pX < minX)
		{
			if (this.currentShape.shape == 'square')
			{
				adjustX = minX - pX;
				adjustY = adjustX;
			}
			else
			{
				adjustX = minX - pX;
				adjustY = adjustX * .66;
			}
		}
		else if (pY < minY)
		{	
			if (this.currentShape.shape == 'square')
			{
				adjustX = minY - pY;
				adjustY = adjustX;
			}
			else
			{				
				adjustY = minY - pY;
				adjustX = adjustY * 1.5;
			}
		}	
		else if (pY > maxY)
		{
			if (this.currentShape.shape == 'square')
			{
				adjustX = pY - maxY;
				adjustY = adjustX;
			}
			else
			{
				adjustY = pY - maxY;
				adjustX = adjustY * 1.5;
			}
		}
		//we are inside the shape - find which border we are closest to
		else
		{
			var lb = pX - minX;
			var rb = maxX - pX;
			var tb = pY - minY ;
			var bb = maxY - pY;
		
			var lbOrrbVal = 0;							
			var tbOrbbVal = 0;
			
			if (lb < rb)
			{				
				lbOrrbVal = lb;
			}
			else
			{					
				lbOrrbVal = rb;
			}
			if (tb < bb)
			{				
				tbOrbbVal = tb;
			}
			else
			{				
				tbOrbbVal = bb;
			}
			
			if (lbOrrbVal < tbOrbbVal)
			{
				if (this.currentShape.shape == 'square')
				{
					adjustX = lbOrrbVal * -1;
					adjustY = adjustX;
				}
				else
				{
					adjustX = lbOrrbVal * -1;
					adjustY = .66 * adjustX;
				}	
			}
			else
			{
				if (this.currentShape.shape == 'square')
				{
					adjustX = tbOrbbVal * -1;
					adjustY = adjustX;
				}
				else
				{
					adjustY =  -1 * tbOrbbVal;
					adjustX = 1.5 * adjustY;
				}	
			}
			
		}
		
		var newAdjust = new jsgl.Vector2D();
		newAdjust.setX(adjustX * 2);
		newAdjust.setY(adjustY * 2);
		
		return newAdjust;

	}
		
	//if the square is being rezied - we need to redraw the square and adjust the border points
	//the incoming x/y are the locations of the mouse
	SquareShapeHelper.prototype.resize = function(pX, pY)
	{
			
		var adjustVector = this.resizeFactor(pX, pY);
		
		var newWidth = this.currentShape.properties.getWidth() + adjustVector.getX();
		var newHeight = this.currentShape.properties.getHeight() + adjustVector.getY();
		
		this.currentShape.properties.setWidth(newWidth);
		this.currentShape.properties.setHeight(newHeight);
		
		this.currentShape.getElementAt(0).setWidth(newWidth);
		this.currentShape.getElementAt(0).setHeight(newHeight);
		
		//reset the border points
		this.currentShape.properties.resetBorderPoints();
		
	}
	  
	function LineShapeHelper(shape)
	{
		this.currentShape = shape;
	}

	LineShapeHelper.prototype = Object.create (ShapeHelper.prototype);
	
	LineShapeHelper.prototype.isPointInsideShape = function(pointX, pointY)
	{
	
		//to determine if the point is on the line - 
		//find the distance between the two points of the line and compare to the distance between the incoming point and the two ends
		//if the distance is the same, the point is on the line
		var lineLength = Math.sqrt(Math.pow((this.currentShape.properties.endPointVector.getX() - this.currentShape.properties.startPointVector.getX()),2) + 
								  Math.pow((this.currentShape.properties.endPointVector.getY() - this.currentShape.properties.startPointVector.getY()),2));
		
		var startToPoint = Math.sqrt(Math.pow((pointX - this.currentShape.properties.startPointVector.getX()),2) + 
								  Math.pow((pointY - this.currentShape.properties.startPointVector.getY()),2));
		
		var endToPoint = Math.sqrt(Math.pow((pointX - this.currentShape.properties.endPointVector.getX()),2) + 
								  Math.pow((pointY - this.currentShape.properties.endPointVector.getY()),2));
		
		return (Math.round(lineLength) == Math.round(startToPoint + endToPoint));
		
	}
		
	//return the center point of the line
	LineShapeHelper.prototype.getCenterPoint = function()
	{
		var pointX =  this.currentShape.properties.startPointVector.getX() + ((this.currentShape.properties.endPointVector.getX() - this.currentShape.properties.startPointVector.getX()) / 2);
		
		var pointY = this.currentShape.properties.startPointVector.getY() +  ((this.currentShape.properties.endPointVector.getY() - this.currentShape.properties.startPointVector.getY()) / 2);
		
		return new jsgl.Vector2D(pointX, pointY);			
	}
	
	function ElipseShapeHelper(shape)
	{
		this.currentShape = shape;
	}

    ElipseShapeHelper.prototype = Object.create (ShapeHelper.prototype);
	
		//determine if the incoming x,y location falls within the elipse
	ElipseShapeHelper.prototype.isPointInsideShape = function(pointX, pointY)
	{
		var isInside = false;

		var polygon = [];
		
		 for (var n = 0; n < this.currentShape.properties.borderPoints.length; n++) {
	
			var point = {x:  this.currentShape.properties.borderPoints[n].location.getX(),
						 y:  this.currentShape.properties.borderPoints[n].location.getY()};
					 
			polygon.push(point);
		 }
		 
		var minX = polygon[0].x, maxX = polygon[0].x;
		var minY = polygon[0].y, maxY = polygon[0].y;
		for (var n = 1; n < polygon.length; n++) {
			var q = polygon[n];
			minX = Math.min(q.x, minX);
			maxX = Math.max(q.x, maxX);
			minY = Math.min(q.y, minY);
			maxY = Math.max(q.y, maxY);
		}
		
		
		if (pointX >= minX && pointX <= maxX && pointY >= minY && pointY <= maxY) {
			isInside = true;
		}
		
		return isInside;
	
	};
	
		
	//this is a helper method the the resize function. the incoming values are where the user clicked on the screen. We
	//need to determine if the incoming point is inside/outside of of the square, and also what is the intended adjustment size of the square
	ElipseShapeHelper.prototype.resizeFactor = function(pX, pY) 
	{		
		var polygon = [];
		
		//for the square - compare against the corner points only - at locations 1, 3, 5, 7
		for (var n = 0; n < this.currentShape.properties.borderPoints.length; n++) {
			
			var point = {x:  this.currentShape.properties.borderPoints[n].location.getX(),
						 y:  this.currentShape.properties.borderPoints[n].location.getY()};
					 
			polygon.push(point);
		}
		 
		var minX = polygon[1].x, maxX = polygon[1].x;
		var minY = polygon[1].y, maxY = polygon[1].y;
		for (var n = 0; n < polygon.length; n++) {
			var q = polygon[n];
			minX = Math.min(q.x, minX);
			maxX = Math.max(q.x, maxX);
			minY = Math.min(q.y, minY);
			maxY = Math.max(q.y, maxY);
		}

		var adjustX = 0;
		var adjustY = 0;
		
		if (pX > maxX)
		{
			adjustX = pX - maxX;
			adjustY = adjustX * .66;
			
		}
		else if (pX < minX)
		{
			adjustX = minX - pX;
			adjustY = adjustX * .66;

		}
		else if (pY < minY)
		{	
			adjustY = minY - pY;
			adjustX = adjustY * 1.5;
		}	
		else if (pY > maxY)
		{
			adjustY = pY - maxY;
			adjustX = adjustY * 1.5;
		}
		//we are inside the shape - find which border we are closest to
		else
		{
			var lb = pX - minX;
			var rb = maxX - pX;
			var tb = pY - minY ;
			var bb = maxY - pY;
		
			var lbOrrbVal = 0;							
			var tbOrbbVal = 0;
			
			if (lb < rb)
			{				
				lbOrrbVal = lb;
			}
			else
			{					
				lbOrrbVal = rb;
			}
			if (tb < bb)
			{				
				tbOrbbVal = tb;
			}
			else
			{				
				tbOrbbVal = bb;
			}
			
			if (lbOrrbVal < tbOrbbVal)
			{
				adjustX = lbOrrbVal * -1;
				adjustY = .66 * adjustX;
			}
			else
			{
				adjustY =  -1 * tbOrbbVal;
				adjustX = 1.5 * adjustY;
			}				
		}
		
		var newAdjust = new jsgl.Vector2D();
		newAdjust.setX(adjustX * 2);
		newAdjust.setY(adjustY * 2);
		
		return newAdjust;

	}
		
	//if the square is being rezied - we need to redraw the square and adjust the border points
	//the incoming x/y are the locations of the mouse
	ElipseShapeHelper.prototype.resize = function(pX, pY)
	{
			
		var adjustVector = this.resizeFactor(pX, pY);
		
		var newWidth = this.currentShape.properties.getWidth() + adjustVector.getX();
		var newHeight = this.currentShape.properties.getHeight() + adjustVector.getY();
		
		this.currentShape.properties.setWidth(newWidth);
		this.currentShape.properties.setHeight(newHeight);
		
		this.currentShape.getElementAt(0).setWidth(newWidth);
		this.currentShape.getElementAt(0).setHeight(newHeight);
		
		//reset the border points
		this.currentShape.properties.resetBorderPoints();
		
	}

	//this is the 'base class' for the shape eventhanders
	function ShapeEventHandler(shape)
	{
		this.activeShape = shape;
	}
	
	ShapeEventHandler.prototype.init = function() {
		   	
		this.activeShape.addMouseDownListener(function(eventArgs) {		        
				eventArgs.getSourceElement().container.shapeEventHandler.mouseDownListener(eventArgs);
		});
		
		this.activeShape.addClickListener(function(eventArgs) {		   
			eventArgs.getSourceElement().container.shapeEventHandler.clickListener(eventArgs);
		});
		
	   this.activeShape.addDoubleClickListener(function(eventArgs) {		   
			eventArgs.getSourceElement().container.shapeEventHandler.doubleClickListener(eventArgs);
		});
		
	   this.activeShape.addMouseMoveListener(function(eventArgs) {		        
			eventArgs.getSourceElement().container.shapeEventHandler.mouseMoveListener(eventArgs);
		});
		
	   this.activeShape.addMouseUpListener(function(eventArgs) {				
			eventArgs.getSourceElement().container.shapeEventHandler.mouseUpListener(eventArgs);
		});
	   
	   this.activeShape.addMouseOverListener(function(eventArgs) {				
			eventArgs.getSourceElement().container.shapeEventHandler.mouseOverListener(eventArgs);
		});
		
		this.activeShape.addMouseOutListener(function(eventArgs) {				
			eventArgs.getSourceElement().container.shapeEventHandler.mouseOutListener(eventArgs);
		});
			
	};
	
	ShapeEventHandler.prototype.mouseOverListener = function(eventArgs)
	{
		//change the shape to a red border
		var innerShape = this.activeShape.getElementAt(0);	
		innerShape.getStroke().setColor("rgb(255,0,0)");	
	}
			
	ShapeEventHandler.prototype.mouseMoveListener = function (eventArgs)
	{
		if (this.activeShape.isActive && !resizeTriggered)
		{	
			this.activeShape.setLocationXY(eventArgs.getX(), eventArgs.getY());
			this.activeShape.properties.showHover = false;
		}
	};
	
	ShapeEventHandler.prototype.mouseOutListener = function(eventArgs)
	{
		//restore border color			
		var innerShape = this.activeShape.getElementAt(0);	
		innerShape.getStroke().setColor("rgb(0,0,255)");
		
		//and hide the hover popup
		hoverShapeDialog.dialog("close");
	}
	ShapeEventHandler.prototype.clickListener = function(eventArgs)
	{
	
		//when dragging this shape, the click gets triggered when done - we don't want to show the hover at this time
		if (this.activeShape.properties.showHover == true)
		{
			var isOpen = $("#hoverShape").dialog("isOpen");
			if (!isOpen)
			{
				//and display the info popup
				getController().setCurrentShape(this.activeShape);
				hoverShapeDialog.dialog("open");	
			}
			else
			{
				hoverShapeDialog.dialog("close");	
			}
		}
		else
		{
			this.activeShape.properties.showHover = true;
		}
	}
	
	function GroupSelectEventHandler(shape)
	{
		this.activeShape = shape;	

		this.activeShape.addMouseDownListener(function(eventArgs) {		        
				eventArgs.getSourceElement().shapeEventHandler.mouseDownListener(eventArgs);
		});
		
	    this.activeShape.addMouseMoveListener(function(eventArgs) {		        
			eventArgs.getSourceElement().shapeEventHandler.mouseMoveListener(eventArgs);
		});
		
	   this.activeShape.addMouseUpListener(function(eventArgs) {				
			eventArgs.getSourceElement().shapeEventHandler.mouseUpListener(eventArgs);
		});	   		
	}
	
	GroupSelectEventHandler.prototype.mouseDownListener = function(eventArgs)
	{
		//if we don't have the end x/y then the user is just starting to draw the group
		if (!this.activeShape.shapeHelper.boundriesSet())
		{
			this.activeShape.properties.originalX = eventArgs.getX();
			this.activeShape.properties.originalY = eventArgs.getY();
			this.activeShape.properties.startX = eventArgs.getX();
			this.activeShape.properties.startY = eventArgs.getY();
			this.activeShape.properties.isDrawing = true;
		}		
		else if (!penClaimed())
		{
			claimPen(this.activeShape, 'gropuSelect.mouseDown');
			this.activeShape.properties.originalX = eventArgs.getX();
			this.activeShape.properties.originalY = eventArgs.getY();
			this.activeShape.properties.originalStartX = this.activeShape.properties.startX;
			this.activeShape.properties.originalStartY = this.activeShape.properties.startY;
		}
	}
		
	GroupSelectEventHandler.prototype.mouseMoveListener = function (eventArgs)
	{
		
		//if we are drawing - then just update the size of the group
		if (this.activeShape.properties.isDrawing)
		{
			
			this.activeShape.clearPoints();
			
			this.activeShape.addPointXY(this.activeShape.properties.startX,  this.activeShape.properties.startY);
			this.activeShape.addPointXY(eventArgs.getX(),  this.activeShape.properties.startY);
			this.activeShape.addPointXY(eventArgs.getX(), eventArgs.getY());
			this.activeShape.addPointXY(this.activeShape.properties.startX,  eventArgs.getY());
		}
		//if the boundries are set, then we are moving the group - so we need to adjust the boundry of the group (we'll try moving all shapes later)
		else if(this.activeShape.shapeHelper.boundriesSet() && this.activeShape.isActive)
		{
			
			//how much did the group move?
			var xAdj = eventArgs.getX() - this.activeShape.properties.originalX;
			var yAdj = eventArgs.getY() - this.activeShape.properties.originalY;
			
			var newStartX = this.activeShape.properties.startX + xAdj;
			var newStartY = this.activeShape.properties.startY + yAdj;
			var newEndX = this.activeShape.properties.endX + xAdj;
			var newEndY = this.activeShape.properties.endY + yAdj;
			
			//update the new start/end x/y
			this.activeShape.properties.startX = newStartX;
			this.activeShape.properties.startY = newStartY;
			this.activeShape.properties.endX = newEndX;
			this.activeShape.properties.endY = newEndY;
			
			this.activeShape.properties.originalX = eventArgs.getX();
			this.activeShape.properties.originalY = eventArgs.getY();
			
			
			//redraw boundries
			this.activeShape.clearPoints();
			
			this.activeShape.addPointXY(this.activeShape.properties.startX,  this.activeShape.properties.startY);
			this.activeShape.addPointXY(this.activeShape.properties.endX,  this.activeShape.properties.startY);
			this.activeShape.addPointXY(this.activeShape.properties.endX, this.activeShape.properties.endY);
			this.activeShape.addPointXY(this.activeShape.properties.startX,  this.activeShape.properties.endY);
		}

	};
	
	GroupSelectEventHandler.prototype.mouseUpListener = function(eventArgs)
	{		
		//if we are drawing the boundries of the group, then we need
		//to gather all the shapes within the boundreis
		if (this.activeShape.properties.isDrawing)
		{
			this.activeShape.properties.endX = eventArgs.getX();
			this.activeShape.properties.endY = eventArgs.getY();
			
			this.activeShape.shapeHelper.selectShapes();
			this.activeShape.properties.isDrawing = false;
			
			releasePen(this.activeShape, 'groupSelect.mouseUp');
		}
		//we were moving the group selector - so now we need to redraw all the nested shapes
		else if (this.activeShape.isActive)					
		{
			
			this.activeShape.shapeHelper.moveShapes(eventArgs);	
			releasePen(this.activeShape, 'groupSelect.mouseUp');
		}
	}
	
	function CircleShapeEventHandler(shape)
	{
		this.activeShape = shape;	
		this.init();
	}

	CircleShapeEventHandler.prototype = Object.create (ShapeEventHandler.prototype);
			   	
    CircleShapeEventHandler.prototype.mouseDownListener = function(eventArgs)
    {
		//is this the creation of the circle - the initial placement
		if (this.activeShape.getElementsCount() == 0)
		{
			//create main shape
			newCircle = myPanel.createCircle();							
			this.activeShape.setLocationXY(eventArgs.getX(), eventArgs.getY());
			newCircle.setRadius(this.activeShape.properties.getRadius());
			newCircle.getStroke().setWeight(1);
			newCircle.getStroke().setColor("rgb(0,0,255)");
			this.activeShape.addElement(newCircle);	
			this.activeShape.properties.setBorderPoints();
			this.activeShape.shapeHelper.addSequence();
			
			
			releasePen(this.activeShape, 'circle.mouseDown');
			//we are dropping the circle on the panel, so don't active it
		}
		//we are selecting an existing circle - so active it
		else if (!penClaimed())
		{
			claimPen(this.activeShape, 'circle.mouseDown');
								
		}	
	};
		
	CircleShapeEventHandler.prototype.mouseUpListener = function (eventArgs)
	{		
		 this.activeShape.isActive = false;
		 
		 //we need to update all the border points of the circle
		 this.activeShape.properties.resetBorderPoints();				 
		
		//adjust any attached lines
		this.activeShape.shapeHelper.adjustLinkedLines();
		
		releasePen(this.activeShape, 'circle.mouseUp');
	};
	
	  
	function OffPageEventHandler(shape)
	{
	   this.activeShape = shape;
	   this.init();
	}

	OffPageEventHandler.prototype = Object.create(ShapeEventHandler.prototype);
			
   OffPageEventHandler.prototype.mouseDownListener = function(eventArgs)
   {	
		//is this the creation of the shape - the initial placement
		if (this.activeShape.getElementsCount() == 0)
		{
			newShape = myPanel.createPolygon();		
			newShape.getStroke().setWeight(1);
			newShape.getStroke().setColor("rgb(255,255,255)");
			this.activeShape.setX(eventArgs.getX());
			this.activeShape.setY(eventArgs.getY());					
			this.activeShape.addElement(newShape);						
			this.activeShape.properties.setBorderPoints();
			
			newShape.addPointXY( 0 + (this.activeShape.properties.getWidth() / 2), 0 - (this.activeShape.properties.getHeight() / 2));
			newShape.addPointXY( 0 + (this.activeShape.properties.getWidth() / 2), 0);
			newShape.addPointXY( 0, 0 + (this.activeShape.properties.getHeight() / 2));
			newShape.addPointXY( 0 - (this.activeShape.properties.getWidth() / 2), 0);
			newShape.addPointXY( 0 - (this.activeShape.properties.getWidth() / 2), 0 - (this.activeShape.properties.getHeight() / 2));
			
			this.activeShape.shapeHelper.addSequence();
			
			releasePen(this.activeShape, 'offpage.mouseDown');
			//we are dropping the shape on the panel, so don't active it
		}
		//we are selecting an existing circle - so active it
		else if (!penClaimed())
		{
			claimPen(this.activeShape, 'offpage.mouseDown');
							
		}	
	};

	OffPageEventHandler.prototype.doubleClickListener = function(eventArgs)
	{
	  if (this.activeShape.properties.pageTitle == "")
	  {
		alert('noplace to go yet - no page defined');
	  }
	  else
	  {
		alert ('pretend you just went to the ' + this.activeShape.properties.pageTitle + ' page');
	  }
	};
			
	OffPageEventHandler.prototype.mouseUpListener = function (eventArgs)
	{	
		 this.activeShape.isActive = false;
		 
		 //we need to update all the border points of the diamond
		this.activeShape.properties.resetBorderPoints();
		
		//adjust any attached lines
		this.activeShape.shapeHelper.adjustLinkedLines();
		
		releasePen(this.activeShape, 'offPage.mouseUp');			
	  }
	  
	function DiamondShapeEventHandler(shape)
	{
		this.activeShape = shape;
		this.init();
	}
	
	DiamondShapeEventHandler.prototype = Object.create(ShapeEventHandler.prototype);
			
    DiamondShapeEventHandler.prototype.mouseDownListener = function(eventArgs)
    {
		//is this the creation of the diamond - the initial placement
		if (this.activeShape.getElementsCount() == 0)
		{
			newDiamond = myPanel.createPolygon();		
			newDiamond.getStroke().setWeight(1);
			newDiamond.getStroke().setColor("rgb(0,0,255)");
			newDiamond.addPointXY(0, 0 - 50);
			newDiamond.addPointXY(0 + 75, 0);
			newDiamond.addPointXY(0, 0 + 50);
			newDiamond.addPointXY(0 - 75, 0);
			
			this.activeShape.setX(eventArgs.getX());
			this.activeShape.setY(eventArgs.getY());
			
			this.activeShape.addElement(newDiamond);	
			this.activeShape.properties.setWidth(150);
			this.activeShape.properties.setHeight(100);
			this.activeShape.properties.setBorderPoints();
			
			this.activeShape.shapeHelper.addSequence();
			
			releasePen(this.activeShape, 'diamond.mouseDown');
			//we are dropping the diamone on the panel, so don't active it
		}
		//we are selecting an existing circle - so active it
		else if (!penClaimed())
		{
			claimPen(this.activeShape, 'diamond.mouseDown');					
							
		}	
	};
		
	DiamondShapeEventHandler.prototype.mouseUpListener = function (eventArgs)
	{
		
		 this.activeShape.isActive = false;
		 
		 //we need to update all the border points of the diamond
		 this.activeShape.properties.resetBorderPoints();
		
		//adjust any attached lines
		this.activeShape.shapeHelper.adjustLinkedLines();				
		
		releasePen(this.activeShape, 'diamond.mouseUp');
	};
	  
	function LineShapeEventHandler(shape)
	{
			this.activeShape = shape;
		    this.lineDown = false;
			this.init();
	}
	
	LineShapeEventHandler.prototype = Object.create(ShapeEventHandler.prototype);
			
	LineShapeEventHandler.prototype.mouseDownListener = function (eventArgs)
	{
	   //is this the creation of the line - the initial placement
		if (this.activeShape.getElementsCount() == 0)
		{
			newLine = myPanel.createLine();	
			this.activeShape.setLocationXY(0,0);
			newLine.setStartPointXY(eventArgs.getX(),eventArgs.getY());
			newLine.setEndPointXY(eventArgs.getX(),eventArgs.getY());
			this.activeShape.addElement(newLine);
			
			//create a sequence container - but not use for lines
			var seqLabel = myPanel.createLabel();
			this.activeShape.addElement(seqLabel);
			
			//the text element will be created when the line is completed - at this point, we don't know where the
			//center of the line is - see the MouseUpListener method
			this.activeShape.properties.startPointVector = new jsgl.Vector2D(eventArgs.getX(),eventArgs.getY());
			
			this.activeShape.isActive = true;
			this.lineDown = true;
		}
		//we are selecting an existing lineso active it
		else if (!penClaimed())
		{
			claimPen(this.activeShape, 'line.mouseDown');					
								
		}	
	};
		   
		
	LineShapeEventHandler.prototype.mouseMoveListener = function(eventArgs)
	{
		if (this.lineDown)
		{
			lineElement = this.activeShape.getElementAt(0);
			lineElement.setEndX(eventArgs.getX());
			lineElement.setEndY(eventArgs.getY());
			var myStroke = new jsgl.stroke.SolidStroke();	
			myStroke.setWeight(2);
			lineElement.setStroke(myStroke); 	
		};
	};
			
	LineShapeEventHandler.prototype.mouseUpListener = function (eventArgs)
	{
		//if we aren't drawing - but the user just clicked on the line - kick out
		if (this.lineDown)
		{
			this.activeShape.properties.endPointVector = new jsgl.Vector2D(eventArgs.getX(),eventArgs.getY());
			
			this.lineDown = false;
			releasePen(this.activeShape, 'line.mouseUp');
			
			var startShapeId = -1;
			var endShapeId = -1;
			
			//test - see if the mouse started or ended in a shape. 
			for (var i = 0; i < pageShapes.length; i++)
			{			
				if (pageShapes[i].shape != 'line')
				{
					//if the line started in an object
					if (pageShapes[i].shapeHelper.isPointInsideShape(this.activeShape.properties.startPointVector.getX(), this.activeShape.properties.startPointVector.getY()))
					{
						startShapeId = i;
						break;
					}
				}
			}
			
			//test - see if the mouse ended in a shape
			for (var i = 0; i < pageShapes.length; i++)
			{
				
				if (pageShapes[i].shape != 'line')
				{
					if (pageShapes[i].shapeHelper.isPointInsideShape(eventArgs.getX(), eventArgs.getY()))
					{
						endShapeId = i;
						break;
					}
				}
			}
			
			//if the line doesn't start and end on a shape - then it is deleted - no dangling lines in this tool
			if ((startShapeId == -1) || (endShapeId == -1))
			{
				myPanel.removeElement(this.activeShape);
				pageShapes.splice(getShapeIndex(this.activeShape.id), 1);			
			}
			else
			{
				var lineElement = this.activeShape.getElementAt(0);
				
				//find out which of the points on the shape are closest to the starting point, we will then set the start
				//of the line to that border point
				var newVector = new jsgl.Vector2D(this.activeShape.properties.startPointVector.getX(), this.activeShape.properties.startPointVector.getY());
				var closestBorderPoint = pageShapes[startShapeId].shapeHelper.closestBorderPoint(newVector);
				
				lineElement.setStartX(closestBorderPoint.location.getX());
				lineElement.setStartY(closestBorderPoint.location.getY());
				
				//link this line to this border point - when the circle/diamond moves - we'll need to know which lines to adjust
				var lineInfo = {lineId: this.activeShape.id, startEndInd: 'S', linkedShapeId: pageShapes[endShapeId].id };
				
				closestBorderPoint.linkedLines.push(lineInfo);
				
				//set the border points on the line as well as what object the line is linked to
				this.activeShape.properties.startPointVector = new jsgl.Vector2D(closestBorderPoint.location.getX(), closestBorderPoint.location.getY());
				this.activeShape.properties.startObjectId = pageShapes[startShapeId].id;

				//if the arrow type is 'two way connector' then draw an arrowhead on the from side
				if (this.activeShape.properties.relationshipType == 'two way connector')
				{
					//draw an arrow at the start of the line
					var arrowElement = createArrow(lineElement.getEndX(),
								   lineElement.getEndY(),
								   lineElement.getStartX(),
								   lineElement.getStartY());
								   
					this.activeShape.properties.startArrowElement = arrowElement;
					myPanel.addElement(arrowElement);					   
				}
			
				//find out which of the points on the circle/diamond are closest to the starting point, we will then set the end 
				//of the line to that border point
				var newVector = new jsgl.Vector2D(eventArgs.getX(), eventArgs.getY());
				var closestBorderPoint = pageShapes[endShapeId].shapeHelper.closestBorderPoint(newVector);
				lineElement.setEndX(closestBorderPoint.location.getX());
				lineElement.setEndY(closestBorderPoint.location.getY());
				
				//link this line to this border point - when the circle moves - we'll need to know which lines to adjust
				var lineInfo = {lineId: this.activeShape.id, startEndInd: 'E', linkedShapeId: pageShapes[startShapeId].id};
				
				closestBorderPoint.linkedLines.push(lineInfo);
				
				//set the border points on the line as well as what object the line is linked to
				this.activeShape.properties.endPointVector = new jsgl.Vector2D(closestBorderPoint.location.getX(), closestBorderPoint.location.getY());
				this.activeShape.properties.endObjectId = pageShapes[endShapeId].id;
			
				//draw an arrow at the end of the line as long as the line is not a note connector
				if (this.activeShape.properties.relationshipType != 'note')
				{
					var arrowElement = createArrow(lineElement.getStartX(),
									   lineElement.getStartY(),
									   lineElement.getEndX(),
									   lineElement.getEndY());
									   
					this.activeShape.properties.endArrowElement = arrowElement;
					myPanel.addElement(arrowElement);					
				}
			}
		}
		
		releasePen(this.activeShape, 'line.mouseUp');
	};
	  
	function SquareShapeEventHandler(shape)
	{
		this.activeShape = shape;
		this.init();
	}
			
	SquareShapeEventHandler.prototype = Object.create (ShapeEventHandler.prototype);
	
    SquareShapeEventHandler.prototype.mouseDownListener = function(eventArgs)
    {
		//is this the creation of the square - the initial placement
		if (this.activeShape.getElementsCount() == 0)
		{
			newSquare = myPanel.createRectangle();		
			newSquare.getStroke().setWeight(1);
			newSquare.getStroke().setColor("rgb(0,0,255)");
			newSquare.setVerticalAnchor(jsgl.VerticalAnchor.MIDDLE);
			newSquare.setHorizontalAnchor(jsgl.HorizontalAnchor.CENTER);
			newSquare.setWidth(this.activeShape.properties.getWidth());
			newSquare.setHeight(this.activeShape.properties.getHeight());
			
			this.activeShape.setX(eventArgs.getX());
			this.activeShape.setY(eventArgs.getY());										
			this.activeShape.addElement(newSquare);	
			this.activeShape.properties.setBorderPoints();
			this.activeShape.shapeHelper.addSequence();
			
			releasePen(this.activeShape, 'square.mouseDown');
			//we are dropping the diamone on the panel, so don't active it
		}
		//we are selecting an existing square - so active it
		else if (!penClaimed())
		{
			claimPen(this.activeShape, 'square.mouseDown');					
								
		}	
	};
		
	SquareShapeEventHandler.prototype.mouseUpListener = function (eventArgs)
	{		
		//we need to update all the border points of the square
		this.activeShape.properties.resetBorderPoints();
		 
		//adjust any attached lines
		this.activeShape.shapeHelper.adjustLinkedLines();	
		
		releasePen(this.activeShape, 'square.mouseUp');
	};
	  
	function ElipseShapeEventHandler(shape)
	{
		this.activeShape = shape;
		this.init();
	}
	
	ElipseShapeEventHandler.prototype = Object.create(ShapeEventHandler.prototype);
	
    ElipseShapeEventHandler.prototype.mouseDownListener = function(eventArgs)
    {
		//is this the creation of the elipse - the initial placement
		if (this.activeShape.getElementsCount() == 0)
		{
			newElipse = myPanel.createEllipse();		
			newElipse.getStroke().setWeight(1);
			newElipse.getStroke().setColor("rgb(0,0,255)");
			newElipse.setCenterLocationXY(0,0);
			newElipse.setSizeWH(defaultElipseWidth, defaultElipseHeight);
			
			this.activeShape.setX(eventArgs.getX());
			this.activeShape.setY(eventArgs.getY());
			
			this.activeShape.addElement(newElipse);	
			this.activeShape.properties.setBorderPoints();
			
			this.activeShape.shapeHelper.addSequence();
							
			releasePen(this.activeShape, 'elipse.mouseDown');
			//we are dropping the diamone on the panel, so don't active it
		}
		//we are selecting an existing square - so active it
		else if (!penClaimed())
		{
			claimPen(this.activeShape, 'elipse.mouseDown');							
		}	
	};
			
	ElipseShapeEventHandler.prototype.mouseUpListener = function (eventArgs)
	{		
		//we need to update all the border points of the diamond
		this.activeShape.properties.resetBorderPoints();
		 
		//adjust any attached lines
		this.activeShape.shapeHelper.adjustLinkedLines();	
		
		releasePen(this.activeShape, 'elipse.mouseUp');
	};
  
	//the locationXY is a jsgl.Vector2D location
	function createOffPageConnector(pText, locationXY)
	{
		var newShape = myPanel.createGroup();			
		newShape.id = getController().generateId();
		newShape.shape = 'offConnector';
		newShape.shapeEventHandler = new OffPageEventHandler(newShape);		
		newShape.shapeHelper = new OffPageShapeHelper(newShape);
		newShape.properties = new OffPageProperties(newShape, getNextSequenceNumber());				

		var newPolygon = myPanel.createPolygon();		
		newPolygon.getStroke().setWeight(1);
		newPolygon.getStroke().setColor("rgb(255,255,255)");
		newShape.setLocation(locationXY);
		newShape.addElement(newPolygon);						
		newShape.properties.setBorderPoints();
		
		newPolygon.addPointXY( 0 + (newShape.properties.getWidth() / 2), 0 - (newShape.properties.getHeight() / 2));
		newPolygon.addPointXY( 0 + (newShape.properties.getWidth() / 2), 0);
		newPolygon.addPointXY( 0, 0 + (newShape.properties.getHeight() / 2));
		newPolygon.addPointXY( 0 - (newShape.properties.getWidth() / 2), 0);
		newPolygon.addPointXY( 0 - (newShape.properties.getWidth() / 2), 0 - (newShape.properties.getHeight() / 2));
		
		newShape.shapeHelper.addSequence();
		newShape.shapeHelper.setText(pText);

		return newShape;
	}
	  
	function createNewShape(shape, panel, options) {
	         
		var newShape = null;
		
		if (shape == 'circle')
		{
			newShape = panel.createGroup();			
			newShape.id = getController().generateId();
			newShape.shape = 'circle';
			
			newShape.shapeEventHandler = new CircleShapeEventHandler(newShape);
			//newShape.shapeEventHandler.init();
			newShape.shapeHelper = new CircleShapeHelper(newShape);
			newShape.properties = new CircleProperties(newShape, getNextSequenceNumber(), defaultRadius);
		}
		if (shape == 'onConnector')
		{
			newShape = panel.createGroup();			
			newShape.id = getController().generateId();
			newShape.shape = 'onConnector';
			
			newShape.shapeEventHandler = new CircleShapeEventHandler(newShape);		
			//newShape.shapeEventHandler.init();
			newShape.shapeHelper = new CircleShapeHelper(newShape);
			newShape.properties = new CircleProperties(newShape, getNextSequenceNumber(), 25);
		}
		else if (shape == 'offConnector')
		{
			newShape = panel.createGroup();			
			newShape.id = getController().generateId();
			newShape.shape = 'offConnector';
			newShape.shapeEventHandler = new OffPageEventHandler(newShape);
			//newShape.shapeEventHandler.init();
			newShape.shapeHelper = new OffPageShapeHelper(newShape);
			newShape.properties = new OffPageProperties(newShape, getNextSequenceNumber());					
		}
		else if (shape == 'line')
		{
			newShape = panel.createGroup();					
			newShape.id = getController().generateId();
			newShape.shape = 'line';
			newShape.shapeEventHandler = new LineShapeEventHandler(newShape);
			//newShape.shapeEventHandler.init();
			newShape.properties = new LineProperties(newShape, getNextSequenceNumber());
			newShape.properties.relationshipType = options;
			newShape.shapeHelper = new LineShapeHelper(newShape);
		}
		else if (shape == 'diamond')
		{
			newShape = panel.createGroup();			
			newShape.id = getController().generateId();
			newShape.shape = 'diamond';
			newShape.shapeEventHandler = new DiamondShapeEventHandler(newShape);
			//newShape.shapeEventHandler.init();
			newShape.shapeHelper = new DiamondShapeHelper(newShape);
			newShape.properties = new DiamondProperties(newShape, getNextSequenceNumber(), defaultDiamondWidth, defaultDiamondHeight);					
		}
		else if (shape == 'square')
		{
			newShape = panel.createGroup();			
			newShape.id = getController().generateId();
			newShape.shape = 'square';
			newShape.shapeEventHandler = new SquareShapeEventHandler(newShape);
			//newShape.shapeEventHandler.init();
			newShape.shapeHelper = new SquareShapeHelper(newShape);
			newShape.properties = new SquareProperties(newShape, getNextSequenceNumber(), defaultSquareWidth, defaultSquareHeight);					
		}
		else if (shape == 'rectangle')
		{
			newShape = panel.createGroup();			
			newShape.id = getController().generateId();
			newShape.shape = 'rectangle';
			newShape.shapeEventHandler = new SquareShapeEventHandler(newShape);
			//newShape.shapeEventHandler.init();
			newShape.shapeHelper = new SquareShapeHelper(newShape);
			newShape.properties = new SquareProperties(newShape, getNextSequenceNumber(),defaultRecWidth, defaultRecHeight);					
		}
		else if (shape == 'elipse')
		{
			newShape = panel.createGroup();			
			newShape.id = getController().generateId();
			newShape.shape = 'elipse';
			newShape.shapeEventHandler = new ElipseShapeEventHandler(newShape);
			//newShape.shapeEventHandler.init();
			newShape.shapeHelper = new ElipseShapeHelper(newShape);
			newShape.properties = new ElipseProperties(newShape, getNextSequenceNumber());					
		}
		
		//if the user clicks to create a shape, and then clicks to create another shape, we need to clear out the prior (unfinished shape)
		if (pageNewShape)
		{
			panel.removeElement(pageNewShape);
			pageShapes.splice(pageShapes.indexOf(pageNewShape),1);
			releasePen(pageNewShape, 'createNewShape');						
		}
		
		pageShapes.push(newShape);		
		panel.addElement(newShape);		
		
		pageNewShape = newShape;
		claimPen(newShape, 'createNewShape');		
	  };
	
    function deleteShape(deletedShape)
	{
		
		if (deletedShape.shape == 'line')
		{
			//need to remove the line from the two shapes on the ends
			var startObjectIdx = getShapeIndex(deletedShape.properties.startObjectId);
			var startObject = pageShapes[startObjectIdx];
			
			var found = false;
			for (var pointsIdx = 0; pointsIdx < startObject.properties.borderPoints.length; pointsIdx++)
			{				
				for (var lineIdx = 0; lineIdx < startObject.properties.borderPoints[pointsIdx].linkedLines.length; lineIdx++)
				{
					if (deletedShape.id == startObject.properties.borderPoints[pointsIdx].linkedLines[lineIdx].lineId)
					{
						startObject.properties.borderPoints[pointsIdx].linkedLines.splice(lineIdx, 1);
						found = true;
						break;
					}
				}
				if (found)
				{
					break;
				}
			}						
			//need to remove the line from the two shapes on the ends
			var endObjectIdx = getShapeIndex(deletedShape.properties.endObjectId);
			var endObject = pageShapes[endObjectIdx];
			var found = false;
			for (var pointsIdx = 0; pointsIdx < endObject.properties.borderPoints.length; pointsIdx++)
			{				
				for (var lineIdx = 0; lineIdx < endObject.properties.borderPoints[pointsIdx].linkedLines.length; lineIdx++)
				{
					if (deletedShape.id == endObject.properties.borderPoints[pointsIdx].linkedLines[lineIdx].lineId)
					{
						endObject.properties.borderPoints[pointsIdx].linkedLines.splice(lineIdx, 1);
						found = true;
						break;
					}
				}
				if (found)
				{
					break;
				}
			}

			//remove any arrows on the line
			//if there is an arrow at the start of the line - remove it from the panel
			if (deletedShape.properties.startArrowElement != null)
			{
				myPanel.removeElement(deletedShape.properties.startArrowElement);				
			}			
			//if there is an arrow at the end of the line - remove it from the panel
			if (deletedShape.properties.endArrowElement != null)
			{
				myPanel.removeElement(deletedShape.properties.endArrowElement);				
			}			
		}
		else
		{
			var borderPoints = deletedShape.properties.borderPoints;
			var seqNbr = deletedShape.properties.sequenceNumber;
			
			//for each borderpoint
			for (var borderPointIdx = 0; borderPointIdx < borderPoints.length; borderPointIdx++)		
			{
				//cycle through the connections at the point
				for (var linkedLineIdx = 0; linkedLineIdx < borderPoints[borderPointIdx].linkedLines.length; linkedLineIdx++)			
				{
					var otherShapeId = borderPoints[borderPointIdx].linkedLines[linkedLineIdx].linkedShapeId;
					
					//find the shape at the other end of the connection
					for (var otherShapeIdx = 0; otherShapeIdx < pageShapes.length; otherShapeIdx++)
					{
						//when we find the other shape, 
						if (pageShapes[otherShapeIdx].id == otherShapeId)
						{
							//find which border point has THIS shape's id in it and remove it
							var otherBorderPoints = pageShapes[otherShapeIdx].properties.borderPoints;
							for (var otherBorderPointIdx = 0; otherBorderPointIdx < otherBorderPoints.length; otherBorderPointIdx++)								
							{
								var foundIt = false;
								for (var otherLinkIdx = 0; otherLinkIdx < otherBorderPoints[otherBorderPointIdx].linkedLines.length; otherLinkIdx++)
								{
									if (otherBorderPoints[otherBorderPointIdx].linkedLines[otherLinkIdx].linkedShapeId == deletedShape.id)
									{
										
										otherBorderPoints[otherBorderPointIdx].linkedLines.splice(otherLinkIdx,1);
										foundIt = true;
										break;
									}
								}
								if (foundIt)
								{
									break;
								}
							}
							break;
						}
					}
					
					//now remove the line from the panel and the pageShapes array				
					for (var shapeIdx = 0; shapeIdx < pageShapes.length; shapeIdx++)
					{				
						if (pageShapes[shapeIdx].id == borderPoints[borderPointIdx].linkedLines[linkedLineIdx].lineId)					
						{
							//remove any arrows on the line
							//if there is an arrow at the end of the line - remove it from the panel and redraw
							if (pageShapes[shapeIdx].properties.endArrowElement != null)
							{
								myPanel.removeElement(pageShapes[shapeIdx].properties.endArrowElement);
								
							}
							//if there is an arrow at the start of the line - remove it from the panel and redraw
							if (pageShapes[shapeIdx].properties.startArrowElement != null)
							{
								myPanel.removeElement(pageShapes[shapeIdx].properties.startArrowElement);
								
							}
							myPanel.removeElement(pageShapes[shapeIdx]);
							pageShapes.splice(shapeIdx, 1);
							break;
						}
					}				
				}			
			}
		}
		
		releasePen(deletedShape);
		
		// - remove shape from panel
		myPanel.removeElement(deletedShape);
		
		//remove this shape from pageShapes
		pageShapes.splice(pageShapes.indexOf(deletedShape),1);
		
		if (deleteShape.shape != 'line')
		{
			//resequence the shapes all shapes with a greater sequence number will be reduced by 1
			getController().resequence(pageShapes, seqNbr, -1, -1);
		}	
		
	}
	
	/* this function returns the index within pageShapes for the incoming shape id */
	function getShapeIndex(shapeId)
	{
		var idx = 0;
		for (var x = 0; x < pageShapes.length; x++)
		{
			if (pageShapes[x].id == shapeId)
			{
				idx = x;
				break;
			}
		}
		
		return idx;
	}
	
	/* this function returns the highest sequence number on the page  + 1*/
	function getNextSequenceNumber()
	{
		var nextVal = 0;
		for (var idx = 0; idx < pageShapes.length; idx++)
		{
			if (pageShapes[idx].properties.sequenceNumber > nextVal)
			{
				nextVal = pageShapes[idx].properties.sequenceNumber;
			}
		}
		
		return nextVal + 1;
	}
	
	/* this function returns the shape id within pageShapes for the incoming shape index */
	function getShapeId(indexId)
	{
		return pageShapes[indexId].id;
	}
	
	/* return the currently selected shape (if one) based on the mouse position in panelX/ panelY */
	function getCurrentlySelectedShape()
	{
		var currentlySelectedShape = null;

		//if the user has initialized a select action, see if the right click is within the boundries of the select area	
		if (lastActiveShape != null)
		{
			if (lastActiveShape.shape == 'select')
			{
				currentlySelectedShape = lastActiveShape;
			}
		}
		
		if (currentlySelectedShape == null)
		{
			for (var i = 0; i < pageShapes.length; i++)
			{						
				if (pageShapes[i].shapeHelper.isPointInsideShape(panelX, panelY))
				{					
					currentlySelectedShape = pageShapes[i];
					claimPen(pageShapes[i], 'getCurrentlySelectedShape');
					break;
				}		
			}
		}
		
		return currentlySelectedShape;
	}
	
	  
	//the incoming shape is the shape container (jsgl.group)  
	//the method is a string for debugging - what method is invoking 
	function claimPen(shape, method)
	{
		 if (!penClaimed())
		 {
		//	console.log('ClaimPenEvent: for ' + shape.id + ' from ' + method);
		    activeShapeId = shape.id;	
			shape.isActive = true;	
			lastActiveShape	= shape;
		 }
		 else if ((activeShapeId != 0) && (shape.id != activeShapeId))
		 {
			console.log('ClaimPenEvent: invoked for ' + shape.id + ' but pen still claimed by ' + activeShapeId);
		 }
	}
	
	function releasePen(shape, method)
	{
		if (shape == null)
		{
			activeShapeId = 0;
		}
		else if (activeShapeId == shape.id)
		 {
		//	console.log('ReleasePenEvent: ' + activeShapeId + ' from ' + method);
		    activeShapeId = 0;		
		    pageNewShape = null;	
			shape.isActive = false;
			
		 }
		 else if (activeShapeId != 0)
		 {
			console.log('ReleasePenEvent: invoked for  ' + shape.id + ' while pen is still held by ' + activeShapeId);
		 }
	}
	
	function penClaimed()
	{
		return activeShapeId != 0;
	}
	
	function logInfo(clearfirst)
	{
	   if (clearfirst)
	   {
		 console.clear();
		}
		console.log('page shape count: ' + pageShapes.length);
		console.log('shape count on panel: ' +  myPanel.getElementsCount());
		//for (var i = 0; i < myPanel.getElementsCount(); i++)
		//{
		//	var shape = myPanel.getElementAt(i);
		//	console.log('shape is ' + shape.shape);
		//	console.log('shape id: ' + shape.id);
		//}
		
		console.log('pageShapes:');
		for (var i = 0 ; i < pageShapes.length; i++)
		{
			if (pageShapes[i].shape == 'line')
			{
				console.log('    shape id: ' + pageShapes[i].id + ' is a line');
			}
			else
			{
				console.log('    shape id: ' + pageShapes[i].id);		
				console.log('    drillDownId: ' + pageShapes[i].properties.drillDownPageId);
				console.log('    text: ' + pageShapes[i].properties.shapeText);
						
				console.log('    borderPoint info:');
				for (var y = 0; y < pageShapes[i].properties.borderPoints.length; y++)
				{
					console.log('        borderpoint: ' + y + ', x: ' + pageShapes[i].properties.borderPoints[y].location.getX() + 
					                                          ', y: ' + pageShapes[i].properties.borderPoints[y].location.getY());							
					for (var z = 0; z < pageShapes[i].properties.borderPoints[y].linkedLines.length; z++)
					{
						console.log('        lines: ' + y + ', line info at: ' + z + ' lineId: ' + pageShapes[i].properties.borderPoints[y].linkedLines[z].lineId + 
								', startEnd: ' + pageShapes[i].properties.borderPoints[y].linkedLines[z].startEndInd + 
								', linkedShapeId: ' + pageShapes[i].properties.borderPoints[y].linkedLines[z].linkedShapeId);
					}
				}
			}
		}
		console.log('currently active shape id: ' + activeShapeId);
		
		if ((this.lastActiveShape != null) && (this.lastActiveShape.shape = 'select'))
		{
			console.log('startX ' + this.lastActiveShape.properties.startX + ', start y ' + this.lastActiveShape.properties.startY);
			console.log('endX ' + this.lastActiveShape.properties.endX + ', end y ' + this.lastActiveShape.properties.endY);
		}
		
		console.log('page cache:');
		for (var idx = 0; idx < pageCache.length; idx++)
		{
			console.log(pageCache[idx]);
		}
	};
	
	function logUiPageDto(dto)
	{
		 console.clear();

		console.log(dto);
	}
	
      function startLine(pLineType)
	  {
	     createNewShape('line', myPanel, pLineType);		 
		 
	  };
	  
    function startGroupSelect()
	{
		newShape = myPanel.createPolygon();			
		newShape.shape = 'select';
		newShape.getStroke().setDashStyle(jsgl.DashStyles.DASH);
		newShape.getStroke().setWeight(1);
		newShape.getStroke().setColor('green');
		newShape.setZIndex(-1);
		
		newShape.shapeEventHandler = new GroupSelectEventHandler(newShape);		
		newShape.shapeHelper = new GroupSelectHelper(newShape);
		newShape.properties = new GroupSelectProperties(newShape);	
		
		myPanel.addElement(newShape);		
		
		pageNewShape = newShape;
		claimPen(newShape, 'startGroupSelect');	
	}
	
	function startCircle()
	{
		createNewShape('circle', myPanel, null);		  
		
	  }
	  
	  function startOnPageConnector() {
		createNewShape('onConnector', myPanel, null);		  		
	  }
	  
	  function startOffPageConnector() {
		createNewShape('offConnector', myPanel, null);		  		
	  }
	  
      function startDiamond()
	  {
		createNewShape('diamond', myPanel,null);		  

	  }
	  
	  function startSquare()
	  {
		createNewShape('square', myPanel,null);

	}
	 function startRectangle()
	  {
		createNewShape('rectangle', myPanel,null);

	} 
	  function startElipse()
	  {
		createNewShape('elipse', myPanel,null);

	  }
		
	//this method is called when the user clicks save on the 'new page diagram' - the new page can be created for a drill down operation
	//or a promote operation
	function handleNewPageDiagram()
	{
		if (getController().newPageAction == "promote")
		{
			var linkages = validGroupSelectionForPromotion();
			if (!linkages.validLinkages) 
			{	
				alert ('Invalid Group Selection for Promotion. At most, there may be 1 entry and 1 exit connection');
				return;
			}
		}

		newPageDiagram.dialog("close");

		//first save the page (all we have is the page title/description at this point)
		var newUiPageDto =  getController().createNewPageDto();
		newUiPageDto.pageDto.pageTitle = getController().pageTitle;
		newUiPageDto.pageDto.pageDescription = getController().pageDescription;
		
		//don't save the current page if we are promoting - the promote logic will do that
		if (getController().newPageAction == "drilldown")
		{			
				var currentShape = getCurrentlySelectedShape();
				currentShape.properties.drillDownPageId = newUiPageDto.pageDto.pageId;
				currentShape.properties.drillDownPageTitle = newUiPageDto.pageDto.pageTitle;

				savePage();
		}

		
		if (getController().newPageAction == "drilldown")
		{			
			newUiPageDto.predecessorPages.push({pageId: getController().currentPage.pageDto.pageId,
												pageTitle: getController().currentPage.pageDto.pageTitle});
		}

		newUiPageDto = persistPage(newUiPageDto);
		
		if (getController().newPageAction == "drilldown")
		{
			loadPage(newUiPageDto.pageDto.pageId);								
		}		
		else
		{
				promoteGroupSelectToNewPage(newUiPageDto, linkages);

				//remove the group select
				lastActiveShape.shapeHelper.releaseShapes();
				myPanel.removeElement(lastActiveShape);		
		}
	}

	function validGroupSelectionForPromotion()
	{
		
		var linkages = gatherLinksForPromotion();

		if ((linkages.toNewPage.length > 1) || (linkages.fromNewPage.length > 1))
		{
			linkages.validLinkages = false;
		}

		return linkages;
	}

	//helper function to determine links need to promote shapes to a new page- bot the links that
	//will move to the new page, and the links between current page and the shape that will be the placeholder
	//for the new page on the current page.
	//return object:
	// toNewPage: the connection between non-mananged and managed shape going to the new page
	// fromNewPage: the connection between non-mananged and managed shape coming from the new page
	// newPageLinks: list of connections that will move to the new page
	// linkagesDto {validLinkage: boolean, toNewPage: [connectionShape], fromNewPage: [connectionShape], newPageLinks: [connectionShape]}
	// 
	//note: there can only be 1 toNewPage and 1 fromNewPage connection - but the structure is an array to capture
	// all	
	function gatherLinksForPromotion()
	{
		var groupSelect = lastActiveShape;
		
		var linkagesDto = {validLinkages : true, toNewPage: [], fromNewPage: [], newPageLinks: []};

		//1) identify any links between selected shapes and non-selected shapes and hold these connections in a list
		for (var idx = 0; idx < groupSelect.properties.managedShapes.length; idx++)
		{
			var managedShape = groupSelect.properties.managedShapes[idx];
			
			//spin through each shapes border points
			for (var bidx = 0; bidx < managedShape.properties.borderPoints.length; bidx++)
			{
				var borderPoint = managedShape.properties.borderPoints[bidx];
				//for each point- look at the connected lines
				for (var cidx = 0; cidx < borderPoint.linkedLines.length; cidx++)
				{
					var lineInfo = borderPoint.linkedLines[cidx];
					//are we connected to a shape outside the groupSelect?
					var connectorObject = pageShapes[getShapeIndex(lineInfo.lineId)];					
					var bManaged = false;
					var toOrFromPage = "";

					//if our current shape is the start shape - see if the end shape is also selected
					if (managedShape.id == connectorObject.properties.startObjectId)
					{												
						toOrFromPage = 'from';
						for (var sidx = 0; sidx < groupSelect.properties.managedShapes.length; sidx++)
						{	
							if (connectorObject.properties.endObjectId == groupSelect.properties.managedShapes[sidx].id)
							{
								bManaged = true;
								break;
							}
						}
					}
					else
					{					
						toOrFromPage = 'to';
						for (var sidx = 0; sidx < groupSelect.properties.managedShapes.length; sidx++)
						{	
							if (connectorObject.properties.startObjectId == groupSelect.properties.managedShapes[sidx].id)
							{
								bManaged = true;
								break;
							}
						}
					}

					//if this is a connection to a non-managed shape - we need to connect the link to the new page	
					if (!bManaged)	
					{	
						if (toOrFromPage == 'from')
						{
							//make sure we haven't already captured this link
							var bAdd = true;
							for (addIdx = 0; addIdx < linkagesDto.fromNewPage.length; addIdx++)					
							{
								if (linkagesDto.fromNewPage[addIdx].id == connectorObject.id)
								{
									bAdd = false;
									break;
								}
							}
							if (bAdd)
							{
								linkagesDto.fromNewPage.push(connectorObject);
							}
						}
						else
						{
							//make sure we haven't already captured this link
							var bAdd = true;
							for (addIdx = 0; addIdx < linkagesDto.toNewPage.length; addIdx++)					
							{
								if (linkagesDto.toNewPage[addIdx].id == connectorObject.id)
								{
									bAdd = false;
									break;
								}
							}
							if (bAdd)
							{
								linkagesDto.toNewPage.push(connectorObject);
							}
						}
					} 
					else
					{
						//make sure we haven't already captured this link
						var bAdd = true;
						for (addIdx = 0; addIdx < linkagesDto.newPageLinks.length; addIdx++)					
						{
							if (linkagesDto.newPageLinks[addIdx].id == connectorObject.id)
							{
								bAdd = false;
								break;
							}
						}
						if (bAdd)
						{
							linkagesDto.newPageLinks.push(connectorObject);
						}
					}
				}
			}
		}

		return linkagesDto;
	}

	  //when the user selects a group of shapes and chooses to promote them to a new page
	function promoteGroupSelectToNewPage(newUiPageDto, linkages)
	{
		var groupSelect = lastActiveShape;
		var newOffPageShapes = [];
		var newLinks = [];

		//1) create a new circle	
		var newShape = myPanel.createGroup();			
		newShape.id = getController().generateId();
		newShape.shape = 'circle';		
		newShape.shapeEventHandler = new CircleShapeEventHandler(newShape);		
		newShape.shapeHelper = new CircleShapeHelper(newShape);
		newShape.properties = new CircleProperties(newShape, getNextSequenceNumber(), defaultRadius);

		var newCircle = myPanel.createCircle();							
		newShape.setLocation(groupSelect.shapeHelper.getCenterPoint());
		newCircle.setRadius(newShape.properties.getRadius());
		newCircle.getStroke().setWeight(1);
		newCircle.getStroke().setColor("rgb(0,0,255)");
		newShape.addElement(newCircle);	
		newShape.properties.setBorderPoints();
		newShape.shapeHelper.addSequence();

		// link the new circle that connects to the promoted page to the newly saved page
		newShape.properties.drillDownPageId = newUiPageDto.pageDto.pageId;
		newShape.properties.drillDownPageTitle = newUiPageDto.pageDto.pageDescription;
		newShape.shapeHelper.setText(newUiPageDto.pageDto.pageTitle);

		pageShapes.push(newShape);		
		myPanel.addElement(newShape);		

		//2) create a new link between the non selected shapes and the new #1 circle
		// there will be at most 1 link TO the new page and 1 link FROM the new page

		//create the TO new page linkage. 
		if (linkages.toNewPage.length == 1)
		{
			var fromShape = pageShapes[getShapeIndex(linkages.toNewPage[0].properties.startObjectId)];
			var fromOffPageConnector = createOffPageConnector('Start', fromShape.getLocation());			
			fromOffPageConnector.properties.sequenceNumber = 1; //as the start of the new page - give it 1
			newOffPageShapes.push(fromOffPageConnector);

			//create the link on current page between non-managed shape and the new circle
			var linkage = connectShapes(fromShape,
				newShape,
				linkages.toNewPage[0].properties.startPointVector,
				linkages.toNewPage[0].properties.endPointVector, 
				linkages.toNewPage[0].properties.relationshipType, null);
			
			pageShapes.push(linkage);
			myPanel.addElement(linkage);

			//create the link between the new off page connector shape (for the new page) and the
			//shape on this page that is moving to the new page
			var newLink = connectShapes(fromOffPageConnector,
										pageShapes[getShapeIndex(linkages.toNewPage[0].properties.endObjectId)],
										linkages.toNewPage[0].properties.startPointVector,
										linkages.toNewPage[0].properties.endPointVector, 
										linkages.toNewPage[0].properties.relationshipType, null );
		
			newLinks.push(newLink);
		}

		//create the FROM new page linkage
		if (linkages.fromNewPage.length == 1)
		{			
			var toShape = pageShapes[getShapeIndex(linkages.fromNewPage[0].properties.endObjectId)];
			var toOffPageConnector = createOffPageConnector('End', toShape.getLocation());					
			toOffPageConnector.properties.sequenceNumber = toShape.properties.sequenceNumber; //assign the same sequene number as the non-managed shape
			newOffPageShapes.push(toOffPageConnector);

			//create the link on current page between non-managed shape and the new circle
			var linkage = connectShapes(newShape,
				toShape,
				linkages.fromNewPage[0].properties.startPointVector,
				linkages.fromNewPage[0].properties.endPointVector, 
				linkages.fromNewPage[0].properties.relationshipType, null );
		
			pageShapes.push(linkage);
			myPanel.addElement(linkage);

			//create the link between the new off page connector shape (for the new page) and the
			//shape on this page that is moving to the new page
			var newLink = connectShapes(pageShapes[getShapeIndex(linkages.fromNewPage[0].properties.startObjectId)],
									  	toOffPageConnector,				
										linkages.fromNewPage[0].properties.startPointVector,
										linkages.fromNewPage[0].properties.endPointVector, 
										linkages.fromNewPage[0].properties.relationshipType, null );

			newLinks.push(newLink);
		}

		//4) copy all selected shapes and connectors to the new page dto		
		for (var idx = 0; idx < groupSelect.properties.managedShapes.length; idx++)
		{
			addShapeToUiPageDto(newUiPageDto, groupSelect.properties.managedShapes[idx]);			
		}

		//5) delete all selected shapes/connectors
		groupSelect.shapeHelper.deleteShapes();
		
		//6) save current page
		var currentUiPageDto = savePage();
		//link the new page to the current page
		newUiPageDto.predecessorPages.push( {pageId: currentUiPageDto.pageDto.pageId, pageTitle: currentUiPageDto.pageDto.pageTitle});

		//copy any new off page connector shapes
		for (var idx = 0; idx < newOffPageShapes.length; idx++)
		{			
			addShapeToUiPageDto(newUiPageDto, newOffPageShapes[idx]);
		}

		//add links between shapes that are moving
		for (var idx = 0; idx < linkages.newPageLinks.length; idx++)
		{
			addConnectionToUiPageDto(newUiPageDto, linkages.newPageLinks[idx]);
		}

		//add links to the shapes that are moving and the new off page connectors
		for (var idx = 0; idx < newLinks.length; idx++)
		{
			addConnectionToUiPageDto(newUiPageDto, newLinks[idx]);			
		}
		
		newUiPageDto = persistPage(newUiPageDto);

	
	}

	  //this function clears the page - removes the shapes from the panel, clears out the pageShapes array, and initializes the Dto that holds
	  //the info from server for rendering a page.
	  //If the incoming pFromShapeId is populated, it will be the shape that this page is linked to via a drilldown.
	  //When the page is saved, we will create a link between that shape and this page
	  function clearPage(pFromShapeId)
	  {
		myPanel.clear();
		pageShapes = [];
		// uiPageDto =  JSON.parse(JSON.stringify(pageDtoTemplate));
		// if (pFromShapeId != null)
		// {
		// 	uiPageDto.sourceShapeId = pFromShapeId;
		// }
		// getController().setCurrentPage({});
	  }
	
	//invoked with the user choses to navigate to a predecessor page 
	function navigateToPage()
	{
		loadPage(getController().selectedPredecessorPage.pageId);
	}

	//*******************************************************************************************************
	//* load page functions                                                                                 *
	//*******************************************************************************************************
    function loadPage(pageId)
	{
		//invoke server to get the uiPageDto for the incoming page
		clearPage(null);

		var bfound = false;
		for (var idx = 0; idx < pageCache.length; idx++)
		{
			if (pageCache[idx].pageDto.pageId == pageId)
			{
				uiPageDto = pageCache[idx];
				bfound = true;
				break;
			}
		}
		
		if (!bfound)
		{
			alert ('page ' ||pageId || ' not found');
			return;
		}

		getController().setCurrentPage(uiPageDto);

		//set the page title and description
		
		for (var shapeIdx = 0; shapeIdx < uiPageDto.shapes.length; shapeIdx++)
		{
			createShape(myPanel, uiPageDto.shapes[shapeIdx]);
		}
		
		for (var connectIdx = 0; connectIdx < uiPageDto.connections.length; connectIdx++)
		{
			createConnection(myPanel, uiPageDto.connections[connectIdx]);
		}
		
	}

	function createShape(myPanel, shapeDto)
	{
		if (shapeDto.shapeType == 'circle')
		{
			createCircle(myPanel, shapeDto);
		}
		else if ((shapeDto.shapeType == 'square') || (shapeDto.shapeType == 'rectangle'))
		{
			createSquare(myPanel, shapeDto);
		} 
		else if (shapeDto.shapeType == 'diamond')
		{
			createDiamond(myPanel, shapeDto);
		}
		else if (shapeDto.shapeType == 'elipse')
		{
			createEllipse(myPanel, shapeDto);
		}
		else if (shapeDto.shapeType == 'onConnector')
		{
			createOnConnector(myPanel, shapeDto);
		}
		else if (shapeDto.shapeType == 'offConnector')
		{
			createOffConnector(myPanel, shapeDto);
		}	
	}

	//create a circle using the shapeDto within uiPageDto (from back-end)
	function  createCircle(myPanel, shapeDto)
	{
		var newShape = myPanel.createGroup();
				
		newShape.id = shapeDto.shapeId;
		newShape.shape = 'circle';
		newShape.setLocationXY(shapeDto.centerX, shapeDto.centerY);
					
		newShape.shapeEventHandler = new CircleShapeEventHandler(newShape);		
		newShape.shapeHelper = new CircleShapeHelper(newShape);
		newShape.properties = new CircleProperties(newShape, shapeDto.sequenceNumber, shapeDto.radius);
		
		newCircle = myPanel.createCircle();		
		newShape.addElement(newCircle);	
		newCircle.setRadius(shapeDto.radius);
		newCircle.getStroke().setWeight(1);
		newCircle.getStroke().setColor("rgb(0,0,255)");
		newShape.properties.drillDownPageId = shapeDto.drillDownPageId;	

		newShape.addElement(newCircle);
		newShape.shapeHelper.addSequence();		
		newShape.shapeHelper.setText(shapeDto.shapeText);
		newShape.properties.setBorderPoints();
		
		myPanel.addElement(newShape);
		
		pageShapes.push(newShape);
	}
	
	function  createSquare(myPanel, shapeDto)
	{
		var newShape = myPanel.createGroup();
				
		newShape.id = shapeDto.shapeId;
		newShape.shape = 'square';
		newShape.setLocationXY(shapeDto.centerX, shapeDto.centerY);
					
		newShape.shapeEventHandler = new SquareShapeEventHandler(newShape);		
		newShape.shapeHelper = new SquareShapeHelper(newShape);
		newShape.properties = new SquareProperties(newShape);
		newShape.properties.sequenceNumber = shapeDto.sequenceNumber;		
		newShape.properties.setWidth(shapeDto.width);
		newShape.properties.setHeight(shapeDto.height);
		newShape.properties.drillDownPageId = shapeDto.drillDownPageId;	

		newSquare = myPanel.createRectangle();		
		newSquare.getStroke().setWeight(1);
		newSquare.getStroke().setColor("rgb(0,0,255)");
		newSquare.setVerticalAnchor(jsgl.VerticalAnchor.MIDDLE);
		newSquare.setHorizontalAnchor(jsgl.HorizontalAnchor.CENTER);
		newSquare.setWidth(newShape.properties.getWidth());
		newSquare.setHeight(newShape.properties.getHeight());

		newShape.properties.setBorderPoints();
		
		newShape.addElement(newSquare);	
		
		newShape.shapeHelper.addSequence();
		newShape.shapeHelper.setText(shapeDto.shapeText);
		
		myPanel.addElement(newShape);
		
		pageShapes.push(newShape);
			
	}
	
	function createDiamond(myPanel, shapeDto)
	{
		newShape = myPanel.createGroup();			
		newShape.id = shapeDto.shapeId;
		newShape.shape = 'diamond';
		newShape.shapeEventHandler = new DiamondShapeEventHandler(newShape);		
		newShape.shapeHelper = new DiamondShapeHelper(newShape);
		newShape.properties = new DiamondProperties(newShape, shapeDto.sequenceNumber, shapeDto.width, shapeDto.height);		

		newDiamond = myPanel.createPolygon();		
		newDiamond.getStroke().setWeight(1);
		newDiamond.getStroke().setColor("rgb(0,0,255)");
		newDiamond.addPointXY(0, 0 - (shapeDto.height / 2));
		newDiamond.addPointXY(0 + (shapeDto.width / 2), 0);
		newDiamond.addPointXY(0, 0 + (shapeDto.height / 2));
		newDiamond.addPointXY(0 - (shapeDto.width / 2), 0);
			
		newShape.setX(shapeDto.centerX);
		newShape.setY(shapeDto.centerY);
			
		newShape.addElement(newDiamond);	
		newShape.shapeHelper.addSequence();		
		newShape.shapeHelper.setText(shapeDto.shapeText);
		newShape.properties.setBorderPoints();	
		
		myPanel.addElement(newShape);
		
		pageShapes.push(newShape);
		
	}
	
	function createEllipse(myPanel, shapeDto)
	{
		newShape = myPanel.createGroup();			
		newShape.id = shapeDto.shapeId;
		newShape.shape = 'elipse';
		newShape.shapeEventHandler = new ElipseShapeEventHandler(newShape);
		newShape.shapeHelper = new ElipseShapeHelper(newShape);
		newShape.properties = new ElipseProperties(newShape, shapeDto.sequenceNumber);		
		
		newElipse = myPanel.createEllipse();		
		newElipse.getStroke().setWeight(1);
		newElipse.getStroke().setColor("rgb(0,0,255)");
		newElipse.setCenterLocationXY(0,0);
		newElipse.setSizeWH(shapeDto.width, shapeDto.height);
			
		newShape.setX(shapeDto.centerX);
		newShape.setY(shapeDto.centerY);
			
		newShape.addElement(newElipse);	
		newShape.properties.setBorderPoints();
		newShape.properties.drillDownPageId = shapeDto.drillDownPageId;	

		newShape.shapeHelper.addSequence();
		newShape.shapeHelper.setText(shapeDto.shapeText);
		
		myPanel.addElement(newShape);
		
		pageShapes.push(newShape);
	}
	
	function createOnConnector(myPanel, shapeDto)
	{
		newShape = myPanel.createGroup();			
		newShape.id = shapeDto.shapeId;
		newShape.shape = 'onConnector';
		newShape.setLocationXY(shapeDto.centerX, shapeDto.centerY);	
		newShape.shapeEventHandler = new CircleShapeEventHandler(newShape);				
		newShape.shapeHelper = new CircleShapeHelper(newShape);
		newShape.properties = new CircleProperties(newShape, shapeDto.sequenceNumber, shapeDto.radius);
	
		newCircle = myPanel.createCircle();				
		newCircle.setRadius(shapeDto.radius);
		newCircle.getStroke().setWeight(1);
		newCircle.getStroke().setColor("rgb(0,0,255)");
		newShape.addElement(newCircle);	

		newShape.shapeHelper.addSequence();		
		newShape.shapeHelper.setText(shapeDto.shapeText);
		newShape.properties.setBorderPoints();
		newShape.properties.drillDownPageId = shapeDto.drillDownPageId;	

		myPanel.addElement(newShape);		
		pageShapes.push(newShape);		
	}
	
	function createOffConnector(myPanel, shapeDto)
	{
		newShape = myPanel.createGroup();			
		newShape.id = shapeDto.shapeId;
		newShape.shape = 'offConnector';
		newShape.shapeEventHandler = new OffPageEventHandler(newShape);
		
		newShape.shapeHelper = new OffPageShapeHelper(newShape);
		newShape.properties = new OffPageProperties(newShape, shapeDto.sequenceNumber);				
		newShape.setX(shapeDto.centerX);
		newShape.setY(shapeDto.centerY);
		
		newPoly = myPanel.createPolygon();		
		newPoly.getStroke().setWeight(1);
		newPoly.getStroke().setColor("rgb(0,0,255)");
	
		newShape.properties.setWidth(shapeDto.width);
		newShape.properties.setHeight(shapeDto.height);
		newPoly.addPointXY( 0 + (newShape.properties.getWidth() / 2), 0 - (newShape.properties.getHeight() / 2));
		newPoly.addPointXY( 0 + (newShape.properties.getWidth() / 2), 0);
		newPoly.addPointXY( 0, 0 + (newShape.properties.getHeight() / 2));
		newPoly.addPointXY( 0 - (newShape.properties.getWidth() / 2), 0);
		newPoly.addPointXY( 0 - (newShape.properties.getWidth() / 2), 0 - (newShape.properties.getHeight() / 2));
			
		newShape.addElement(newPoly);						
		newShape.properties.setBorderPoints();		
		newShape.shapeHelper.addSequence();
		newShape.shapeHelper.setText(shapeDto.shapeText);
		
		myPanel.addElement(newShape);		
		pageShapes.push(newShape);		
	
			
	}
	
	//this function rebuilds the connections on a saved page between the shapes. There can be connections between shapes on the page or connections
	//between the shapes and other pagees (each shape can be connected at most to one other page (a drilldown). The drilldown connections are stored
	//on the shape and will render the label of the text in blue/underline to appear as a hypertext link
	function createConnection(myPanel, shapeRelationshipDto)
	{		
		var newShape = myPanel.createGroup();			
		newShape.id = shapeRelationshipDto.relationshipId;
		newShape.shape = 'line';
		newShape.shapeEventHandler = new LineShapeEventHandler(newShape);			
		newShape.properties = new LineProperties(newShape, shapeRelationshipDto.sequenceNumber);			
		newShape.shapeHelper = new LineShapeHelper(newShape);
		
		newShape.properties.relationshipType = shapeRelationshipDto.lovRelationshipType;
		
		newLine = myPanel.createLine();
		var myStroke = new jsgl.stroke.SolidStroke();	
		myStroke.setWeight(2);
		newLine.setStroke(myStroke); 
		
		newLine.setStartPointXY(shapeRelationshipDto.startXLocation, shapeRelationshipDto.startYLocation);
		newLine.setEndPointXY(shapeRelationshipDto.endXLocation, shapeRelationshipDto.endYLocation);
		newShape.properties.startPointVector = new jsgl.Vector2D(shapeRelationshipDto.startXLocation, shapeRelationshipDto.startYLocation);
		newShape.properties.endPointVector = new jsgl.Vector2D(shapeRelationshipDto.endXLocation, shapeRelationshipDto.endYLocation);
		newShape.properties.startObjectId = shapeRelationshipDto.fromShapeId;
		newShape.properties.endObjectId = shapeRelationshipDto.toShapeId;
		
		var startShapeIdx = getShapeIndex(shapeRelationshipDto.fromShapeId);					
		var endShapeIdx = getShapeIndex(shapeRelationshipDto.toShapeId);
						
		//find out which of the points on the shape are closest to the starting point, we will then set the start
		//of the line to that border point
		var newVector = new jsgl.Vector2D(newShape.properties.startPointVector.getX(), newShape.properties.startPointVector.getY());
		var closestBorderPoint = pageShapes[startShapeIdx].shapeHelper.closestBorderPoint(newVector);
						
		//link this line to this border point - when the circle/diamond moves - we'll need to know which lines to adjust
		var lineInfo = {lineId: newShape.id, startEndInd: 'S', linkedShapeId: pageShapes[endShapeIdx].id };
						
		closestBorderPoint.linkedLines.push(lineInfo);
		
		//if the arrow type is 'two way connector' then draw an arrowhead on the from side
		if (newShape.properties.relationshipType == 'two way connector')
		{
			//draw an arrow at the start of the line
			var arrowElement = createArrow(newLine.getEndX(),
							newLine.getEndY(),
							newLine.getStartX(),
							newLine.getStartY());
							
			newShape.properties.startArrowElement = arrowElement;
			myPanel.addElement(arrowElement);					   
		}
		
		//find out which of the points on the circle/diamond are closest to the ending point, we will then set the end 
		//of the line to that border point
		var newVector = new jsgl.Vector2D(shapeRelationshipDto.endXLocation, shapeRelationshipDto.endYLocation);
		var closestBorderPoint = pageShapes[endShapeIdx].shapeHelper.closestBorderPoint(newVector);
						
		//link this line to this border point - when the circle moves - we'll need to know which lines to adjust
		var lineInfo = {lineId: newShape.id, startEndInd: 'E', linkedShapeId: pageShapes[startShapeIdx].id};
						
		closestBorderPoint.linkedLines.push(lineInfo);
						
		//set the border points on the line as well as what object the line is linked to
		newShape.properties.endObjectId = pageShapes[endShapeIdx].id;
		
		//draw an arrow at the end of the line as long as the line is not a note connector
		if (newShape.properties.relationshipType != 'note')
		{
			var arrowElement = createArrow(newLine.getStartX(),
								newLine.getStartY(),
								newLine.getEndX(),
								newLine.getEndY());
								
			newShape.properties.endArrowElement = arrowElement;
			myPanel.addElement(arrowElement);					
		}
		
		newShape.addElement(newLine);						
		
		newShape.shapeHelper.addSequence();
		newShape.shapeHelper.setText(shapeRelationshipDto.shapeText);
	
		myPanel.addElement(newShape);				
		pageShapes.push(newShape);
	}
	
	//this function will move all shapes in the pageShapes array to a new uiPageDto and then persist.
	//The pageDto is returned.
	function savePage()
	{
		getController().initializePageDto();

		var uiPageDto = getController().currentPage;
		
		//the page title and description are bound to current page and are already set
		
		//cycle through the shapes and write to the pagedto
		for (var shapeIdx = 0; shapeIdx < pageShapes.length; shapeIdx++)
		{
			var shape = pageShapes[shapeIdx];
			if (shape.shape != 'line')
			{
				addShapeToUiPageDto(uiPageDto, shape);
			}		
			else
			{
				addConnectionToUiPageDto(uiPageDto, shape);
			}
		}
		
		return persistPage(uiPageDto);
		
	}
	
	function addShapeToUiPageDto(uiPageDto, shape)
	{
		var newShape = new ShapeDto(shape.shape);
		
		newShape.sequenceNumber = shape.properties.sequenceNumber;
		
		// ref artifacts

		if ((shape.shape == 'circle') || (shape.shape == 'onConnector'))
		{
			newShape.radius = shape.getElementAt(0).getRadius();
		}
		else
		{
			newShape.width = shape.properties.getWidth();
			newShape.height = shape.properties.getHeight();
		}

		newShape.shapeId = shape.id;
		newShape.drillDownPageId = shape.properties.drillDownPageId;
		
		newShape.centerX = shape.getX();
		newShape.centerY  = shape.getY();
		newShape.shapeText = shape.properties.shapeText;
		
		for (var tagIdx = 0; tagIdx < shape.properties.tags.length; tagIdx ++)
		{
			newShape.tags.push(shape.properties.tags[tagIdx]);
		}

		for (var idx = 0; idx < shape.properties.annotations.length; idx++)
		{
			newShape.annotations.push(shape.properties.annotations[idx]);
		}

		uiPageDto.shapes.push(newShape);
	}
	

	function addConnectionToUiPageDto(uiPageDto, shape)
	{
		var newConnection = new shapeRelationshipDto();

		newConnection.relationshipId = shape.id;
		newConnection.fromShapeId = shape.properties.startObjectId;
		newConnection.toShapeId = shape.properties.endObjectId;   //**** deal with page connections later
		newConnection.lovRelationshipType = shape.properties.relationshipType;
		newConnection.startXLocation = shape.properties.startPointVector.getX();
		newConnection.startYLocation = shape.properties.startPointVector.getY();
		newConnection.endXLocation = shape.properties.endPointVector.getX();
		newConnection.endYLocation = shape.properties.endPointVector.getY();
		newConnection.shapeText = shape.properties.shapeText;
		uiPageDto.connections.push(newConnection);
	}

	function persistPage(pageDto)
	{
		//see if the incoming page has already been saved
		//invoke server to get the uiPageDto for the incoming page
		var newPage = true;
		for (var idx = 0; idx < pageCache.length; idx++)
		{
			if (pageCache[idx].pageDto.pageId == pageDto.pageDto.pageId)
			{
				pageCache[idx] = pageDto;
				newPage = false;
				break;
			}
		}

		if (newPage)
		{
			//dummy code for now - will be swapped with call to back-end
			//the backend will need to 
			
			pageCache.push(pageDto);
		}

		//back end functionality:
		//1) delink any pages that refer to this page where this page doesn't refer to the existing page
		//      for each persisted page
		//          for each predecessor page
		//             does the predecessor page = the page being saved?
		//             if so
		//                are there any shapes on the incoming page that refer to the persisted page?
		//                if not - remove the incoming page from the predecessor page list

		logUiPageDto(pageDto);

		return pageDto;

	}

	function saveEditPage()
	{
			getController().savePageEdits();
			editPageDialog.dialog("close");
	}

	function saveEditShape(event )
	{
		if (event == "save")
		{
			releasePen(getController().getCurrentShape(), "saveEditShape");
			getController().saveShape();
			editShapeDialog.dialog("close");
			editConnectorDialog.dialog("close");
		}
	}
	
	//return a refence to the pages angular controller js
	function getController()
	{
		return angular.element(document.getElementById('canvasController')).scope();
	}
	
	
	function searchDiagrams() 
	{
		searchDiagramDialog.dialog("open");
	}
	
	function handleEditPageProperties()
	{
		getController().setForPageEdit();
		editPageDialog.dialog("open");
	}

	$(function() {
	
		getController().setPageShapes(pageShapes);
		
	    /* Instantiate JSGL Panel. */
		myPanel = new jsgl.Panel(document.getElementById("panel"));
			
		//if the mouse down occurs on when there is no shape selected, then we need to see if there is an 
		//active shape that has been started and now the user is placing the shape
		 myPanel.addMouseDownListener(function(eventArgs) {
			
			if (resizeTriggered)
			{
			
				var activeShape = pageShapes[getShapeIndex(activeShapeId)];
				activeShape.shapeHelper.resize(eventArgs.getX(), eventArgs.getY());
				activeShape.shapeHelper.adjustLinkedLines(activeShape);
				$("#panel").css('cursor', 'default');
				resizeTriggered = false;							
				releasePen(activeShape, 'mouseDownListener'	);
				
			}
			//if there is no active shape, or we are starting to draw a shape - pass on to the mouse down handler for the shape
			else if ( pageNewShape)		
			{
				pageNewShape.shapeEventHandler.mouseDownListener(eventArgs);						
			}
			
		});
		
		myPanel.addClickListener(function(eventArgs) {
			
		});
		
		  myPanel.addMouseMoveListener(function(eventArgs) {
			
			panelX = eventArgs.location.X;
			panelY = eventArgs.location.Y;
			//console.log('x: ' + panelX + 'y: ' + panelY);
			//if there is no active shape, or we are starting to draw a shape - pass on to the mouse down handler for the shape
			if ( pageNewShape)		
			{				
				pageNewShape.shapeEventHandler.mouseMoveListener(eventArgs);			
			}
		});

		myPanel.addMouseUpListener(function(eventArgs) {
			
			//if there is no active shape, or we are starting to draw a shape - pass on to the mouse down handler for the shape
			if ( pageNewShape)		
			{	
				pageNewShape.shapeEventHandler.mouseUpListener(eventArgs);			
			};
		});

		document.addEventListener("keydown", function(event) {
			if (event.code == 'Escape')
			{
				if (lastActiveShape != null)
				{
					if (lastActiveShape.shape == 'select')
					{
						lastActiveShape.shapeHelper.releaseShapes();
						myPanel.removeElement(lastActiveShape);
					}
				}
			}
			if (event.code == 'Delete')
			{
				if (lastActiveShape != null)
				{
					if (lastActiveShape.shape == 'select')
					{
						lastActiveShape.shapeHelper.deleteShapes();
						myPanel.removeElement(lastActiveShape);
					}
				}				
			}
		});

        $.contextMenu({
			selector: '.context-menu-one', 
		
			autoHide: true,
			events  : {
				//show the menu only if the user is inside a shape
				show: function(options) {
					
					var selShape = getCurrentlySelectedShape();
					
					//test - see if the mouse is in a shape					
					return (selShape != null);
				},
				hide: function(options) {
					//for a resize - keep the current shape active
					if (resizeTriggered != true)
					{
						var idx =  getShapeIndex(activeShapeId);
						//the only time this will be 0 is if the user chose to navigate to another page - in which case the shapePages array has been reset
						if (idx == 0)
						{
							releasePen(null, "contextMenu.hide");							
						}
						else
						{
							releasePen(pageShapes[idx], "contextMenu.hide");
						}
					}					
					return true;
				}
			},
			callback: function(key, options) {
				return true;
				
			},
			items: {
				"editShape": {name: "Edit Shape", 
							visible: function( key, opt)
							{
								if (getCurrentlySelectedShape().shape != 'select')
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
									handleEditMenuItem( getCurrentlySelectedShape());
								}
				},
				"resize": {name: "Resize", 
						visible: function (key, opt) {
							if ((getCurrentlySelectedShape().shape == 'line') || (getCurrentlySelectedShape().shape == 'select'))
							{		
								return false;
							}
							else
							{
								return true;
								}
						},	  
						icon: "fa-arrows-alt", callback: function (itemKey, opt, rootMenu, originalEvent)
					{
						handleResizeMenuItem(getCurrentlySelectedShape());
					}
				},
				"drillDown": {
					"name": "Drill Down",
					"visible": function (key, opt) {
						if ((getCurrentlySelectedShape().properties.drillDownPageId != -1) && 
							(getCurrentlySelectedShape().properties.canBeDrillDown == true))
						{
							return true;
						}
						else
						{
							return false;
						}
					},
					icon: "fa-arrow-down", callback: function (itemKey, opt, rootMenu, originalMenu)
					{
						handleDrillDownPageItem(getCurrentlySelectedShape());
					}
						
				},						
				"cancelDrillDown": {
					"name": "Undo Drill Down",
					"visible": function (key, opt) {
						if ((getCurrentlySelectedShape().properties.drillDownPageId != -1) && 
							(getCurrentlySelectedShape().properties.canBeDrillDown == true))
						{
							return true;
						}
						else
						{
							return false;
						}
					},
					icon: "fa fa-undo", callback: function (itemKey, opt, rootMenu, originalMenu)
					{
						handleRemoveDrillDownMenuItem(getCurrentlySelectedShape());
					}
						
				},
				"subMenu1": {
					"name": "Create Drill Down",
					"visible": function (key, opt) {
						if ((getCurrentlySelectedShape().properties.drillDownPageId == -1) && 
							(getCurrentlySelectedShape().properties.canBeDrillDown == true))
						{
							return true;
						}
						else
						{
							return false;
						}
					},
					"items": {
						"subMenu1a": {"name": "To New Page", callback: function()
							{
								handleDrillDownNewPageItem( getCurrentlySelectedShape());
								return true;
							}
						},
						"subMenu1b": {"name": "To Existing Page", callback: function(itemKey,opt, rootMenu, orignalEvent)
							{
								handleDrillDownExistingPageItem( getCurrentlySelectedShape());
								return true;
							}
						}					
					}
				},
				"delete": {name: "Delete", icon: "delete", callback: function (itemKey, opt, rootMenu, originalEvent)
					{
						handleDeleteMenuItem( getCurrentlySelectedShape());
					}
				},
				"subMenu2": {
					"name": "Promote",
					visible: function (key, opt) {
						if (getCurrentlySelectedShape().shape == 'select')
						{
							return true;
						}
						else
						{
							return false;
						}
					},
					icon: "fa-arrow-down",
					"items": {
						"subMenu2a": {"name": "To New Page", callback: function()
							{
								handlePromoteToNewPageMenuItem();
							}
						},
						"subMenu2b": {"name": "To Existing Page", callback: function(itemKey,opt, rootMenu, orignalEvent)
							{
								return true;
							}
						}					
					}
				}				
			}   
        });
		
		deleteDialog = $( "#dialog-confirm" ).dialog({
		  autoOpen: false,
		  resizable: false,
		  height: "auto",
		  width: 400,
		  modal: true,
		  buttons: {
			"Yes": function() {
			  deleteShape(	getCurrentlySelectedShape());
			  $( this ).dialog( "close" );
			},
			Cancel: function() {
			  $( this ).dialog( "close" );
			}
		  }
		});
			
		function handleDeleteMenuItem(selectedShape)
		{
			if (selectedShape != null)
			{
				getController().setCurrentShape(selectedShape);
				
				releasePen(selectedShape, 'handleDeleteMenuItem');				
				
				deleteDialog.dialog( "open");				
			}			
		}
		
		function handleEditMenuItem(selectedShape)
		{
			if (selectedShape != null)
			{
				getController().setCurrentShape(selectedShape);
				if ( (selectedShape.shape == "offConnector") || (selectedShape.shape == "onConnector"))
				{
					editConnectorDialog.dialog("open");
				}
				else
				{
					editShapeDialog.dialog("open");
				}
			}
		}
		
		function handleResizeMenuItem(selectedShape)
		{
			if (selectedShape != null)
			{
				//change cursor to resize 
				$("#panel").css('cursor', 'ew-resize');
				
				resizeTriggered = true;
			}
		}
		
		
		//when a user right clicks on a shape and chooses to drill down to an existing page
		function handleDrillDownPageItem(selectedShape)
		{
			if (selectedShape != null)
			{
				
				//load the new page context - but initialize it with a link to the source shape
				loadPage(selectedShape.properties.drillDownPageId);				
			}
			
			return true;
		}
		
		//when a user right clicks on a shape and chooses to create a drill down to a new page
		function handleDrillDownNewPageItem(selectedShape)
		{
		
			getController().newPageAction = "drilldown";
			getController().pageTitle = "";
			getController().pageDescription = "";
			newPageDiagram.dialog("open");

			return true;
		}
		
		//when the user right clicks to create a new drill down to an existing page - opens a window to search for page
		function handleDrillDownExistingPageItem(selectedShape) {

			if (selectedShape != null)
			{
				getController().setCurrentShape(selectedShape);
				searchDiagramDialog.dialog("open");				
			}

		}

		//when the user right clicks on a shape that has a drilldown and chooses to remove the drilldown
		function handleRemoveDrillDownMenuItem(selectedShape) {

			selectedShape.shapeHelper.removeDrillDown();

			releasePen(selectedShape, 'handleREmoveDrillDownMenuItem');

		}

		//when the user right clicks on a group select and choses to promote to a new page
		function handlePromoteToNewPageMenuItem()
		{
			getController().newPageAction = "promote";
			getController().pageTitle = "";
			getController().pageDescription = "";
			newPageDiagram.dialog("open");
		}

		function handleSelectDiagram()
		{
			getController().saveSelectedDiagram();
			searchDiagramDialog.dialog("close");
			releasePen(getController().currentShape, 'handleSelectDiagram');
		}
		
		//define he editShape popup
		editShapeDialog = $("#editShape").dialog({
			autoOpen: false,
			height: 700,
			width:  600,
			modal: true,
			buttons: {
				"Save": function() {
					saveEditShape("save")
				},
				Cancel: function() {
					editShapeDialog.dialog("close");
				}
			},
			close: function() {
				editForm[0].reset();
			//	allFields.removeClass("ui_state_error");
			}
		});
		
		
		editForm = editShapeDialog.find("form").on("submit", function (event) {
			event.preventDefault();
			saveEditShape();
		});
		
		//define the editPapge popup
		editPageDialog = $("#editPage").dialog({
			autoOpen: false,
			height: 700,
			width:  600,
			modal: true,
			buttons: {
				"Save": function() {
					saveEditPage("save")
				},
				Cancel: function() {
					editPageDialog.dialog("close");
				}
			},
			close: function() {
				editForm[0].reset();			
			}
		});

		//define he editConnector popup
		editConnectorDialog = $("#editConnector").dialog({
			autoOpen: false,
			height: 700,
			width:  600,
			modal: true,
			buttons: {
				"Save": function() {
					saveEditShape("save")
				},
				Cancel: function() {
					editConnectorDialog.dialog("close");
				}
			},
			close: function() {
				editForm[0].reset();
			//	allFields.removeClass("ui_state_error");
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
		
		hoverShapeDialog = $("#hoverShape").dialog({
			autoOpen: false,
			height: 500,
			width:  600,
			modal: false
		});

		//define the popup for adding a new page as part of a drill down
		newPageDiagram = $("#newPage").dialog({
			autoOpen: false,
			height: 400,
			width:  700,
			modal: true,
			buttons: {
				"Save": function() {
					handleNewPageDiagram();
				},
				Cancel: function() {
					newPageDiagram.dialog("close");
				}
			}			
		})
		
    });
