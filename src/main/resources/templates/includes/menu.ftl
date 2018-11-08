<div class="header">
    <ul class="nav nav-tabs">
        <li class="nav-item">
            <a class="nav-link" href="/home">Home</a>
        </li>
        <li class="nav-item">
            <a class="nav-link active" href="/libraryHome">Library Catalog</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/artifactHome">Artifacts</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/diagramHome">Diagrams</a>
        </li>
        <#if (userInfo.administrator == true)>
            <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown"
                   role="button" aria-haspopup="true"
                   aria-expanded="false">Admin<span class="caret"></span>
                </a>
                <ul class="dropdown-menu">
                    <li><a href="/saveLogin">Create Login</a></li>
                    <li role="separator" class="divider"></li>
                    <li><a href="/editLogins">Maintain Logins</a></li>
                </ul>
            </li>
        </#if>

        <#if !userInfo.loggedIn>
            <li class="nav-item navbar-right">
                <p class="navbar-text">Guest</p>
            </li>
            <li class="nav-item navbar-right">
                <a href="/login">Login</a>
            </li>

        <#else>
            <li class="nav-item navbar-right">
                <p class="navbar-text">Greetings, ${userInfo.firstName}  </p>
            </li>
            <li class="nav-item navbar-right">
                <a href="/logout">Logout</a>
            </li>
        </#if>
    </ul>
</div>