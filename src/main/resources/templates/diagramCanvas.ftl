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
   <script type="text/javascript" src="/scripts/vendor/jsgl.min.js"></script>
   <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

  <script src="/scripts/vendor/jquery.contextMenu.js"></script>
  <script src="/scripts/vendor/jquery-ui.js"></script>
  <script src="/scripts/vendor/angular.min.js"></script>
  <script src="/scripts/js/diagramCanvas.js"></script>
  <script src="/scripts/controllers/baseController.js"></script>
  <script src="/scripts/services/libraryService.js"></script>
  <script src="/scripts/services/artifactService.js"></script>
  <script src="/scripts/services/tagService.js"></script>
  <script src="/scripts/services/lovService.js"></script>
  <script src="/scripts/services/diagramService.js"></script>
  <script src="/scripts/controllers/diagramCanvasController.js"></script>
<!--  <script defer src="https://use.fontawesome.com/releases/v5.0.8/js/all.js"></script>-->
  <link rel="stylesheet" href="/css/bluelamp.css" />
  <link rel="stylesheet" href="/scripts/vendor/jquery.contextMenu.css" />
  <link rel="stylesheet" href="/scripts/vendor/jquery-ui.css" />
<!--  <link href="https://use.fontawesome.com/releases/v5.0.8/css/all.css" rel="stylesheet"-->
	  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" integrity="sha384-5SOiIsAziJl6AWe0HWRKTXlfcSHKmYV4RBF18PPJ173Kzn7jzMyFuTtk8JA7QQG1" crossorigin="anonymous">
	  <link rel="stylesheet" href="/css/font-awesome-4.7.0/css/font-awesome.css" />
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

	  <script type="application/json" id="uiPageDto">${uiPageDto}</script>

	  <script type="application/json" id="userProfile">${userProfile}</script>

  </head>
  <body>

	<div ng-app="bluelamp" ng-controller="canvasController" id="canvasController">
		<#include "/includes/menu.ftl"/>

		<div class="container" style="background-color:LightGray" ng-cloak>
			<div class="row">
				<div class="col-sm-2">
					<b>Title</b>
				</div>
				<div class="col-sm-5">
					<b>Description</b>
				</div>
				<div ng-show="currentPage.predecessorPageDtos.length > 0">
					<div class="col-sm-3">
						<label for="selPriorPage">Navigate Back</label>
					</div>
				</div>
				<div ng-show="currentPage.predecessorPageDtos.length == 0">
					<div class="col-sm-3">
					</div>
				</div>
				<div class="col-sm-2" ng-show="userProfile.editor">
					<label id="lblShowPalette" for="chkShowPalette">Show Palette</label>
					<input id="chkShowPalette"
						   name="chkShowPalette"
						   type="checkbox"
						   onClick="showHidePalette(chkShowPalette.checked)">
				</div>
			</div>
			<div class="row">
				<div class="col-sm-2">
					{{currentPage.pageDto.pageTitle}}
				</div>
				<div class="col-sm-5">
					{{currentPage.pageDto.pageDescription}}
				</div>
				<div ng-show="currentPage.predecessorPageDtos.length > 0">
					<div class="col-sm-3">
						<select id="selPriorPage"
								name="selPriorPage"
								ng-model="selectedPredecessorPage"
								ng-options="page as page.pageTitle for page in currentPage.predecessorPageDtos track by page.id">
						</select>
						<button ng-click="navigateToPredecessorPage()">Go</button>
					</div>
				</div>
				<div ng-show="currentPage.predecessorPageDtos.length == 0">
					<div class="col-sm-3">
					</div>
				</div>
				<div class="col-sm-2" style="cursor:pointer" ng-show="userProfile.editor">

					<i class="fas fa-save" ng-show="changes == true"
					   title="save diagram"
					   onClick="savePage()"></i>
					<i class="far fa-edit"
					   title="edit diagram properties"
					   onClick="handleEditPageProperties()"></i>
					<i class="fas fa-eraser"
					   title="erase page objects"
					   onClick="clearPage()"></i>
					<i class="fas fa-sync-alt"
					   title="reload diagram"
					   onClick="reloadPage()"></i>
					<i class="far fa-trash-alt"
					   title="delete diagram"
					   onClick="deletePage()"></i>
					<i class="fas fa-info"
					   style="cursor:help"
					   onclick="openHelp(1)";></i>
				</div>
				<div class="col-sm-2" ng-show="userProfile.editor == false">
					<i class="far fa-edit"
					   title="view diagram properties"
					   onClick="handleEditPageProperties()"></i>
				</div>
			</div>
		</div>

		<span class="context-menu-one"><div id="panel" style="width: 1680px; height: 980px; border:1;"></div></span>

		<!--these are the various popup menu dialogs -->
		<!--
		<div id="dialog-confirm" title="Delete Shape?">
			<p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>Are you sure you want to delete this shape?<br/>{{shapeDescription}}</p>
		</div>
		-->
	 
		<!-- this is the popup for editing page and shape properties -->
		<#include "/includes/addEditProperties.ftl"/>

		<!-- this is the popup for displaying the artifact info
		     when selected from the edit popup -->
		<#include "/includes/artifactInfo.ftl"/>

		<!-- this is the popup to add a new tag type -->
		<#include "/includes/addTagType.ftl" />

		<!-- this is the popup for searching for a diagram -->
		<#include "/includes/searchDiagram.ftl" />

		<!-- email Modal -->
		<#include "/includes/emailMessage.ftl" />

		<!--the canvas palette -->
		<#include "/includes/canvasPalatte.ftl" />

		<!--this is the popup for the help -->
		<#include "/includes/diagramHelpDialog.ftl" />
	</div>
  </body>
</html>