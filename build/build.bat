SET MSBUILD="C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\MSBuild\15.0\Bin\MSBuild.exe"

%MSBUILD% build-core.proj /target:TeamCityBuild;NuGetPack /property:Configuration=Release;PatchVersion=41
%MSBUILD% build.proj /target:TeamCityBuild;NuGetPack /property:Configuration=Release;PatchVersion=9
REM %MSBUILD% build-sn.proj /target:NuGetPack /property:Configuration=Signed;PatchVersion=9
REM exit

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

REM jspm bundle src/app.js - [./src/**/*] ./deps.lib.js

REM old-style bundling
REM jspm bundle -m src/app.js ../ServiceStack.Admin/ss_admin/app.js

REM jspm build -m src/app.js ../ServiceStack.Admin/ss_admin/app.js
