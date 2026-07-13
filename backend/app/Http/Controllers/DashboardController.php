<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Supplier;
use App\Models\Contract;

class DashboardController extends Controller
{
    public function index()
    {
        $totalSuppliers = Supplier::count();
        $activeContracts = Contract::where('status', 'active')->count();
        
        $suppliers = Supplier::with(['latestApprovedEvaluation'])->get();
        
        $totalScore = 0;
        $count = 0;
        foreach($suppliers as $supplier) {
            if ($supplier->current_score !== null) {
                $totalScore += $supplier->current_score;
                $count++;
            }
        }
        
        $averageScore = $count > 0 ? round($totalScore / $count) : null;

        return response()->json([
            'total_suppliers' => $totalSuppliers,
            'active_contracts' => $activeContracts,
            'average_score' => $averageScore,
        ]);
    }
}
