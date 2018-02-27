<form id="frmAddTagType" title = "Add Tag Type"
      class="form-horizontal" novalidate ng-cloak>

    <div class="panel panel-danger" ng-show="popupErrors.length > 0">
        <div class="panel-heading">The Following Errors Occurred</div>
        <div class="panel-body">
            <p ng-repeat="row in popupErrors">{{row.errorMessage}}</p>
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
