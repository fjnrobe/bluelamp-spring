
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

    <div id="tabs">
        <ul>
            <li><a href="#general-1">General</a></li>
            <li><a href="#annotations-2">Comments</a></li>
            <li><a href="#tags-3">Tags</a></li>
        </ul>

        <div id="general-1">
            <div ng-show="isArtifact">
                <div  class="form-group form-group-sm">
                    <label class="control-label col-sm-2" for="fldArtifactTitle" >Title: </label>

                    <div class="col-sm-4">
                        <input 	class="form-control form-control-sm"
                                  required
                                  type="text"
                                  id="fldArtifactTitle"
                                  name="fldArtifactTitle"
                                  value="{{currentArtifact.documentTitle}}"
                                  ng-model="currentArtifact.documentTitle"
                                  ng-disabled="!userProfile.editor"
                                  maxlength="50"
                                  size="25"
                                  autofocus>
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
                                  ng-disabled="!userProfile.editor"
                                  maxlength="50"
                                  size="25">
                    </div>

                </div>

                <div class="form-group form-group-sm">

                    <label class="control-label col-sm-2" for="fldDocType">
                        <div ng-show="userProfile.editor">
                            <a class="anchor" ng-click="openNewDocType()">Document Type:</a>
                        </div>
                        <div ng-show="!userProfile.editor">
                            Document Type:
                        </div>
                    </label>

                    <div class="col-sm-9">
                        <select id="fldDocType"
                                name="fldDocType"
                                required
                                class="form-control"
                                ng-model="currentArtifact.documentType"
                                ng-disabled="!userProfile.editor"
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
                                         ng-disabled="!userProfile.editor"
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
                                    ng-disabled="!userProfile.editor"
                                    maxlength="3"
                                    size="3"
                                    autofocus>
                        </div>
                    </div>
                </div>
                <div class="form-group form-group-sm">

                    <label class="control-label col-sm-2" for="fldShapeText">Text: </label>

                    <div class="col-sm-9">
                        <textarea	id="fldShapeText"
                                     required
                                     ng-model="currentShapeText"
                                     ng-disabled="!userProfile.editor"
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
                                  value="{{pageTitle}}"
                                  ng-model="pageTitle"
                                  ng-disabled="!userProfile.editor"
                                  maxlength="50"
                                  size="25"
                                  autofocus>
                    </div>
                </div>
                <div  class="form-group form-group-sm">
                    <label class="control-label col-sm-2" for="fldPageDescription">Description: </label>

                    <div class="col-sm-8">
                        <textarea	id="fldPageDescription"
                                     class="form-control form-control-sm"
                             ng-model="pageDescription"
                             ng-disabled="!userProfile.editor"
                             name="fldPageDescription" rows="2" columns="20">
                            {{pageDescription}}</textarea>
                    </div>
                </div>
            </div>

            <div ng-show="showCategoryFields">
                <fieldset class="fieldSetStyle">
                    <div class="form-group form-group-sm">
                        <label class="control-label col-sm-2" for="fldLibrary1">Library: </label>

                        <div class="col-sm-5">

                            <select id="fldLibrary1"
                                    name="fldLibrary1"
                                    class="form-control"
                                    ng-model="selectedLibrary1"
                                    ng-disabled="!userProfile.editor"
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
                                    ng-disabled="!userProfile.editor"
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
                                    ng-disabled="!userProfile.editor"
                                    ng-options="library3.description for library3 in library3List track by library3.description"
                                    ng-change="loadArtifactList()">
                            </select>
                        </div>
                    </div>
                    <div ng-hide="isArtifact">
                        <div class="form-group form-group-sm">
                            <div class="control-label  col-sm-2">Artifact:</div>
                            <div class="col-sm-5">
                                <select id="fldPageArtifact"
                                        name="fldPageArtifact"
                                        class="form-control"
                                        ng-model="selectedArtifact"
                                        ng-disabled="!userProfile.editor"
                                        ng-options="artifact.abbreviation for artifact in artifactList track by artifact.abbreviation">
                                </select>
                            </div>

                            <div ng-show="selectedArtifact.id != null">
                                <div class="col-sm-2">
                                    <button id="btnShowArtifact"
                                            class="btn btn-primary btn-xs"
                                            ng-click="showArtifact()">Open
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div ng-show="showDocumentUpload">
                        <div class="form-group form-group-sm" >
                            <label class="control-label col-sm-2" for="fileUpload">Document: </label>

                            <div class="col-sm-8" ng-show="userProfile.editor">
                                <input class="form-control" type="file" id="fileUpload">
                            </div>
                            <div class="col-sm-2" ng-show="userProfile.editor">
                                <button id="btnCancelDocument"
                                        class="btn btn-primary btn-xs"
                                        ng-show="currentArtifact.documentName != null"
                                        ng-click="setShowDocumentUpload(false)">Cancel
                                </button>
                            </div>
                        </div>
                    </div>

                    <div ng-show="showDocumentUpload == false">

                        <div class="form-group form-group-sm" >
                            <label class="control-label col-sm-2">Document: </label>
                            <div class="col-sm-6">
                                <a class = "anchor"
                                   download="{{currentArtifact.documentName}}"
                                   href="/download/{{currentArtifact.id}}">{{currentArtifact.documentName}}
                                </a>

                            </div>
                            <div class="col-sm-4" ng-show="userProfile.editor">
                                <button type="button"
                                        id="btnReplaceDocument"
                                        class="btn btn-primary btn-xs"
                                        ng-click="setShowDocumentUpload(true)">Replace
                                </button>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
        </div>

        <div id="annotations-2">
            <div class="well">
                <div class="form-group form-group-sm"  ng-show="userProfile.editor">

                    <label class="control-label col-sm-2" for="fldPageAnnotation">Comment:</label>
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
                                class="btn btn-primary btn-xs"
                                ng-click="addAnnotation()">Add
                        </button>
                    </div>
                </div>

                <div class="form-group form-group-sm"  ng-show="showSharedCheckbox || saveAsTemplate">

                    <label class="control-label col-sm-2" for="fldSharedComment">Shared:</label>
                    <div class="col-sm-7">
                        <input type="checkbox"
                               id="fldSharedComment"
                               ng-model="annotation.sharedInd"
                               title="check this box if the comment should be visible to all copies of this shared shape">
                    </div>
                </div>

                <div class="form-group form-group-sm">
                    <div class="col-sm-12">
                        <table id="tblPageAnnotations" class="table table-bordered table-sm">
                            <thead>
                            <tr>
                                <th>Annotations</th>
                                <th>Shared</th>
                                <div  ng-show="userProfile.editor">
                                    <th>Delete</th>
                                </div>
                            </tr>
                            </thead>
                            <tbody id="annotationList">
                                <tr ng-repeat = "row in annotations">
                                    <td colwidth="85%">
                                        <textarea id="fldPageAnnotation$index"
                                                  class="form-control form-control-sm"
                                                  ng-model="annotations[$index].annotationText"
                                                  rows="2" columns="80" readonly>{{annotations[$index].annotationText}}</textarea>
                                    </td>
                                    <td colwidth="5%">
                                        {{row.sharedInd}}
                                    </td>
                                    <div ng-show="userProfile.editor">
                                        <td colwidth="10%">
                                            <input type="checkbox"
                                                   name="delPageAnnotation$index"
                                                   ng-click="deleteAnnotation(row)">
                                        </td>
                                    </div>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div id="tags-3">
            <div class="well">
                <div class="form-group form-group-sm" ng-show="userProfile.editor">
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

                    <button id="btnAddTag"
                            class="btn btn-primary btn-xs"
                            ng-click="addTag()">Add
                    </button>
                </div>

                <div class="form-group form-group-sm"  ng-show="showSharedCheckbox || saveAsTemplate">

                    <label class="control-label col-sm-2" for="fldSharedTag">Shared:</label>
                    <div class="col-sm-7">
                        <input type="checkbox"
                               id="fldSharedTag"
                               ng-model="selectedTagShared"
                               title="check this box if the tag should be visible to all copies of this shared shape">
                    </div>
                </div>

                <div class="form-group form-group-sm">
                    <div class="col-sm-12">
                        <table id="tblTags" class="tblFormatDisplay">
                            <thead>
                                <tr>
                                    <th>Tag Type</th>
                                    <th>Tag Value</th>
                                    <th>Shared</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr ng-repeat="row in tags">
                                <td>{{row.lovDto.longName}}</td>
                                <td>{{row.tagValue}}</td>
                                <td>
                                    {{row.sharedInd}}
                                </td>
                                <td><input type="checkbox"
                                           name="delTag$index"
                                           ng-click="deleteTag(row)"></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div ng-hide="currentShape.properties.templateId == null"
         style="margin-top:10px">
        <div class="form-group form-group-sm">

            <label class="control-label col-sm-2">Template Name: </label>
            <div class="col-sm-6">
                <input 	class="form-control form-control-sm"
                          type="text"
                          ng-model="saveTemplateName"
                          readonly
                          size="15"/>
            </div>
        </div>
    </div>

    <div ng-show="showSaveAsTemplate"
         style="margin-top:10px">
        <div class="form-group form-group-sm">

            <label class="control-label col-sm-2" for="chkSaveAsTemplate">Save As Template: </label>

            <div class="col-sm-1">
                <input type="checkbox"
                       id="chkSaveAsTemplate"
                       ng-model="saveAsTemplate"
                       name="chkSaveAsTemplate"/>
            </div>

            <label class="control-label col-sm-2" for="fldSaveAsTemplateName">Template Name: </label>

            <div class="col-sm-6">
                <input 	class="form-control form-control-sm"
                          type="text"
                          id="fldSaveAsTemplateName"
                          name="fldSaveAsTemplateName"
                          ng-model="saveTemplateName"
                          ng-show="saveAsTemplate"
                          maxlength="15"
                          size="15">
            </div>
        </div>
    </div>
</form>