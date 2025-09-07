# iterate through all files in the resources directory
$resourceDir = "resources"

Get-ChildItem -Path $resourceDir -Recurse | ForEach-Object {
    $file = $_

    # if is directory, skip
    if ($file.PSIsContainer) {
        Write-Host "Skipping directory: $($file.FullName)"
        return
    }

    Write-Host "Processing file: $($file.FullName)"

    $extension = $file.Extension.ToLower()

    # change jpeg to jpg
    if($extension -eq ".jpeg") {
        $extension = ".jpg"
    } 

    $newFileName = [System.IO.Path]::ChangeExtension($file.FullName, $extension)

    if ($file.FullName -cne $newFileName) {
        # Rename the file to the new extension
        Rename-Item -Path $file.FullName -NewName $newFileName -Force
        Write-Host "Renamed: $($file.FullName) to $newFileName"
    }
}