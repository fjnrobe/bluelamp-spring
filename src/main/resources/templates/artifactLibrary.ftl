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
    <script src="/scripts/js/common.js"></script>
    <script src="/scripts/controllers/baseController.js"></script>
    <script src="/scripts/services/libraryService.js"></script>
    <script src="/scripts/services/artifactService.js"></script>
    <script src="/scripts/services/tagService.js"></script>
    <script src="/scripts/services/lovService.js"></script>

    <script src="/scripts/controllers/artifactLibraryController.js"></script>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" integrity="sha384-5SOiIsAziJl6AWe0HWRKTXlfcSHKmYV4RBF18PPJ173Kzn7jzMyFuTtk8JA7QQG1" crossorigin="anonymous">
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="/scripts/vendor/jquery.contextMenu.css" />
    <link rel="stylesheet" href="/scripts/vendor/jquery-ui.css" />
    <link rel="stylesheet" href="/css/font-awesome-4.7.0/css/font-awesome.css" />
    <link rel="stylesheet" href="/css/bluelamp.css" />
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

    <script type="application/json" id="userProfile">
        ${userProfile}
    </script>

</head>
<body>
<div ng-app="bluelamp" ng-controller="artifactLibraryController" id="artifactLibraryController">
    <#include "/includes/menu.ftl" />

    <div class="container-fluid" ng-cloak>
        <div class="panel-group">
            <div class="panel panel-primary">
                <div class="panel-heading">
                    Artifact Catalog <a class="helplink" onClick="openHelp(1)">help <i class="fas fa-info"></i></a>
                </div>
                <div class="panel-body">
                    <div class="input-group input-group-sm">
                        <input type="text"
                               id="txtSearch"
                               class="form-control"
                               aria-label="Small"
                               ng-model="artifactSearchText"
                               placeholder="artifact search">
                        <span class="input-group-btn">
                            <button class="btn btn-default"
                                    type="search"
                                    id="btnSearch"
                                    ng-click="artifactSearch()">search</button>
                        </span>
                    </div>
                    <div class="well">
                        <div class="dataTables_scrollHeadInner">
                            <ul>
                                <li class="libraryHeader1 libraryItem"
                                    ng-repeat="library1 in libraryList"
                                    id="{{library1.id}}"
                                    ng-click="showHideArtifacts(this)"
                                    data-library-id="{{library1.id}}"
                                    data-library-level="{{library1.level}}">
                                    <i class="fas fa-folder"
                                       ng-show="!library1.expanded"></i>
                                    <i class="far fa-folder-open"
                                       ng-show="library1.expanded"></i>
                                    {{library1.description}} [{{library1.subLibraryList.length || library1.subLibraryCount}}] (<i class="far fa-file"></i> {{library1.artifactCount}})
                                    <ul  ng-hide="!library1.expanded" >
                                        <li   class="libraryItem libraryHeader2"
                                              ng-repeat="library2 in library1.subLibraryList"
                                              id="{{library2.id}}"
                                              ng-click="showHideArtifacts(this); $event.stopPropagation();"
                                              data-library-id="{{library2.id}}"
                                              data-library-level="{{library2.level}}">
                                              <i class="fas fa-folder"
                                               ng-show="!library2.expanded"></i>
                                              <i class="far fa-folder-open"
                                               ng-show="library2.expanded"></i>
                                            {{library2.description}} [{{library2.subLibraryList.length || library2.subLibraryCount}}] (<i class="far fa-file"></i> {{library2.artifactCount}})
                                            <ul  ng-hide="!library2.expanded">
                                                <li class="libraryItem libraryHeader3"
                                                    ng-repeat="library3 in library2.subLibraryList"
                                                    id="{{library3.id}}"
                                                    ng-click="showHideArtifacts(this); $event.stopPropagation();"
                                                    data-library-id="{{library3.id}}"
                                                    data-library-level="{{library3.level}}">
                                                    {{library3.description}} (<i class="far fa-file"></i> {{library3.artifactCount}})
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
                    Artifacts: {{artifactFilterCriteria}}
                </div>
                <div class="panel-body">
                    <div class="well">

                        <table class="table table-hover table-condensed">
                            <tr>
                                <th>
                                    Artifact Title
                                </th>
                                <th>
                                    Library
                                </th>

                            </tr>
                            <tbody>
                                <tr ng-repeat="artifact in artifactList">
                                    <td>
                                        <div class="artifactItem"
                                             data-artifact-id="{{artifact.id}}">{{artifact.documentTitle}}</div>
                                    </td>
                                    <td>
                                        {{artifact.libraryAncestry}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <#include "/includes/addEditProperties.ftl" />

    <!-- this is the popup to add a new document type -->
    <form id="frmAddDocType" title = "Add Document Type"
          class="form-horizontal" novalidate ng-cloak>

        <div class="panel panel-danger" ng-show="popupErrors.length > 0">
            <div class="panel-heading">The Following Errors Occurred</div>
            <div class="panel-body">
                <p ng-repeat="row in popupErrors">{{row.errorMessage}}</p>
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
    <#include "/includes/addTagType.ftl" />

    <!--this is the popup for the help -->
    <#include "/includes/helpDialog.ftl" />

    <!--this is teh popup for error messages -->
    <#include "/includes/errorMessages.ftl" />
</div>

</body>