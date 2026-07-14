<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use App\Models\Supplier;
use App\Models\Contract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ManagerDashboardController extends Controller
{
    public function index()
    {
        // 1. Evaluations awaiting approval
        $pendingEvaluationsCount = Evaluation::where('status', 'submitted')->count();

        // 2. Expiring Contracts (next 60 days)
        $sixtyDaysFromNow = Carbon::now()->addDays(60);
        $expiringContractsCount = Contract::where('status', 'active')
            ->where('end_date', '<=', $sixtyDaysFromNow)
            ->count();

        // 3. Top and Bottom 5 Suppliers
        // Use the current_score accessor (latest approved evaluation)
        $suppliers = Supplier::with(['latestApprovedEvaluation'])->get();
        
        $suppliersWithScores = $suppliers->map(function($supplier) {
            return [
                'id' => $supplier->id,
                'name' => $supplier->name,
                'category' => $supplier->category,
                'score' => $supplier->current_score
            ];
        });

        // Sort descending for top, putting nulls at the end
        $topSuppliers = $suppliersWithScores->sortByDesc(function ($s) {
            return $s['score'] ?? -1;
        })->take(5)->values();

        // Sort ascending for bottom, filtering out nulls so N/A doesn't look like "worst"
        $scoredSuppliers = $suppliersWithScores->filter(function ($s) {
            return $s['score'] !== null;
        });
        
        $bottomSuppliers = $scoredSuppliers->isEmpty() 
            ? $suppliersWithScores->take(5)->values() 
            : $scoredSuppliers->sortBy('score')->take(5)->values();

        // 4. 6-Period Trend Chart
        // Group evaluations by period and calculate the average score across all suppliers for that period
        $allEvaluations = Evaluation::approved()->get();
        $trendData = $allEvaluations->groupBy('period')->map(function($evals, $period) {
            $totalScore = 0;
            $count = 0;
            foreach($evals as $evaluation) {
                $totalScore += $evaluation->total_score;
                $count++;
            }
            return [
                'period' => $period,
                'score' => $count > 0 ? round($totalScore / $count) : null
            ];
        })->sortBy('period')->take(6)->values();

        // 5. Category Averages
        $categoryAverages = $suppliersWithScores->filter(function($s) {
            return $s['score'] !== null;
        })->groupBy('category')->map(function($suppliers, $category) {
            return [
                'category' => $category,
                'average_score' => round($suppliers->avg('score'), 1)
            ];
        })->values();

        return response()->json([
            'total_suppliers' => Supplier::count(),
            'pending_evaluations' => $pendingEvaluationsCount,
            'expiring_contracts' => $expiringContractsCount,
            'top_suppliers' => $topSuppliers,
            'bottom_suppliers' => $bottomSuppliers,
            'trend' => $trendData,
            'category_averages' => $categoryAverages
        ]);
    }

    public function pending()
    {
        $pending = Evaluation::where('status', 'submitted')->with(['supplier', 'evaluator'])->latest()->get();
        return response()->json($pending);
    }
}
