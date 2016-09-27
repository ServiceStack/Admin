@echo off
SET BUILD=Debug
REM SET BUILD=Release

SET NOBUILD=--no-build

PUSHD ..\..\..\Admin\src\ServiceStack.Admin\
dotnet pack %NOBUILD% --configuration %BUILD%
POPD
COPY ..\..\..\Admin\src\ServiceStack.Admin\bin\%BUILD%\ServiceStack.Admin.1.0.0.* .\packages\
