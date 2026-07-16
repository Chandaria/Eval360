<?php
$c1 = app()->make(\App\Http\Controllers\SupplierController::class);
$c2 = app()->make(\App\Http\Controllers\RankingController::class);

$rankingMap = [];
$page = 1;
do {
    \Illuminate\Pagination\Paginator::currentPageResolver(function () use (&$page) { return $page; });
    $req = \Illuminate\Http\Request::create('/api/rankings', 'GET', ['page' => $page]);
    $res = $c2->index($req)->getData();
    foreach ($res->leaderboard->data as $r) {
        $rankingMap[$r->id] = $r->computed_score ?? 'null';
    }
    $lastPage = $res->leaderboard->last_page ?? 1;
    $page++;
} while ($page <= $lastPage);

$indexMap = [];
$page = 1;
do {
    \Illuminate\Pagination\Paginator::currentPageResolver(function () use (&$page) { return $page; });
    $res = $c1->index();
    foreach ($res->items() as $r) {
        $indexMap[$r->id] = $r->current_score ?? 'null';
    }
    $lastPage = $res->lastPage();
    $page++;
} while ($page <= $lastPage);

$showMap = [];
$supplierIds = \App\Models\Supplier::orderBy('id')->pluck('id');
foreach ($supplierIds as $id) {
    $s = \App\Models\Supplier::find($id);
    $res = $c1->show($s);
    $showMap[$id] = $res->current_score ?? 'null';
}

echo "| Supplier ID | /api/suppliers | /api/suppliers/{id} | /api/rankings |\n";
echo "|-------------|----------------|---------------------|---------------|\n";
foreach ($supplierIds as $id) {
    $i = $indexMap[$id] ?? 'N/A';
    $s = $showMap[$id] ?? 'N/A';
    $r = $rankingMap[$id] ?? 'Excluded (Null Score)';
    
    echo "| $id | $i | $s | $r |\n";
}
