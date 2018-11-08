<form id="artifactInfoAI"
      title = "Artifact Summary"
      class="form-horizontal" novalidate
       ng-cloak>

        <div  class="form-group form-group-sm">
            <label class="control-label col-sm-2" for="fldArtifactTitle">Title: </label>

            <div class="col-sm-4">
                <input 	class="form-control form-control-sm"
                        type="text"
                        readonly
                        id="fldArtifactTitle"
                        value="{{currentArtifact.documentTitle}}"
                        maxlength="50"
                        size="25"/>
            </div>

            <label class="control-label col-sm-2" for="fldAbbreviation">Abbreviation: </label>

            <div class="col-md-4">
                <input 	class="form-control form-control-sm"
                        type="text"
                        readonly
                        id="fldAbbreviation"
                        value="{{currentArtifact.abbreviation}}"
                        maxlength="50"
                        size="25"/>
            </div>
        </div>

        <div class="form-group form-group-sm">

            <label class="control-label col-sm-2" for="fldAIDocType">
                Document Type:
            </label>

            <div class="col-sm-9">
                <input id="fldAIDocType"
                       type="text"
                       readonly
                       class="form-control form-control-sm"
                       value="{{currentArtifact.documentType.longName}}"/>
            </div>
        </div>


        <div class="form-group form-group-sm">

            <label class="control-label col-sm-2" for="fldAIDocDetail">Detail: </label>

            <div class="col-sm-9">
                    <textarea	id="fldAIDocDetail"
                                 readonly
                                 class="form-control form-control-sm"
                                 rows="2" columns="60">{{currentArtifact.detailedText}}
                    </textarea>
            </div>
        </div>

        <fieldset class="fieldSetStyle">

            <div class="form-group form-group-sm">
                <label class="control-label col-sm-2" for="fldAILibrary1">Categorize: </label>

                <div class="col-sm-5">

                    <input id="fldAILibrary1"
                           class="form-control form-control-sm"
                           type="text"
                           readonly
                           value="{{library1Description}}"/>
                </div>
            </div>
            <div class="form-group form-group-sm">
                <div class="col-sm-2">
                </div>
                <div class="col-sm-5">
                    <input id="fldAILibrary2"
                            class="form-control form-control-sm"
                            type="text"
                            readonly
                            value="{{library2Description}}"/>
                </div>
            </div>
            <div class="form-group form-group-sm">
                <div class="col-sm-2">
                </div>
                <div class="col-sm-5">
                    <input id="fldAILibary3"
                            class="form-control form-control-sm"
                            type="text"
                            readonly
                            value="{{library3Description}}"/>
                </div>
            </div>

            <div class="form-group form-group-sm" >
                <label class="control-label col-sm-2">Document: </label>
                <div class="col-sm-6">
                    <a class = "anchor"
                       download="{{currentArtifact.documentName}}"
                       href="/download/{{currentArtifact.id}}">{{currentArtifact.documentName}}
                    </a>
                </div>
            </div>
        </fieldset>

        <div class="well">

            <div class="form-group form-group-sm">
                <div class="col-sm-12">
                    <table class="table table-bordered table-sm">
                        <thead>
                        <tr>
                            <th>Annotations</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr ng-repeat = "row in currentArtifact.annotationDtos">
                                <td>
                                    <textarea readonly
                                              class="form-control form-control-sm"
                                              rows="2" columns="80" readonly>
                                                {{row.annotationText}}
                                    </textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="well">
            <div class="form-group form-group-sm">
                <div class="col-sm-12">
                    <table class="table table-bordered table-sm">
                        <thead>
                        <tr>
                            <th>Tag Type</th>
                            <th>Tag Value</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr ng-repeat="row in currentArtifact.tagDtos">
                            <td>{{row.lovDto.longName}}</td>
                            <td>{{row.tagValue}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
</form>