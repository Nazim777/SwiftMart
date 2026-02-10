$files = Get-ChildItem -Path "src" -Recurse -Include "*.ts","*.tsx"

foreach ($file in $files) {
    (Get-Content -LiteralPath $file.FullName) | ForEach-Object {
        $_ -replace 'import Pagination from "@/components/ui/Pagination"', 'import { Pagination } from "@/components/ui/Pagination"'
    } | Set-Content -LiteralPath $file.FullName
}
