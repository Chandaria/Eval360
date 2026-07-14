<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Supplier;
use App\Models\Contract;
use App\Models\Evaluation;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $usersByRole = User::select('role', \DB::raw('count(*) as count'))
            ->groupBy('role')
            ->get();

        $evaluationsByStatus = Evaluation::select('status', \DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        return response()->json([
            'total_users' => User::count(),
            'total_suppliers' => Supplier::count(),
            'total_contracts' => Contract::count(),
            'pending_evaluations' => Evaluation::where('status', 'submitted')->count(),
            'users_by_role' => $usersByRole,
            'evaluations_by_status' => $evaluationsByStatus,
        ]);
    }
}
