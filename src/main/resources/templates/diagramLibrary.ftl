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
    <script src="/scripts/vendor/jquery.contextMenu.js"></script>
    <script src="/scripts/vendor/jquery-ui.js"></script>
    <script src="/scripts/vendor/angular.min.js"></script>
    <script src="/scripts/js/diagramLibrary.js"></script>
    <script src="/scripts/services/libraryService.js"></script>
    <script src="/scripts/services/diagramService.js"></script>
    <script src="/scripts/services/tagService.js"></script>
    <script src="/scripts/services/lovService.js"></script>
    <script src="/scripts/controllers/baseController.js"></script>
    <script src="/scripts/controllers/diagramLibraryController.js"></script>

    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="/scripts/vendor/jquery.contextMenu.css" />
    <link rel="stylesheet" href="/scripts/vendor/jquery-ui.css" />
    <link rel="stylesheet" href="/css/font-awesome-4.7.0/css/font-awesome.css" />
    <link rel="stylesheet" href="/css/bluelamp.css" />

</head>
<body>
<div ng-app="bluelamp" ng-controller="diagramLibraryController" id="diagramLibraryController">
    <div class="header">
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <a class="nav-link" href="#">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">Library Catelog</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">Artifacts</a>
            </li>
            <li class="nav-item">
                <a class="nav-link active" href="#">Diagrams</a>
            </li>
        </ul>
    </div>
    <div class="container-fluid">
        <div class="panel-group">
            <div class="panel panel-primary">
                <div class="panel-heading">
                    Diagram Catalog
                </div>
                <div class="panel-body">
                    <button type="button" class="btn btn-primary" ng-click="openSearchDialog()">Search</button>
                    <div class="well">
                        <div class="dataTables_scrollHeadInner">
                            <ul>
                                <li class="libraryHeader1 libraryItem"
                                    ng-repeat="library1 in libraryList"
                                    ng-click="showHideDiagrams(this)"
                                    data-library-id="{{library1.id}}"
                                    data-library-level="{{library1.level}}">
                                    {{library1.description}} [{{library1.subLibraryList.length || library1.subLibraryCount}}]
                                    <ul class="libraryHeader2" ng-hide="!library1.expanded" >
                                        <li   class="libraryItem"
                                              ng-repeat="library2 in library1.subLibraryList"
                                              ng-click="showHideDiagrams(this)"
                                              data-library-id="{{library2.id}}"
                                              data-library-level="{{library2.level}}">
                                            {{library2.description}} [{{library2.subLibraryList.length || library2.subLibraryCount}}]
                                            <ul class="libraryHeader3" ng-hide="!library2.expanded">
                                                <li class="libraryItem"
                                                    ng-repeat="library3 in library2.subLibraryList"
                                                    ng-click="showHideDiagrams(this)"
                                                    data-library-id="{{library3.id}}"
                                                    data-library-level="{{library3.level}}">
                                                    {{library3.description}} [{{library3.subLibraryList.length || library3.subLibraryCount}}]
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="panel panel-primary">
                <div class="panel-heading">
                    Diagrams
                </div>
                <div class="panel-body">
                    <div class="well">
                        <div class="dataTables_scrollHeadInner">
                            <table>
                                <tr>
                                    <th style="width:20%">
                                        Diagram Title
                                    </th>
                                    <th style="width:80%">
                                        Diagram Description
                                    </th>
                                </tr>
                                <tr ng-repeat="diagram in diagramList">
                                    <td>
                                        <a href="*">{{diagram.pageTitle}}</a>
                                    </td>
                                    <td>
                                        {{diagram.pageDescription}}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- this is the popup to create a new diagram -->
    <form id="frmNewDiagram" title = "Add New Diagram"
          class="form-horizontal" novalidate>

        <div class="panel panel-danger" ng-show="errors.length > 0">
            <div class="panel-heading">The Following Errors Occurred</div>
            <div class="panel-body">
                <p ng-repeat="row in errors">{{row.errorMessage}}</p>
            </div>
        </div>

        <div   class="form-group form-group-sm">
            <label class="control-label col-md-4" for="fldPageTitle">Page Title: </label>

            <div class="col-md-8">
                <input 	class="form-control form-control-md"
                          required
                          type="text"
                          id="fldPageTitle"
                          name="fldPageTitle"
                          value="{{pageTitle}}"
                          ng-model="pageTitle"
                          maxlength="50"
                          size="50">
            </div>
        </div>
        <div   class="form-group form-group-sm">
            <label class="control-label col-md-4" for="fldPageDescription">Description: </label>

            <div class="col-md-8">
               <textarea	id="fldPageDescription"
                            ng-model="pageDescription"
                            name="fldPageDescription" rows="5" columns="50">{{pageDescription}}</textarea>
            </div>
        </div>

    </form>

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

</div>



</body>