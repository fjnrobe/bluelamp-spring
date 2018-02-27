<form id="addEditProperties"
      title = "{{editPropertyTitle}}"
      class="form-horizontal" novalidate
       ng-cloak>

    <div class="panel panel-danger" ng-show="errors.length > 0">
        <div class="panel-heading">The Following Errors Occurred</div>
        <div class="panel-body">
            <p ng-repeat="row in errors">{{row.errorMessage}}</p>
        </div>
    </div>

    <div ng-show="isArtifact">
        <div  class="form-group form-group-sm">
            <label class="control-label col-sm-2" for="fldArtifactTitle">Title: </label>

            <div class="col-sm-4">
                <input 	class="form-control form-control-sm"
                          required
                          type="text"
                          id="fldArtifactTitle"
                          name="fldArtifactTitle"
                          value="{{currentArtifact.documentTitle}}"
                          ng-model="currentArtifact.documentTitle"
                          maxlength="50"
                          size="25">
            </div>

            <label class="control-label col-sm-2" for="fldAbbreviation">Abbreviation: </label>

            <div class="col-sm-4">
                <input 	class="form-control form-control-sm"
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

            <label class="control-label col-sm-2" for="fldDocType">
                <a class="anchor" ng-click="openNewDocType()">Document Type:</a>
            </label>

            <div class="col-sm-9">
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

            <label class="control-label col-sm-2" for="fldDocDetail">Detail: </label>

            <div class="col-sm-9">
                    <textarea	id="fldDocDetail"
                                 required
                                 ng-model="currentArtifact.detailedText"
                                 class="form-control form-control-sm"
                                 name="fldDocDetail" rows="2" columns="20">{{currentArtifact.detailedText}}
                    </textarea>
            </div>

        </div>
    </div>

    <div ng-show="isShape">

        <div class="form-group form-group-sm">
            <div ng-show="notALine">
                <label class="control-label col-sm-2" for="fldShapeSequence">Sequence: </label>

                <div class="col-sm-4">
                    <input 	class="form-control form-control-sm"
                            type="text"
                            id="fldShapeSequence"
                            name="fldShapeSequence"
                            value="{{currentShapeSeqNumber}}"
                            ng-model="currentShapeSeqNumber"
                            maxlength="3"
                            size="3">
                </div>
            </div>
        </div>
        <div class="form-group form-group-sm">

            <label class="control-label col-sm-2" for="fldShapeText">Text: </label>

            <div class="col-sm-9">
                <textarea	id="fldShapeText"
                             required
                             ng-model="currentShapeText"
                             class="form-control form-control-sm"
                             name="fldDocDetail" rows="2" columns="60">
                    {{currentShapeText}}
                </textarea>
            </div>
        </div>
    </div>

    <div ng-show="isPage">
        <div  class="form-group form-group-sm">
            <label class="control-label col-sm-2" for="fldPageTitle">Title: </label>

            <div class="col-sm-8">
                <input 	class="form-control form-control-sm"
                          required
                          type="text"
                          id="fldPageTitle"
                          name="fldPageTitle"
                          value="{{currentPage.pageDto.pageTitle}}"
                          ng-model="currentPage.pageDto.pageTitle"
                          maxlength="50"
                          size="25">
            </div>
        </div>
        <div  class="form-group form-group-sm">
            <label class="control-label col-sm-2" for="fldPageDescription">Description: </label>

            <div class="col-sm-8">
                <textarea	id="fldPageDescription"
                             class="form-control form-control-sm"
                     ng-model="currentPage.pageDto.pageDescription"
                     name="fldPageDescription" rows="2" columns="20">
                    {{currentPage.pageDto.pageDescription}}</textarea>
            </div>
        </div>
    </div>

    <div ng-show="notALine">
        <fieldset class="fieldSetStyle">
            <legend>{{artifactGroupLabel}}</legend>
            <div class="form-group form-group-sm">
                <label class="control-label col-sm-2" for="fldLibrary1">Categorize: </label>

                <div class="col-sm-5">

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
                <div class="col-sm-2">
                </div>
                <div class="col-sm-5">
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
                <div class="col-sm-2">
                </div>
                <div class="col-sm-5">
                    <select id="fldLibary3"
                            name="fldLibrary3"
                            class="form-control"
                            ng-model="selectedLibrary3"
                            ng-options="library3.description for library3 in library3List track by library3.description"
                            ng-change="loadArtifactList()">
                    </select>
                </div>
            </div>
            <div ng-hide="isArtifact">
                <div class="form-group form-group-sm">
                    <div class="col-sm-2"></div>
                    <div class="col-sm-5">
                        <select id="fldPageArtifact"
                                name="fldPageArtifact"
                                class="form-control"
                                ng-model="selectedArtifact"
                                ng-options="artifact.abbreviation for artifact in artifactList track by artifact.abbreviation">
                        </select>
                    </div>

                    <div ng-show="selectedArtifact.id != null">
                        <div class="col-sm-2">
                            <button id="btnShowArtifact"
                                    class="ui-button ui-widget ui-corner-all"
                                    ng-click="showArtifact()">Open
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>
    </div>

    <div class="well">
        <div class="form-group form-group-sm">

            <label class="control-label col-sm-2" for="fldPageAnnotation">Annotation:</label>
            <div class="col-sm-7">
                <textarea	id="fldPageAnnotation"
                             class="form-control form-control-sm"
                             ng-model="annotation.annotationText"
                             name="fldAnnotation" rows="2" columns="40">
                    {{annotation.annotationText}}
                </textarea>
            </div>
            <div class="col-sm-1">
                <button id="btnPageAddAnnotation"
                        class="ui-button ui-widget ui-corner-all"
                        ng-click="addAnnotation()">Add
                </button>
            </div>
        </div>

        <div class="form-group form-group-sm">
            <div class="col-sm-12">
                <table id="tblPageAnnotations" class="table table-bordered table-sm">
                    <thead>
                    <tr>
                        <th>Annotations</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat = "row in annotations">
                            <td colwidth="90%">
                                <textarea id="fldPageAnnotation$index"
                                          class="form-control form-control-sm"
                                          ng-model="annotations[$index].annotationText"
                                          rows="2" columns="80" readonly>{{annotations[$index].annotationText}}</textarea>
                            </td>
                            <td colwidth="10%">
                                <input type="checkbox"
                                       name="delPageAnnotation$index"
                                       ng-click="deleteAnnotation(row)">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="well">
        <div class="form-group form-group-sm">
            <label class="control-label col-sm-2" for="fldTagType">
                <a class="anchor" ng-click="openNewTag()">Tag(s):</a>
            </label>

            <div class="col-sm-4">
                <select id="fldTagType" name="fldTagType" class="form-control"
                        ng-model="selectedTagType"
                        ng-options="tagValue.longName for tagValue in tagLibrary">
                    <option></option>
                </select>
            </div>

            <div class="col-sm-3">
                <input class="form-control form-control-sm"
                       type="text"
                       id="fldTagValue"
                       name="fldTagValue"
                       value="{{selectedTagValue}}"
                       ng-model="selectedTagValue"
                       size="25">
            </div>
            <div class="col-sm-3">
                <button id="btnAddTag"
                        class="ui-button ui-widget ui-corner-all"
                        ng-click="addTag()">Add
                </button>
            </div>
        </div>
        <div class="form-group form-group-sm">
            <div class="col-sm-12">
                <table id="tblTags" class="tblFormatDisplay">
                    <thead>
                    <tr>
                        <th>Tag Type</th>
                        <th>Tag Value</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr ng-repeat="row in tags">
                        <td>{{row.lovDto.longName}}</td>
                        <td>{{row.tagValue}}</td>
                        <td><input type="checkbox" name="delTag$index" ng-click="deleteTag(row)"></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</form>