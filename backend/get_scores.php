<?php
$s = \App\Models\Supplier::first();
if (!$s) { echo "No suppliers\n"; exit; }
$id = $s->id;
echo "Supplier ID: $id\n";
$c1 = app()->make(\App\Http\Controllers\SupplierController::class);
$res1 = $c1->index()->items()[0];
echo "Index current_score: " . $res1->current_score . "\n";
$res2 = $c1->show(\App\Models\Supplier::find($id));
echo "Show current_score: " . $res2->current_score . "\n";
$req = \Illuminate\Http\Request::create('/api/rankings', 'GET');
$c2 = app()->make(\App\Http\Controllers\RankingController::class);
$res3 = $c2->index($req)->getData();
$champ = $res3->champions[0] ?? null;
echo "Ranking computed_score: " . ($champ ? $champ->computed_score : "N/A") . "\n";
