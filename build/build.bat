SET MSBUILD="C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\MSBuild\Current\Bin\MSBuild.exe"

%MSBUILD% build.proj /property:Configuration=Release;MinorVersion=7;PatchVersion=1
