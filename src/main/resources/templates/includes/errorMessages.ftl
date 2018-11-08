<div id="errorDialog" class="panel panel-danger" ng-cloak>
    <div class="panel-heading">The Following Errors Occurred</div>
    <div class="panel-body">
        <p ng-repeat="row in popupErrors">{{row.errorMessage}}</p>
    </div>
</div>