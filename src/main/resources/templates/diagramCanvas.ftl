<!DOCTYPE fhtml PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:svg="http://www.w3.org/2000/svg"
      xmlns:vml="urn:schemas-microsoft-com:vml">
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <title>Blue Lamp</title>
    <meta http-equiv="X-UA-Compatible" content="IE=7" />
    <!--[if vml]><style>vml\:* {behavior: url(#default#VML);}</style><![endif]-->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script> 
  <script type="text/javascript" src="./scripts/vendor/jsgl.min.js"></script>  
  <script src="/scripts/vendor/jquery.contextMenu.js"></script>
  <script src="/scripts/vendor/jquery-ui.js"></script>
  <script src="/scripts/vendor/angular.min.js"></script>
  <script src="/scripts/js/canvas.js"></script>
  <script src="/scripts/controllers/canvasController.js"></script>
  <link rel="stylesheet" href="/css/bluelamp.css" />
  <link rel="stylesheet" href="/scripts/vendor/jquery.contextMenu.css" />
  <link rel="stylesheet" href="/scripts/vendor/jquery-ui.css" />
  <link rel="stylesheet" href="/css/font-awesome-4.7.0/css/font-awesome.css" />
  
  </head>
  <body>
	<div ng-app="bluelamp" ng-controller="canvasController" id="canvasController">
		<span class="context-menu-one"><div id="panel" style="width: 1680px; height: 980px; border:1;"></div></span>
		
		<table>
			<tr>
				<td>
					Page Title:
				</td>
				<td>
					<input 	type="text"
					id="flCurrentPageTitle" 
					name="fldCurrentPageTitle" 
					value="{{currentPage.pageDto.pageTitle}}"
					ng-model="currentPage.pageDto.pageTitle"
					maxlength="50"
					size="50">
				</td>			
				<td>
					Description:
				</td>
				<td>
					<textarea	id="fldCurrentPageDescription" 									
					ng-model="currentPage.pageDto.pageDescription"
					name="fldCurrentPageDescription" rows="5" columns="50">{{currentPage.pageDto.pageDescription}}</textarea>
				</td>
				<td>
					Navigate to Predecessor Page:
				</td>
				<td>
					<select ng-model="selectedPredecessorPage" ng-options="page as page.pageTitle for page in currentPage.predecessorPages track by page.pageId"></select>
					<button onClick="navigateToPage()">Go</button>
				</td>
				<td>
					<button onClick="handleEditPageProperties()">Edit Page Properties</button>
				</td>
			</tr>
		</table>		
			

		<button class="context-menu-one" type="button" onClick="startGroupSelect();">Group Select</button>
		<button class="context-menu-one" type="button" onClick="startOnPageConnector();">draw On Page Connector</button>
		<button class="context-menu-one" type="button" onClick="startOffPageConnector();">draw Off Page Connector</button>
		<button class="context-menu-one" type="button" onClick="startCircle();">draw circle</button>
		<button class="palatte" type="button" onClick="startLine('note');">draw note connector</button>
		<button class="palatte" type="button" onClick="startLine('one way connector');">draw single direction line</button>
		<button class="palatte" type="button" onClick="startLine('two way connector');">draw bi-directional line</button>
		<button class="palatte" type="button" onClick="startDiamond();">draw diamond</button>
		<button class="palatte" type="button" onClick="startSquare();">draw square</button>
		<button class="palatte" type="button" onClick="startRectangle();">draw rectangle</button>
		<button class="palatte" type="button" onClick="startElipse();">draw elipse</button>

		<button class="palatte" type="button" onClick="clearPage(null);">clear</button>	
		<button type="button" onClick="logInfo('yes');">log info</button>
		<button type="button" onClick="savePage();">save Page</button>
		<button type="button" onClick="loadPage(UiPageDto);">load Page</button>
		<button type="button" onClick="logUiPageDto('yes');">log page dto</button>
		
		<!--these are the various popup menu dialogs -->
		<div id="dialog-confirm" title="Delete Shape?">
			<p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>Are you sure you want to delete this shape?<br/>{{shapeDescription}}</p>
		</div>
	 
		<!-- this is the popup for editing a shape -->
		<div id="editShape" title = "Edit Shape">
			<form>
				<fieldset> 
					<table class="tblformatOnly">
						
						<tr ng-show="notALine">
							<td>
								<label for="fldShapeSequence">Sequence:</label>
							</td>
							<td>
								<input 	type="text"
										id="fldShapeSequence"
										name="fldShapeSequence"
										value="{{currentShapeSeqNumber}}"
										ng-model="currentShapeSeqNumber"
										maxlength="3"
										size="3">

							</td>
						</tr>
						
						<tr>
							<td>
								<label for="fldShapeText">Text:</label>
							</td>
							<td>
								<textarea	id="fldShapeText"
											ng-model="currentShapeText"
											name="fldShapeText" rows="2" columns="20">{{currentShapeText}}</textarea>
							</td>
						</tr>
					</table>
					<div>
						<div ng-show="notALine">
							<fieldset class="fieldSetStyle">
								<legend>Artifact</legend>
								<div >
									<table class="tblFormatOnly" >
										<tr>
											<td>{{library1Label}}:</td>
											<td>
												<select id="fldShapeLibary1"
														name="fldShapeLibrary1"
														class=".ui-selectmenu-menu"
														ng-model="selectedLibrary1"
														ng-options="library1.abbreviation for library1 in library1List track by library1.abbreviation"
														ng-change="loadLibrary2List()">
												</select>
											</td>
										</tr>
										<tr>										
											<td>{{library2Label}}:</td>
											<td>
												<select id="fldShapeLibary2"
														name="fldShapeLibrary2"
														class=".ui-selectmenu-menu"
														ng-model="selectedLibrary2"
														ng-options="library2.abbreviation for library2 in library2List track by library2.abbreviation"
														ng-change="loadLibrary3List()">
												</select>
											</td>
										</tr>
										<tr>
											<td>{{library3Label}}:</td>
											<td>							
												<select id="fldShapeLibary3"
														name="fldShapeLibrary3"
														class=".ui-selectmenu-menu"
														ng-model="selectedLibrary3"
														ng-options="library3.abbreviation for library3 in library3List track by library3.abbreviation"
														ng-change="loadArtifactList()">
												</select>
											</td>
										</tr>
										<tr>
											<td>{{artifactLabel}}:</td>
											<td>
												<select id="fldShapeArtifact"
														name="fldShapeArtifact"
														class=".ui-selectmenu-menu"
														ng-model="selectedArtifact"
														ng-options="artifact.abbreviation for artifact in artifactList track by artifact.abbreviation">								
												</select>
											</td>
										</tr>
									</table>								
								</div>
							</fieldset>
						</div>
						<fieldset class="fieldSetStyle">
							<legend>Annotations</legend>
							<div>
								<label for="fldShapeAnnotation">Annotation:</label>
								<textarea	id="fldShapeAnnotation"
											ng-model="currentShapeAnnotation"
											name="fldShapeAnnotation" rows="2" columns="20">{{currentShapeAnnotation}}</textarea>
														
								<button id="btnShapeAddAnnotation"
										class="ui-button ui-widget ui-corner-all"
										ng-click="addAnnotation()">Add
								</button> 
							</div>	
							<table id="tblShapeAnnotations" class="tblFormatDisplay">
								<thead>
									<tr>
										<th>Annotations</th>
										<th>Delete</th>
									</tr>
								</thead>
								<tbody>
									<tr ng-repeat = "row in currentShapeAnnotations">
										<td colwidth="90%">
											<textarea id="fldShapeAnnotation$index" ng-model="currentShapeAnnotations[$index]"
											rows="2" columns="80" readonly>{{currentShapeAnnotations[$index]}}</textarea>
										</td>
										<td colwidth="10%"><input type="checkbox"
																  name="delShapeAnnotation$index"
																  ng-click="deleteAnnotation(row)"></td>
									</tr>
								</tbody>
							</table>
						</fieldset>
						<fieldset class="fieldSetStyle">
							<legend>Tags</legend>
							<div >
								<select id="fldShapeTagType" name="fldShapeTagType"
										class=".ui-selectmenu-menu"
									ng-model="selectedTagType"
									ng-options="tagValue.shortName for tagValue in tagLibrary">
									<option></option>
								</select>

								<div class="col-md-3">
									<input class="form-control form-control-md"
										   type="text"
										   id="fldTagValue"
										   name="fldTagValue"
										   value="{{selectedTagValue}}"
										   ng-model="selectedTagValue"
										   size="25">
								</div>

								<button id="btnShapeAddTag"
										class="ui-button ui-widget ui-corner-all"
										ng-click="addTag()">Add
								</button> 
								<br/>
								<table id="tblShapeTags" class="tblFormatDisplay">
									<thead>
										<tr>
											<th>Tag Type</th>
											<th>Tag Value</th>
											<th>Delete</th>									
										</tr>
									</thead>
									<tbody>
										<tr ng-repeat="row in currentShapeTags">
											<td>{{row.lovTagType}}</td>
											<td>{{row.tagValue}}</td>
											<td><input type="checkbox"
													   name="delShapeTag$index"
													   ng-click="deleteTag(row)"></td>
										</tr>
									</tbody>
								</table>
								
							</div>
							
						</fieldset>
						
					</div>
				</fieldset>
			</form>	
		</div>
		
		<!-- this is the popup for editing a page's properties -->
		<div id="editPage" title = "Edit Page">
				<form>
					<fieldset> 
						<table class="tblformatOnly">
							
							<tr>
								<td>
									<label for="fldPageTitle">Title:</label>
								</td>
								<td>
									<textarea	id="fldPageTitle"
												ng-model="currentPage.pageDto.pageTitle"
												name="fldPageTitle" rows="2" columns="20">{{currentPage.pageDto.pageTitle}}</textarea>
								</td>
							</tr>
							<tr>
								<td>
									<label for="fldPageDescription">Description:</label>
								</td>
								<td>
									<textarea	id="fldPageDescription"
												ng-model="currentPage.pageDto.pageDescription"
												name="fldPageDescription" rows="2" columns="20">{{currentPage.pageDto.pageDescription}}</textarea>
								</td>
							</tr>
						</table>
						<div>
							<fieldset class="fieldSetStyle">
								<legend>Artifact</legend>
								<div >
									<table class="tblFormatOnly" >
										<tr>
											<td>{{library1Label}}:</td>
											<td>
												<select id="fldPageLibary1"
														name="fldPageLibrary1"
														class=".ui-selectmenu-menu"
														ng-model="selectedLibrary1"
														ng-options="library1.abbreviation for library1 in library1List track by library1.abbreviation"
														ng-change="loadLibrary2List()">
												</select>
											</td>
										</tr>
										<tr>										
											<td>{{library2Label}}:</td>
											<td>
												<select id="fldPageLibary2"
														name="fldPageLibrary2"
														class=".ui-selectmenu-menu"
														ng-model="selectedLibrary2"
														ng-options="library2.abbreviation for library2 in library2List track by library2.abbreviation"
														ng-change="loadLibrary3List()">
												</select>
											</td>
										</tr>
										<tr>
											<td>{{library3Label}}:</td>
											<td>							
												<select id="fldPageLibary3"
														name="fldPageLibrary3"
														class=".ui-selectmenu-menu"
														ng-model="selectedLibrary3"
														ng-options="library3.abbreviation for library3 in library3List track by library3.abbreviation"
														ng-change="loadArtifactList()">
												</select>
											</td>
										</tr>
										<tr>
											<td>{{artifactLabel}}:</td>
											<td>
												<select id="fldPageArtifact"
														name="fldPageArtifact"
														class=".ui-selectmenu-menu"
														ng-model="selectedArtifact"
														ng-options="artifact.abbreviation for artifact in artifactList track by artifact.abbreviation">								
												</select>
											</td>
										</tr>
									</table>								
								</div>
							</fieldset>
							<fieldset class="fieldSetStyle">
								<legend>Annotations</legend>
								<div>
									<label for="fldPageAnnotation">Annotation:</label>
									<textarea	id="fldPageAnnotation"
												ng-model="currentShapeAnnotation"
												name="fldAnnotation" rows="2" columns="20">{{currentShapeAnnotation}}</textarea>
															
									<button id="btnPageAddAnnotation"
											class="ui-button ui-widget ui-corner-all"
											ng-click="addAnnotation()">Add
									</button> 
								</div>	
								<table id="tblPageAnnotations" class="tblFormatDisplay">
									<thead>
										<tr>
											<th>Annotations</th>
											<th>Delete</th>
										</tr>
									</thead>
									<tbody>
										<tr ng-repeat = "row in currentShapeAnnotations">
											<td colwidth="90%">
												<textarea id="fldPageAnnotation$index"
														  ng-model="currentShapeAnnotations[$index]"
												rows="2" columns="80" readonly>{{currentShapeAnnotations[$index]}}</textarea>
											</td>
											<td colwidth="10%"><input type="checkbox"
																	  name="delPageAnnotation$index" ng-click="deleteAnnotation(row)"></td>
										</tr>
									</tbody>
								</table>
							</fieldset>
							<fieldset class="fieldSetStyle">
								<legend>Tags</legend>
								<div >
									<select id="fldPageTagType" name="fldPageTagType" class=".ui-selectmenu-menu"
										ng-model="selectedTagType"
										ng-options="tagValue.shortName for tagValue in tagLibrary"
										ng-change="loadTagValues()">
										<option></option>
									</select>
									
									<select id="fldPageTagValue"
											name="fldPageTagValue" class=".ui-selectmenu-menu"
										ng-model="selectedTagValue"
										ng-options="tagValue.tagValue for tagValue in tagValues">
										<option></option>
									</select>							
								
									<button id="btnPageAddTag"
											class="ui-button ui-widget ui-corner-all"
											ng-click="addTag()">Add
									</button> 
									<br/>
									<table id="tblPageTags" class="tblFormatDisplay">
										<thead>
											<tr>
												<th>Tag Type</th>
												<th>Tag Value</th>
												<th>Delete</th>									
											</tr>
										</thead>
										<tbody>
											<tr ng-repeat="row in currentShapeTags">
												<td>{{row.lovTagType}}</td>
												<td>{{row.tagValue}}</td>
												<td><input type="checkbox" name="delPageTag$index" ng-click="deleteTag(row)"></td>
											</tr>
										</tbody>
									</table>
									
								</div>
								
							</fieldset>
							
						</div>
					</fieldset>
				</form>	
			</div>

		<!-- this is the popup for editing an off page connector -->
		<div id="editConnector" title = "Edit Connector">
			<form>
				<fieldset> 
					<table class="tblformatOnly">
						
						<tr ng-show="notALine">
							<td>
								<label for="fldConnSequence">Sequence:</label>
							</td>
							<td>
								<input 	type="text"
										id="fldConnSequence"
										name="fldConnSequence"
										value="{{currentShapeSeqNumber}}"
										ng-model="currentShapeSeqNumber"
										maxlength="3"
										size="3">

							</td>
						</tr>
						
						<tr>
							<td>
								<label for="fldConnText">Text:</label>
							</td>
							<td>
								<textarea	id="fldConnText"
											ng-model="currentShapeText"
											name="fldConnText" rows="2" columns="20">{{currentShapeText}}</textarea>
							</td>
							<td></td>
						</tr>
						<tr>
							<td>
								<label for="fldConnText">Page:</label>
							</td>
							<td>
								<Input type="text" id="fldPage" 									
											ng-model="currentConnectingPage"
											name="fldPage"
											readonly>
							</td>
							<td>
								<button id="btnConnSearchDiagrams"
										class="ui-button ui-widget ui-corner-all"
										onclick="searchDiagrams()">Search
								</button> 
							</td>
						</tr>
					</table>
					<div>
						<fieldset class="fieldSetStyle">
							<legend>Annotations</legend>
							<div>
								<label for="fldConnAnnotation">Annotation:</label>
								<textarea	id="fldConnAnnotation"
											ng-model="currentShapeAnnotation"
											name="fldConnAnnotation" rows="2" columns="20">{{currentShapeAnnotation}}</textarea>
														
								<button id="btnConnAddAnnotation"
										class="ui-button ui-widget ui-corner-all"
										ng-click="addAnnotation()">Add
								</button> 
							</div>	
							<table id="tblConnAnnotations" class="tblFormatDisplay">
								<thead>
									<tr>
										<th>Annotations</th>
										<th>Delete</th>
									</tr>
								</thead>
								<tbody>
									<tr ng-repeat = "row in currentShapeAnnotations">
										<td colwidth="90%">
											<textarea id="fldAnnotation$index" ng-model="currentShapeAnnotations[$index]"										
											rows="2" columns="80" readonly>{{currentShapeAnnotations[$index]}}</textarea>
										</td>
										<td colwidth="10%"><input type="checkbox" name="delConnAnnotation$index" ng-click="deleteAnnotation(row)"></td>
									</tr>
								</tbody>
							</table>
						</fieldset>
						<fieldset class="fieldSetStyle">
							<legend>Tags</legend>
							<div >
								<select id="fldConnTagType" name="fldConnTagType" class=".ui-selectmenu-menu"
									ng-model="selectedTagType"
									ng-options="tagValue.shortName for tagValue in tagLibrary"
									ng-change="loadTagValues()">
									<option></option>
								</select>
								
								<select id="fldConnTagValue" name="fldConnTagValue" class=".ui-selectmenu-menu"
									ng-model="selectedTagValue"
									ng-options="tagValue.tagValue for tagValue in tagValues">
									<option></option>
								</select>							
							
								<button id="btnConnAddTag"
										class="ui-button ui-widget ui-corner-all"
										ng-click="addTag()">Add
								</button> 
								<br/>
								<table id="tblConnTags" class="tblFormatDisplay">
									<thead>
										<tr>
											<th>Tag Type</th>
											<th>Tag Value</th>
											<th>Delete</th>									
										</tr>
									</thead>
									<tbody>
										<tr ng-repeat="row in currentShapeTags">
											<td>{{row.lovTagType}}</td>
											<td>{{row.tagValue}}</td>
											<td><input type="checkbox" name="delConnTag$index" ng-click="deleteTag(row)"></td>
										</tr>
									</tbody>
								</table>
								
							</div>
							
						</fieldset>
						
					</div>
				</fieldset>
			</form>	
		</div>
		
		<!-- this is the popup when hovering over shape -->
		<div id="hoverShape" title = "Shape Information">
			<table class="tblFormatOnly">				
				<tr>
					<td>Sequence:</td>
					<td>{{currentShapeSeqNumber}}</td>
				</tr>
				<tr>
					<td>Text:</td>
					<td>{{currentShapeText}}</td>
				</tr>
				<tr>
					<td>Artifact:</td>
					<td>{{library1Label}}</td>
					<td>{{selectedLibrary1.abbreviation}}</td>
				</tr>
				<tr>
					<td></td>
					<td>{{library2Label}}</td>
					<td>{{selectedLibrary2.abbreviation}}</td>
				</tr>
				<tr>
					<td></td>
					<td>{{library3Label}}</td>
					<td>{{selectedLibrary3.abbreviation}}</td>
				</tr>
				<tr>
					<td></td>
					<td>{{artifactLabel}}</td>
					<td>{{selectedArtifact.abbreviation}}</td>
				</tr>				
			</table>
			<table id="tblAnnotationsView" class="tblFormatDisplay">
				<thead>
					<tr>
						<th>Annotations</th>
					</tr>					
				</thead>
				<tbody>
					<tr ng-repeat="row in currentShapeAnnotations">
						<td>{{row}}</td>						
					</tr>
				</tbody>				
			</table>
			
			<table id="tblTags" class="tblFormatDisplay">
				<thead>
					<tr>
						<th>Tag Type</th>
						<th>Tag Value</th>						
					</tr>
				</thead>
				<tbody>
					<tr ng-repeat="row in currentShapeTags">
						<td>{{row.lovTagType}}</td>
						<td>{{row.tagValue}}</td>
					</tr>
				</tbody>
			</table>			
		</div>
	
		<!-- this is the popup for searching for a diagram -->
		<div id="searchDiagram" title = "Diagram Search">			
				
			<table class="tblformatOnly">
				<tr>
					<td>
						<label for="fldSearch">Search:</label>
					</td>
					<td>
						<Input type="text" id="fldSearch" 									
									ng-model="searchText"
									name="fldSearch">
					</td>
					<td>
						<button id="btnSearchDiagrams" 
								class="ui-button ui-widget ui-corner-all"
								ng-click="searchDiagrams()">Search
						</button> 
					</td>
				</tr>
			</table>
			
			
			<form>
				<fieldset class="fieldSetStyle">
					<legend>Matches</legend>
					<table id="tblDiagrams" class="tblFormatDisplay">
						<thead>
							<tr>
								<th>Select</th>
								<th>Matching Diagram</th>
								<th>Library Location</th>									
							</tr>
						</thead>
						<tbody>
							<tr ng-repeat="row in matchingDiagramsList">
								<td><input type="radio" name="select$index"								
								ng-click="setSelectedDiagram(row)"								>
								</td>
								<td>{{row.diagramTitle}}</td>
								<td>{{row.diagramLibrary}}</td>											
							</tr>
						</tbody>
					</table>													
				</fieldset>						

			</form>
		</div>

		<!-- this is the popup for adding a new page as part of a drill down creation -->
		<div id="newPage" title = "Create New Page">
			<form>
				<fieldset class="fieldSetStyle"> 
					<table class="tblformatOnly">
						<tr>
							<td>
								<label for="fldNewPageTitle">Page Title:</label>
							</td>
							<td>
								<input 	type="text"
										id="fldNewPageTitle"
										name="fldNewPageTitle"
										value="{{pageTitle}}"
										ng-model="pageTitle"
										maxlength="50"
										size="50">
							</td>
						</tr>
							
						<tr>
							<td>
								<label for="fldNewPageDescription">Description:</label>
							</td>
							<td>
								<textarea	id="fldNewPageDescription"
											ng-model="pageDescription"
											name="fldPageDescription" rows="5" columns="50">{{pageDescription}}</textarea>
							</td>
						</tr>
					</table>
				</fieldset>
			</form>	
		</div>

	</div>
  </body>
</html>