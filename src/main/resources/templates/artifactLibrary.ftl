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
  <!--  <script src="/scripts/vendor/jquery.ui.position.js"></script> -->
    <script src="/scripts/vendor/jquery-ui.js"></script>
    <script src="/scripts/vendor/angular.min.js"></script>
    <script src="/scripts/js/artifactLibrary.js"></script>
    <script src="/scripts/services/libraryService.js"></script>
    <script src="/scripts/services/artifactService.js"></script>
    <script src="/scripts/services/tagService.js"></script>
    <script src="/scripts/services/lovService.js"></script>
    <script src="/scripts/controllers/baseController.js"></script>
    <script src="/scripts/controllers/artifactLibraryController.js"></script>


    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="/scripts/vendor/jquery.contextMenu.css" />
    <link rel="stylesheet" href="/scripts/vendor/jquery-ui.css" />
    <link rel="stylesheet" href="/css/font-awesome-4.7.0/css/font-awesome.css" />
    <link rel="stylesheet" href="/css/bluelamp.css" />

</head>
<body>
<div ng-app="bluelamp" ng-controller="artifactLibraryController" id="artifactLibraryController">
    <div class="header">
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <a class="nav-link" href="#">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">Library Catelog</a>
            </li>
            <li class="nav-item">
                <a class="nav-link active" href="#">Artifacts</a>
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
                    Artifact Catalog
                </div>
                <div class="panel-body">
                    <button type="button" class="btn btn-primary" ng-click="testpromise()">Search</button>
                    <div class="well">
                        <div class="dataTables_scrollHeadInner">
                            <ul>
                                <li class="libraryHeader1 libraryItem"
                                    ng-repeat="library1 in libraryList"
                                    ng-click="showHideArtifacts(this)"
                                    data-library-id="{{library1.id}}"
                                    data-library-level="{{library1.level}}">
                                    {{library1.description}} [{{library1.subLibraryList.length || library1.subLibraryCount}}]
                                    <ul class="libraryHeader2" ng-hide="!library1.expanded" >
                                        <li   class="libraryItem"
                                              ng-repeat="library2 in library1.subLibraryList"
                                              ng-click="showHideArtifacts(this)"
                                              data-library-id="{{library2.id}}"
                                              data-library-level="{{library2.level}}">
                                            {{library2.description}} [{{library2.subLibraryList.length || library2.subLibraryCount}}]
                                            <ul class="libraryHeader3" ng-hide="!library2.expanded">
                                                <li class="libraryItem"
                                                    ng-repeat="library3 in library2.subLibraryList"
                                                    ng-click="showHideArtifacts(this)"
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
                    Artifacts
                </div>
                <div class="panel-body">
                    <div class="well">
                        <div class="dataTables_scrollHeadInner">
                            <table>
                                <tr>
                                    <th>
                                        Artifact Title
                                    </th>

                                </tr>
                                <tr ng-repeat="artifact in artifactList">
                                    <td>
                                        <div class="artifactItem"
                                             data-artifact-id="{{artifact.id}}">{{artifact.documentTitle}}</div>
                                    </td>

                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- this is the popup for adding/editing a new Artifact-->
    <form id="addEditArtifact"
          title = "Add/Edit Artifact"
          class="form-horizontal" novalidate>

        <div class="panel panel-danger" ng-show="errors.length > 0">
            <div class="panel-heading">The Following Errors Occurred</div>
            <div class="panel-body">
                <p ng-repeat="row in errors">{{row.errorMessage}}</p>
            </div>
        </div>

        <div  class="form-group form-group-sm">
            <label class="control-label col-md-2" for="fldTitle">Title: </label>

            <div class="col-md-4">
                <input 	class="form-control form-control-md"
                        required
                        type="text"
                        id="fldTitle"
                        name="fldTitle"
                        value="{{currentArtifact.documentTitle}}"
                        ng-model="currentArtifact.documentTitle"
                        maxlength="50"
                        size="25">
            </div>

            <label class="control-label col-md-2" for="fldAbbreviation">Abbreviation: </label>

            <div class="col-md-4">
                <input 	class="form-control form-control-md"
                          type="text"
                          required
                      id="fldAbbreviation"
                      name="fldAbbreviation"
                      value="{{currentArtifact.abbreviation}}"
                      ng-model="currentArtifact.abbreviation"
                      maxlength="50"
                      size="25">
            </div>

        </div>

        <div class="form-group form-group-sm">

            <label class="control-label col-md-2" for="fldDocType"><a ng-click="openNewDocType()">Document Type:</a></label>

            <div class="col-md-9">
                <select id="fldDocType"
                        name="fldDocType"
                        required
                        class="form-control"
                        ng-model="currentArtifact.documentType"
                        ng-options="docType.shortName for docType in docTypeList track by docType.id">
                </select>
            </div>

        </div>
        <div class="form-group form-group-sm">

            <label class="control-label col-md-2" for="fldDocDetail">Detail: </label>

            <div class="col-md-9">
                <textarea	id="fldDocDetail"
                             required
                             ng-model="currentArtifact.detailedText"
                             class="form-control"
                             name="fldDocDetail" rows="2" columns="20">{{currentArtifact.detailedText}}
                </textarea>
            </div>

        </div>
        <div class="form-group form-group-sm">
            <label class="control-label col-md-2" for="fldLibrary1">Categorize: </label>

            <div class="col-md-5">

                <select id="fldLibrary1"
                        name="fldLibrary1"
                        class="form-control"
                        ng-model="selectedLibrary1"
                        ng-options="library1.description for library1 in library1List track by library1.description"
                        ng-change="loadLibrary2List()">
                </select>
            </div>
        </div>
        <div class="form-group form-group-sm">
            <div class="col-md-2">
            </div>
            <div class="col-md-5">
                <select id="fldLibrary2"
                        name="fldLibrary2"
                        class="form-control"
                        ng-model="selectedLibrary2"
                        ng-options="library2.description for library2 in library2List track by library2.description"
                        ng-change="loadLibrary3List()">
                </select>
            </div>
        </div>
        <div class="form-group form-group-sm">
            <div class="col-md-2">
            </div>
            <div class="col-md-5">
                  <select id="fldLibary3"
                            name="fldLibrary3"
                            class="form-control"
                            ng-model="selectedLibrary3"
                            ng-options="library3.description for library3 in library3List track by library3.description"
                            ng-change="loadArtifactList()">
                    </select>
            </div>
        </div>
        <div class="form-group form-group-sm">
            <div class="col-md-2">
                Parent Artifact:
            </div>
            <div class="col-md-5">
                {{parentArtifact.documentTitle}}
            </div>
            <div class="col-md-3">
                <button id="btnParentArtifactSearch"
                        class="btn btn-primary"
                        ng-click="openSearchDialog()">Search
                </button>
            </div>
        </div>
        <div class="well">
            <div class="form-group form-group-sm">
                <label class="control-label col-md-2" for="fldTagType"><a ng-click="openNewTag()">Tag(s):</a> </label>

                <div class="col-md-3">
                    <select id="fldTagType" name="fldTagType" class="form-control"
                            ng-model="selectedTagType"
                            ng-options="tagValue.longName for tagValue in tagLibrary">
                        <option></option>
                    </select>
                </div>

                <div class="col-md-3">
                    <input class="form-control form-control-md"
                           type="text"
                           id="fldTagValue"
                           name="fldTagValue"
                           value="{{selectedTagValue}}"
                           ng-model="selectedTagValue"
                           size="25">
                </div>
                <div class="col-md-3">
                    <button id="btnAddTag"
                            class="btn btn-primary"
                            ng-click="addTag()">Add
                    </button>
                </div>
            </div>
            <div class="form-group form-group-sm">
                <div class="col-md-12">
                    <table id="tblTags" class="tblFormatDisplay">
                        <thead>
                        <tr>
                            <th>Tag Type</th>
                            <th>Tag Value</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr ng-repeat="row in currentArtifact.tags">
                            <td>{{row.lov.longName}}</td>
                            <td>{{row.tagValue}}</td>
                            <td><input type="checkbox" name="delTag$index" ng-click="deleteTag(row)"></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </form>

    <!-- this is the popup to add a new tag type -->
    <form id="frmAddDocType" title = "Add Document Type"
          class="form-horizontal" novalidate>

        <div class="panel panel-danger" ng-show="errors.length > 0">
            <div class="panel-heading">The Following Errors Occurred</div>
            <div class="panel-body">
                <p ng-repeat="row in errors">{{row.errorMessage}}</p>
            </div>
        </div>

        <div   class="form-group form-group-sm">
            <label class="control-label col-md-4" for="fldNewDocTypeShortName">Short Name: </label>

            <div class="col-md-8">
                <input 	class="form-control form-control-md"
                          required
                          type="text"
                          id="fldNewDocTypeShortName"
                          name="fldNewDocTypeShortName"
                          value="{{newDocTypeShortName}}"
                          ng-model="newDocTypeShortDesc"
                          maxlength="40"
                          size="40">
            </div>
        </div>
        <div   class="form-group form-group-sm">
            <label class="control-label col-md-4" for="fldNewDocTypeLongName">Long Name: </label>

            <div class="col-md-8">
                <input 	class="form-control form-control-md"
                          required
                          type="text"
                          id="fldNewDocTypeLongName"
                          name="fldNewDocTypeLongName"
                          value="{{newDocTypeLongName}}"
                          ng-model="newDocTypeLongDesc"
                          maxlength="40"
                          size="40">
            </div>
        </div>

    </form>

    <!-- this is the popup to add a new tag type -->
    <form id="frmAddTagType" title = "Add Tag Type"
          class="form-horizontal" novalidate>

        <div class="panel panel-danger" ng-show="errors.length > 0">
            <div class="panel-heading">The Following Errors Occurred</div>
            <div class="panel-body">
                <p ng-repeat="row in errors">{{row.errorMessage}}</p>
            </div>
        </div>

        <div   class="form-group form-group-sm">
            <label class="control-label col-md-4" for="fldNewTagTypeShortName">Short Name: </label>

            <div class="col-md-8">
                <input 	class="form-control form-control-md"
                          required
                          type="text"
                          id="fldNewTagTypeShortName"
                          name="fldNewTagTypeShortName"
                          value="{{newTagTypeShortName}}"
                          ng-model="newTagTypeShortDesc"
                          maxlength="40"
                          size="40">
            </div>
        </div>
        <div   class="form-group form-group-sm">
            <label class="control-label col-md-4" for="fldNewTagTypeLongName">Long Name: </label>

            <div class="col-md-8">
                <input 	class="form-control form-control-md"
                          required
                          type="text"
                          id="fldNewTagTypeLongName"
                          name="fldNewTagTypeLongName"
                          value="{{newTagTypeLongName}}"
                          ng-model="newTagTypeLongDesc"
                          maxlength="40"
                          size="40">
            </div>
        </div>

    </form>

    <!-- this is the popup for searching for an artifact -->
    <div id="searchArtifact" title = "Artifact Search">

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
                    <button id="btnSearchArtifacts"
                            class="ui-button ui-widget ui-corner-all"
                            ng-click="searchArtifacts()">Search
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
                        <th>Matching Artifact</th>
                        <th>Library Location</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr ng-repeat="row in matchingArtifactsList">
                        <td><input type="radio" name="select$index"
                                   ng-click="setSelectedArtifact(row)"								>
                        </td>
                        <td>{{row.documentTitle}}</td>
                        <td>{{row.documentLibrary}}</td>
                    </tr>
                    </tbody>
                </table>
            </fieldset>

        </form>
    </div>

</div>

</body>