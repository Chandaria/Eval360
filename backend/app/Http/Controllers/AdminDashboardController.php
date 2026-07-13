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
        return response()->json([
            'total_users' => User::count(),
            'total_suppliers' => Supplier::count(),
            'total_contracts' => Contract::count(),
            'pending_evaluations' => Evaluation::where('status', 'submitted')->count(),
        ]);
    }
}
