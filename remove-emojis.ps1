# Remove emojis from all markdown documentation files
$files = @(
    "COMPLETE_SETUP_SUMMARY.md",
    "IMPLEMENTATION_PLAN.md",
    "IMPLEMENTATION_SUMMARY.md",
    "SUPABASE_QUICK_START.md",
    "SUPABASE_SETUP_GUIDE.md",
    "SUPABASE_CHECKLIST.md",
    "ADVANCED_PROFILE_FEATURES.md",
    "ROADMAP.md",
    "PROJECT_OVERVIEW.md"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing $file..."
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Remove emojis (Unicode characters outside ASCII range)
        $content = $content -replace '[\u{1F300}-\u{1F9FF}]', ''
        $content = $content -replace '[\u{2600}-\u{26FF}]', ''
        $content = $content -replace '[\u{2700}-\u{27BF}]', ''
        
        # Save back
        $content | Set-Content $file -Encoding UTF8 -NoNewline
        Write-Host "Completed $file"
    }
}

Write-Host "All files processed!"
