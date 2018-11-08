<form id="frmEmailMessage" title = "Share Diagram"
      class="form-horizontal" novalidate ng-cloak>

    <div class="panel panel-danger" ng-show="popupErrors.length > 0">
        <div class="panel-heading">The Following Errors Occurred</div>
        <div class="panel-body">
            <p ng-repeat="row in popupErrors">{{row.errorMessage}}</p>
        </div>
    </div>

    <div   class="form-group form-group-sm">
        <label class="control-label col-md-4" for="fldRecipient">Share Diagram With: </label>

        <div class="col-md-8">
            <input 	class="form-control form-control-sm"
                      required
                      type="text"
                      id="fldRecipient"
                      name="fldRecipient"
                      ng-model="emailRecipient"
                      maxlength="100"
                      size="100">
        </div>
    </div>

</form>
