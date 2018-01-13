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
      <script src="/scripts/js/libraryCatalog.js"></script>
      <script src="/scripts/services/libraryService.js"></script>
      <script src="/scripts/controllers/baseController.js"></script>
      <script src="/scripts/controllers/libraryCatalogController.js"></script>

      <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
      <link rel="stylesheet" href="/scripts/vendor/jquery.contextMenu.css" />
      <link rel="stylesheet" href="/scripts/vendor/jquery-ui.css" />

  </head>
  <body>
	<div ng-app="bluelamp" ng-controller="libraryCatalogController" id="libraryCatalogController">
        <div class="header">
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link" href="#">Home</a>
                </li>
                <li class="nav-item">
                <a class="nav-link active" href="#">Library Catelog</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Artifacts</a>
                </li>    
                <li class="nav-item">
                    <a class="nav-link" href="#">Diagrams</a>
                </li>                          
            </ul>     
        </div>
        <div class="container-fluid">
            <div class="panel-group">
                <div class="panel panel-primary">
                    <div class="panel-heading">
                        Library Catalog
                    </div>
                    <div class="panel-body">

                        <div class="dataTables_scrollHeadInner">
                            <button type="button" class="btn btn-primary" ng-click="writeLibrary()">Search</button>
                            <ul>                                
                                <li class="libraryHeader1 libraryItem"
                                    ng-repeat="library1 in libraryList"
                                    ng-click="showHide(this)"
                                    data-library-id="{{library1.id}}"
                                    data-library-level="{{library1.level}}">
                                        {{library1.description}} [{{library1.subLibraryList.length || library1.subLibraryCount }}]
                                    <ul class="libraryHeader2" ng-hide="!library1.expanded" >
                                        <li   class="libraryItem"
                                              ng-repeat="library2 in library1.subLibraryList"
                                              ng-click="showHide(this)"
                                              data-library-id="{{library2.id}}"
                                              data-library-level="{{library2.level}}">
                                                {{library2.description}} [{{library2.subLibraryList.length || library2.subLibraryCount}}]
                                            <ul class="libraryHeader3" ng-hide="!library2.expanded">
                                                <li class="libraryItem"
                                                    ng-repeat="library3 in library2.subLibraryList"
                                                    ng-click="showHide(this)"
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
        </div>

        <!-- this is the popup for adding a new library entry -->
        <div id="newLibrary" title = "{{libraryChangeType}} Library Entry">
            <form>
                <fieldset class="fieldSetStyle">
                    <table class="tblformatOnly">
                        <tr>
                            <td>
                                <label for="fldLibraryDescription">Description:</label>
                            </td>
                            <td>
                                <input type="text"
                                       id="fldLibraryDescription"
                                       name="fldLibraryDescription"
                                       value="{{libraryDescription}}"
                                       ng-model="libraryDescription"
                                       maxlength="50"
                                       size="50">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="fldLibraryAbbrev">Abbreviation:</label>
                            </td>
                            <td>
                                <input type="text"
                                       id="fldLibraryAbbrev"
                                       name="fldLibraryAbbrev"
                                       value="{{libraryAbbrev}}"
                                       ng-model="libraryAbbrev"
                                       maxlength="25"
                                       size="25">
                            </td>
                        </tr>
                    </table>
                </fieldset>
            </form>
        </div>
    </div>



  </body>