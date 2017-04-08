REM SET BUILD=Debug
SET BUILD=Release

COPY C:\src\ServiceStack.OrmLite\src\ServiceStack.Redis\bin\%BUILD%\net45\ServiceStack.Redis.* .
COPY C:\src\ServiceStack.OrmLite\src\ServiceStack.Redis\bin\%BUILD%\netstandard1.3\ServiceStack.Redis.* netstandard1.3\
COPY C:\src\ServiceStack.OrmLite\src\ServiceStack.OrmLite\bin\%BUILD%\net45\ServiceStack.OrmLite.* .
COPY C:\src\ServiceStack.OrmLite\src\ServiceStack.OrmLite\bin\%BUILD%\netstandard1.3\ServiceStack.OrmLite.* netstandard1.3\
COPY C:\src\ServiceStack.OrmLite\src\ServiceStack.OrmLite.Sqlite\bin\%BUILD%\net45\ServiceStack.OrmLite.Sqlite.* .
COPY C:\src\ServiceStack.OrmLite\src\ServiceStack.OrmLite.Sqlite\bin\%BUILD%\netstandard1.3\ServiceStack.OrmLite.Sqlite.* netstandard1.3\
COPY C:\src\ServiceStack\src\ServiceStack\bin\%BUILD%\net45\ServiceStack.* .
COPY C:\src\ServiceStack\src\ServiceStack\bin\%BUILD%\netstandard1.6\ServiceStack.* netstandard1.6\
COPY C:\src\ServiceStack\src\ServiceStack.Server\bin\%BUILD%\net45\ServiceStack.Server.* .
COPY C:\src\ServiceStack\src\ServiceStack.Server\bin\%BUILD%\netstandard1.6\ServiceStack.Server.* netstandard1.6\
COPY C:\src\ServiceStack\lib\signed\* signed\
