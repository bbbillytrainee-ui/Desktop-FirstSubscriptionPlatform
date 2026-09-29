# Starts the local demo: database (port 54329), API (8765) and website (8443), then opens the site.
# Run from the repository root:   powershell -ExecutionPolicy Bypass -File .\start-demo.ps1
# Stop: close the two server windows (the database keeps running; that's fine).

param([switch]$NoBrowser)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$pgBin = "C:\Program Files\PostgreSQL\18\bin"
$dataDir = Join-Path $root "backend\.localdb"
# The PowerShell running this script (works even when powershell.exe isn't on PATH)
$shell = (Get-Process -Id $PID).Path

function Test-Port($port) {
    $null -ne (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)
}

# Both servers open their port only once they're ready to serve. (Checking by port rather than HTTP:
# Windows PowerShell may resolve "localhost" to IPv6 first, which uvicorn doesn't listen on.)
function Wait-Port($port, $seconds) {
    for ($i = 0; $i -lt $seconds; $i++) {
        if (Test-Port $port) { return $true }
        Start-Sleep -Seconds 1
    }
    return $false
}

# 1. Database
if (Test-Port 54329) {
    Write-Host "Database already running on 54329"
} else {
    Write-Host "Starting database..."
    # Hidden, and wait for pg_ctl only (-w: it exits once the database accepts connections).
    # Piping pg_ctl's output instead can hang: the database process inherits the pipe.
    $pgArgs = @("-D", "`"$dataDir`"", "-l", "`"$(Join-Path $dataDir 'server.log')`"", "start", "-w")
    $pgCtl = Start-Process "$pgBin\pg_ctl.exe" -ArgumentList $pgArgs -WindowStyle Hidden -PassThru
    $pgCtl.WaitForExit()
    if (-not (Wait-Port 54329 30)) { Write-Host "The database didn't start: see $dataDir\server.log" -ForegroundColor Red; exit 1 }
}

# 2. API
if (Test-Port 8765) {
    Write-Host "API already running on 8765"
} else {
    Write-Host "Starting API (new window)..."
    Start-Process $shell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\backend'; `$host.UI.RawUI.WindowTitle='Mediverse API'; uv run uvicorn app.main:app --port 8765"
}

# 3. Website
if (Test-Port 8443) {
    Write-Host "Website already running on 8443"
} else {
    Write-Host "Starting website (new window)..."
    Start-Process $shell -ArgumentList "-NoExit", "-Command", "Set-Location '$root'; `$host.UI.RawUI.WindowTitle='Mediverse website'; npx vite --port 8443 --strictPort"
}

Write-Host "Waiting for the API and website..."
$apiUp = Wait-Port 8765 90
$siteUp = Wait-Port 8443 90
if (-not ($apiUp -and $siteUp)) {
    Write-Host "Something didn't start (API: $apiUp, website: $siteUp). Check the two server windows." -ForegroundColor Red
    exit 1
}

Write-Host "Ready. API docs: http://localhost:8765/docs" -ForegroundColor Green
if (-not $NoBrowser) { Start-Process "http://localhost:8443/" }
