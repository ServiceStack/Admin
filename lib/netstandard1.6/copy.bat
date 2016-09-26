SET BUILD=Debug
REM SET BUILD=Release

COPY ..\..\..\ServiceStack\src\ServiceStack\bin\%BUILD%\netstandard1.6\ServiceStack.dll .\
COPY ..\..\..\ServiceStack\src\ServiceStack\bin\%BUILD%\netstandard1.6\ServiceStack.pdb .\
COPY ..\..\..\ServiceStack\src\ServiceStack\bin\%BUILD%\netstandard1.6\ServiceStack.deps.json .\
COPY ..\..\..\ServiceStack\src\ServiceStack.Client\bin\%BUILD%\netstandard1.6\ServiceStack.Client.* .\
COPY ..\..\..\ServiceStack\src\ServiceStack.Server\bin\%BUILD%\netstandard1.6\ServiceStack.Server.* .\
