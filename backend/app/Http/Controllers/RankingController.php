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

        // Eager load the exact same relation used by other controllers to guarantee score consistency
        $suppliersQuery = Supplier::with('latestApprovedEvaluation');

        if ($categoryFilter) {
            $suppliersQuery->where('category', $categoryFilter);
        }

        $suppliers = $suppliersQuery->get();

        // Use the shared accessor directly
        $rankedSuppliers = $suppliers->map(function ($supplier) {
            // Append computed values for the frontend
            $supplier->computed_score = $supplier->current_score;
            $supplier->trend_delta = 0; // Removed manual trend recalculation to ensure consistency
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
