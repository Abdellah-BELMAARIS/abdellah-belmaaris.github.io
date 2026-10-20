Add-Type -AssemblyName System.Drawing

$src = Join-Path $PSScriptRoot "..\public\assets\avatar.jpg"
$dest = Join-Path $PSScriptRoot "..\public\assets\avatar_cv.jpg"

if (Test-Path $src) {
    $img = [System.Drawing.Image]::FromFile($src)
    $size = 320
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($img, 0, 0, $size, $size)

    $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatDescription -eq 'JPEG' }
    $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]90)

    $bmp.Save($dest, $encoder, $encParams)
    $g.Dispose()
    $bmp.Dispose()
    $img.Dispose()

    $destItem = Get-Item $dest
    Write-Host "Created optimized avatar at $dest with size: $($destItem.Length) bytes"
} else {
    Write-Error "Source avatar not found at $src"
}
