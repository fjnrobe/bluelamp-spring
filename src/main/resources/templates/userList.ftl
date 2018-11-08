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
    <script src="/scripts/vendor/angular.min.js"></script>

    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
</head>
<body>
<div>
    <#include "/includes/menu.ftl" />

    <div class="container-fluid">
        <div class="panel-group">

            <div class="panel panel-primary">
                <div class="panel-heading">
                    User List
                </div>
                <div class="panel-body">
                    <div class="well">
                        <table class="table table-sm table-hover">
                            <tr>
                                <th style="width:20%">
                                    User Name
                                </th>
                                <th style="width:30%">
                                    First Name
                                </th>
                                <th style="width:50%">
                                    Last Name
                                </th>
                            </tr>
                            <#list users!"">
                                <#items as user>
                                    <tr>
                                        <td>
                                            <a href="/editLogin/${user.userName}">${user.userName}</a>
                                        </td>
                                        <td>
                                            ${user.firstName}
                                        </td>
                                        <td>
                                            ${user.lastName}
                                        </td>
                                    </tr>
                                </#items>

                            </#list>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>

</body>