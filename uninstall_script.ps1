#First ensure you run this script with administrative privileges as uninstalling applications typically requires elevated permissions.
if(-not([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)){
 Write-Warning "This script must be run as a administrator!"
Exit
}

#Step 1: Definte the target registry paths
$regPaths = @(
    "HKLM:\Software]Microsoft\Windows\CurrentVersion\Uninstall\*",
    "HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*"
)
#Step 2: Get all installed applications from the defined registry paths
$allInstalledApps = Get-ItemProperty -Path $regPaths -ErrorAction SilentlyContinue

#Step 3: Filter list to find only Java 24 or whatever application you want to find
$java24Apps = $allInstalledApps | Where-Object {$_.DisplayName -match "Java.*24" -or $_.DisplayName -match "JDK.*24"}

#Step 4 : Error handling if no applications found
if($null -eq $java24Apps){
    Write-Host "No Java 24 applications found. Exiting Script." -ForegroundColor Green
        Exit
}

#Step 5 Loop through each java 24 installation found
foreach($app in $java24Apps){
    #Check if the uninstaller string contains an MSI product code (curly braces)
    if($app.UninstallString -match "{.*}"){
        $productCode = $Matches[0] # Matches[0] grabs the exact text found inside the braces
    Write-Host "Uninstalling $($app.DisplayName)..." -ForegroundColor Cyan
        
        #Trigger the silent uninstallation
        Start-Process -FilePath "msiexec.exe" -ArgumentList "/x $productCode /qn  /norestart" -Wait
    }
}
