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
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/bluelamp.css" />

</head>
<body>
<nav class="navbar navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">Simple Design</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
            <form class="navbar-form navbar-right"  method="POST" action="/loginProc">
                <div class="form-group">
                    <input type="text" placeholder="User Name" class="form-control"
                           required
                           type="text"
                           id="fldUserName"
                           name="fldUserName">
                </div>
                <div class="form-group">
                    <input type="password" placeholder="Password" class="form-control"
                           required
                           id="fldPassword"
                           name="fldPassword">
                </div>
                <button type="submit" class="btn btn-success">Sign in</button>
            </form>
        </div><!--/.navbar-collapse -->
    </div>
</nav>
<#if RequestParameters.error??>

    <div class="panel panel-danger" style="margin-top:75">
        <div class="panel-heading">Login Failure</div>
        <div class="panel-body">
            The User Id and/or the Password was invalid
        </div>
    </div>
</#if>
<#include "/includes/homeContent.ftl" />

</body>
</html>