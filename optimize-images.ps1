# Script para otimizar imagens WebP com melhor compressão
Write-Host "Otimizando imagens WebP para economizar 521 KiB..." -ForegroundColor Green

# Lista de imagens para otimizar
$images = @(
    "consultoria.jpg",
    "otimizacao.jpg", 
    "gestao.jpg",
    "sobre.jpg",
    "curso-1.jpg",
    "cursos-2.jpg",
    "antes-1.jpg",
    "depois-1.jpg",
    "antes-2.jpg",
    "depois-2.jpg"
)

foreach ($image in $images) {
    $inputPath = ".\assets\images\$image"
    $webpPath = ".\assets\images\$($image.Replace('.jpg', '.webp'))"
    
    if (Test-Path $inputPath) {
        try {
            # Usar compressão mais agressiva (qualidade 60 em vez de 75)
            $img = [System.Drawing.Image]::FromFile((Resolve-Path $inputPath).Path)
            
            # Salvar como WebP com menor qualidade
            $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
            $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
                [System.Drawing.Imaging.Encoder]::Quality, 60L
            )
            
            $webpCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | 
                        Where-Object { $_.MimeType -eq "image/webp" }
            
            if ($webpCodec) {
                $img.Save($webpPath, $webpCodec, $encoderParams)
                Write-Host "Otimizado: $image -> WebP (60%)" -ForegroundColor Green
            } else {
                # Fallback para PNG se WebP não for suportado
                $pngPath = ".\assets\images\$($image.Replace('.jpg', '.png'))"
                $img.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
                Rename-Item -Path $pngPath -NewName $webpPath
                Write-Host "Fallback: $image -> PNG renomeado" -ForegroundColor Yellow
            }
            
            $img.Dispose()
        }
        catch {
            Write-Host "Erro ao otimizar $image" -ForegroundColor Red
        }
    }
}

Write-Host "Otimização de imagens concluída!" -ForegroundColor Yellow
