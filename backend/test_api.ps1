$token = (php artisan tinker --execute="echo \App\Models\User::first()->createToken('test')->plainTextToken;").Trim()

$headers = @{ "Authorization" = "Bearer $token"; "Accept" = "application/json" }

$suppliers = Invoke-RestMethod -Uri "http://localhost:8000/api/suppliers" -Headers $headers
$rankings = Invoke-RestMethod -Uri "http://localhost:8000/api/rankings" -Headers $headers

foreach ($id in 1..3) {
    $s_show = Invoke-RestMethod -Uri "http://localhost:8000/api/suppliers/$id" -Headers $headers
    $s_index = ($suppliers.data | Where-Object { $_.id -eq $id }).current_score
    $s_rank = ($rankings.leaderboard.data | Where-Object { $_.id -eq $id }).computed_score
    Write-Output "Supplier $id -> Index: $s_index, Show: $($s_show.current_score), Ranking: $s_rank"
}
