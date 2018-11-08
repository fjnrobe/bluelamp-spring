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

    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" integrity="sha384-5SOiIsAziJl6AWe0HWRKTXlfcSHKmYV4RBF18PPJ173Kzn7jzMyFuTtk8JA7QQG1" crossorigin="anonymous">
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
                    <#if user.id == 0>
                        Create User
                    <#else>
                        Edit User
                    </#if>
                </div>
                <div class="panel-body">
                    <div class="well">

                        <form name="user" title = "CreateUser"
                              class="form-horizontal"
                              action="/saveLogin"
                              method="post"
                              novalidate>

                            <#list errors!"">
                                <div class="panel panel-danger" ng-show="errors.length > 0">
                                    <div class="panel-heading">The Following Errors Occurred</div>
                                    <div class="panel-body">
                                        <#items as error>
                                            <p>${error.errorMessage}</p>
                                        </#items>
                                    </div>
                                </div>
                            </#list>
                            </br>

                            <div   class="form-group form-group-sm">
                                <label class="control-label col-sm-2" for="firstName">First Name:</label>

                                <div class="col-sm-4">
                                    <input 	class="form-control"
                                              required
                                              type="text"
                                              id="firstName"
                                              name="firstName"
                                              value="${user.firstName}"
                                              maxlength="40"
                                              size="40">
                                </div>
                                <label class="control-label col-sm-2" for="lastName">Last Name:</label>

                                <div class="col-sm-4">
                                    <input 	class="form-control"
                                              required
                                              type="text"
                                              id="lastName"
                                              name="lastName"
                                              value="${user.lastName}"
                                              maxlength="40"
                                              size="40">
                                </div>
                            </div>

                            <div   class="form-group form-group-sm">
                                <label class="control-label col-sm-2" for="email">Email:</label>

                                <div class="col-sm-10">
                                    <input 	class="form-control"

                                              type="text"
                                              id="email"
                                              name="email"
                                              value="${user.email}"
                                              maxlength="80"
                                              size="40">
                                </div>
                            </div>

                            <div   class="form-group form-group-sm">
                                <label class="control-label col-sm-2" for="userName">User Name:</label>

                                <div class="col-sm-4">
                                    <input 	class="form-control"
                                              required
                                              type="text"
                                              id="userName"
                                              name="userName"
                                              value="${user.userName}"
                                              maxlength="15"
                                              size="15">
                                </div>
                                <!--don't show the password for existing users-->
                                <#if user.id == 0>
                                    <label class="control-label col-sm-2" for="password">Password:</label>

                                    <div class="col-sm-4">
                                        <input 	class="form-control"
                                                  required
                                                  type="text"
                                                  id="password"
                                                  name="password"
                                                  value="${user.password}"
                                                  maxlength="15"
                                                  size="15">
                                    </div>
                                </#if>
                            </div>

                            <div   class="form-group form-group-sm">
                                <div class="col-sm-2">
                                    <div class="checkbox">
                                        <label>
                                            <input type="checkbox"
                                                   name="editor"
                                                   <#if user.editor!false>checked</#if>
                                             >
                                            Editor
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div   class="form-group form-group-sm">
                                <div class="col-sm-2">
                                    <div class="checkbox">
                                        <label>
                                            <input type="checkbox"
                                                   name="administrator"
                                                    <#if user.administrator!false>checked</#if>
                                            >
                                            Administrator
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div   class="form-group form-group-sm">
                                <div class="col-sm-2">
                                    <div class="checkbox">
                                        <label>
                                            <input type="checkbox"
                                                   name="activated"
                                                   <#if user.activated!false>checked</#if>
                                            >
                                            Account Enabled
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group form-group-sm">

                                <button type="submit" class="btn btn-primary">Save</button>

                            </div>

                            <input type="hidden" name="id" value="${user.id}"/>
                        </form>


                    </div>
                </div>
            </div>
        </div>
    </div>



</div>

</body>