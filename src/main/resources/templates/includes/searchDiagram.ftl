<form id="diagramSearch"
      title = "Diagram Search"
      class="form-horizontal" novalidate
      ng-cloak>

    <div class="well">
        <div class="input-group input-group-sm">
            <input  type="text"
                    class="form-control"
                    aria-label="Small"
                    ng-model="diagramSearchText"
                    placeholder="diagram search">
                    <span class="input-group-btn">
                        <button class="btn btn-default"
                                type="button"
                                id="btnSearch"
                                ng-click="diagramSearch()">search
                        </button>
                    </span>
        </div>

        <fieldset class="fieldSetStyle">
            <div class="form-group form-group-sm">
                <label class="control-label col-sm-2" for="fldSearchLibrary1">Library: </label>

                <div class="col-sm-5">

                    <select id="fldSearchLibrary1"
                            name="fldSearchLibrary1"
                            class="form-control"
                            ng-model="selectedLibrary1"
                            ng-options="library1.description for library1 in library1List track by library1.description"
                            ng-change="loadSearchLibrary2List()">
                    </select>
                </div>
            </div>
            <div class="form-group form-group-sm">
                <div class="col-sm-2">
                </div>
                <div class="col-sm-5">
                    <select id="fldSearchLibrary2"
                            name="fldSearchLibrary2"
                            class="form-control"
                            ng-model="selectedLibrary2"
                            ng-options="library2.description for library2 in library2List track by library2.description"
                            ng-change="loadSearchLibrary3List()">
                    </select>
                </div>
            </div>
            <div class="form-group form-group-sm">
                <div class="col-sm-2">
                </div>
                <div class="col-sm-5">
                    <select id="fldSearchLibary3"
                            name="fldSearchLibrary3"
                            class="form-control"
                            ng-model="selectedLibrary3"
                            ng-options="library3.description for library3 in library3List track by library3.description"
                            ng-change="loadDiagramList(library3.id)">
                    </select>
                </div>
            </div>
        </fieldset>
    </div>


    <table class="table table-sm table-hover">
        <tr>
            <th>
                Select
            </th>
            <th style="width:40%">
                Diagram Title
            </th>
            <th style="width:60%">
                Diagram Description
            </th>
        </tr>
        <tr ng-repeat="diagram in diagramList">
            <td>
                <input type="radio"
                       name="sel$index"
                       ng-model="selectedDiagram.id"
                       value="{{diagram.id}}"/>
            </td>
            <td style="width:40%">
                {{diagram.pageTitle}}
            </td>
            <td style="width:60%">
                {{diagram.pageDescription}}
            </td>
        </tr>
    </table>

</form>