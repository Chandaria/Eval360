<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class RankingController extends Controller
{
    /**
     * Get the rankings leaderboard and category champions.
     */
    public function index(Request $request)
    {
        $periodFilter = $request->input('period');
        $categoryFilter = $request->input('category');

        // Eager load all approved evaluations, ordered by period descending to prevent N+1 queries.
        $suppliersQuery = Supplier::with(['evaluations' => function ($query) use ($periodFilter) {
            $query->where('status', 'approved')->orderBy('period', 'desc');
            if ($periodFilter) {
                // If a period is provided, only consider evaluations up to that period
                $query->where('period', '<=', $periodFilter);
            }
        }]);

        if ($categoryFilter) {
            $suppliersQuery->where('category', $categoryFilter);
        }

        $suppliers = $suppliersQuery->get();

        // Compute scores and trend deltas in memory to allow complex sorting
        $rankedSuppliers = $suppliers->map(function ($supplier) {
            $evaluations = $supplier->evaluations;
            $currentScore = null;
            $trendDelta = 0;

            if ($evaluations->isNotEmpty()) {
                // Latest approved evaluation
                $latestEval = $evaluations->first();
                $currentScore = round($latestEval->total_score);

                // Second-to-last approved evaluation (if it exists)
                if ($evaluations->count() > 1) {
                    $previousEval = $evaluations->skip(1)->first();
                    $previousScore = round($previousEval->total_score);
                    $trendDelta = $currentScore - $previousScore;
                }
            }

            // Append computed values for the frontend
            $supplier->computed_score = $currentScore;
            $supplier->trend_delta = $trendDelta;
            
            // Remove full evaluations payload to keep response lightweight
            $supplier->unsetRelation('evaluations');

            return $supplier;
        });

        // Filter out suppliers with no approved evaluations
        $rankedSuppliers = $rankedSuppliers->filter(function ($supplier) {
            return !is_null($supplier->computed_score);
        });

        // Sort: primary by score DESC, secondary by created_at ASC
        $rankedSuppliers = $rankedSuppliers->sort(function ($a, $b) {
            if ($a->computed_score === $b->computed_score) {
                return $a->created_at <=> $b->created_at; // Tie-breaker
            }
            return $b->computed_score <=> $a->computed_score;
        })->values();

        // 1. Determine Category Champions
        $champions = collect();
        if (!$categoryFilter) {
            $groupedByCategory = $rankedSuppliers->groupBy('category');
            foreach ($groupedByCategory as $category => $group) {
                // Group is already sorted by score DESC, so the first is the champion
                $champions->push($group->first());
            }
        }

        // 2. Paginate the Leaderboard manually
        $page = $request->input('page', 1);
        $perPage = 20;
        
        // Ensure $rankedSuppliers is an array for array_slice
        $items = $rankedSuppliers->all();
        $total = count($items);
        $pagedItems = array_slice($items, ($page - 1) * $perPage, $perPage);

        $paginator = new LengthAwarePaginator(
            $pagedItems,
            $total,
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return response()->json([
            'champions' => $champions->sortByDesc('computed_score')->values(),
            'leaderboard' => $paginator,
        ]);
    }
}
