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
        $pendingEvaluationsCount = Evaluation::where('status', 'pending')->count();

        // 2. Expiring Contracts (next 60 days)
        $sixtyDaysFromNow = Carbon::now()->addDays(60);
        $expiringContractsCount = Contract::where('status', 'active')
            ->where('end_date', '<=', $sixtyDaysFromNow)
            ->count();

        // 3. Top and Bottom 5 Suppliers
        // We aggregate the average score for each supplier
        $suppliersWithScores = Supplier::withAvg('evaluations as avg_score', 'score')
            ->having('avg_score', '!=', null)
            ->orderBy('avg_score', 'desc')
            ->get();

        $topSuppliers = $suppliersWithScores->take(5)->map(function ($s) {
            return [
                'id' => $s->id,
                'name' => $s->name,
                'category' => $s->category,
                'score' => round($s->avg_score)
            ];
        })->values();

        $bottomSuppliers = $suppliersWithScores->reverse()->take(5)->map(function ($s) {
            return [
                'id' => $s->id,
                'name' => $s->name,
                'category' => $s->category,
                'score' => round($s->avg_score)
            ];
        })->values();

        // 4. 6-Period Trend Chart
        // Group evaluations by period and calculate the average score across all suppliers for that period
        $trendData = Evaluation::select('period', DB::raw('AVG(score) as avg_score'))
            ->groupBy('period')
            ->orderBy('period', 'asc') // Assuming alphabetical ordering works for periods like "2025-Q3"
            ->limit(6)
            ->get()
            ->map(function ($item) {
                return [
                    'period' => $item->period,
                    'score' => round($item->avg_score)
                ];
            });

        return response()->json([
            'pending_evaluations' => $pendingEvaluationsCount,
            'expiring_contracts' => $expiringContractsCount,
            'top_suppliers' => $topSuppliers,
            'bottom_suppliers' => $bottomSuppliers,
            'trend' => $trendData
        ]);
    }
}
