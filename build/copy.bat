REM SET BUILD=Debug
SET BUILD=Release

COPY ..\src\ServiceStack.Admin\bin\%BUILD%\net45\ServiceStack.Aws.* ..\..\ServiceStack\lib
COPY ..\src\ServiceStack.Admin\bin\%BUILD%\netstandard1.6\ServiceStack.Aws.* ..\..\ServiceStack\lib\netstandard1.6
COPY ..\src\ServiceStack.Admin\bin\%BUILD%\ServiceStack.Admin.* C:\src\ServiceStack\lib\tests
