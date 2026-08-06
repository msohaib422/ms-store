$backendProcess = Start-Process -NoNewWindow -PassThru -FilePath "powershell" -ArgumentList "-Command", "cd 'C:\Users\wwwde\Downloads\project-bolt-sb1-k8ygmth2 (2)\project\backend'; npm run dev"
$frontendProcess = Start-Process -NoNewWindow -PassThru -FilePath "powershell" -ArgumentList "-Command", "cd 'C:\Users\wwwde\Downloads\project-bolt-sb1-k8ygmth2 (2)\project\frontend'; npm run dev"

Write-Host "Backend started with PID: $($backendProcess.Id)"
Write-Host "Frontend started with PID: $($frontendProcess.Id)"
Write-Host "Press Ctrl+C to stop both processes"

# Wait for user to press Ctrl+C
$null = Read-Host -Prompt ""

# Stop processes
Stop-Process -Id $backendProcess.Id -Force
Stop-Process -Id $frontendProcess.Id -Force
Write-Host "Processes stopped"
