cd ..\src\ServiceStack.Admin.WebHost

COPY GitHubQuery.cs ..\..\tests\TestSelfHost
COPY GitHubQuery.cs ..\..\tests\TestWebHost
COPY StackOverflowQuery.cs ..\..\tests\TestSelfHost
COPY StackOverflowQuery.cs ..\..\tests\TestWebHost
COPY App_Data\db.sqlite ..\..\tests\TestSelfHost
COPY App_Data\db.sqlite ..\..\tests\TestWebHost\App_Data

COPY default.css ..\ServiceStack.Admin\ss_admin
COPY config.js ..\ServiceStack.Admin\ss_admin
COPY jspm_packages\system.js ..\ServiceStack.Admin\ss_admin

IF EXIST ..\ServiceStack.Admin\ss_admin\img (    
    RMDIR ..\ServiceStack.Admin\ss_admin\img /s /q
)

MD ..\ServiceStack.Admin\ss_admin\img

XCOPY /E img ..\ServiceStack.Admin\ss_admin\img

jspm bundle -m src\main ..\ServiceStack.Admin\ss_admin\app.js

