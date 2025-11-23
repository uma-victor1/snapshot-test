

@echo off
echo === LambdaTest SmartUI Test Runner ===
echo.

REM Load environment variables from .env file
if exist .env (
    echo Loading credentials from .env file...
    for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
        if not "%%a"=="" if not "%%b"=="" (
            REM Skip comments
            echo %%a | findstr /b "#" >nul
            if errorlevel 1 (
                set %%a=%%b
            )
        )
    )
    echo Credentials loaded successfully.
) else (
    echo ERROR: .env file not found!
    echo Please copy .env.example to .env and add your credentials.
    exit /b 1
)

REM Validate credentials are set
if "%LT_USERNAME%"=="" (
    echo ERROR: LT_USERNAME not set in .env file
    exit /b 1
)
if "%LT_ACCESS_KEY%"=="" (
    echo ERROR: LT_ACCESS_KEY not set in .env file
    exit /b 1
)

echo.
echo Running SmartUI tests...
npm test

echo.
echo Tests completed.