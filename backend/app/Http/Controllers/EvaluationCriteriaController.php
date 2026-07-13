<?php

namespace App\Http\Controllers;

use App\Models\EvaluationCriteria;
use Illuminate\Http\Request;

class EvaluationCriteriaController extends Controller
{
    public function index()
    {
        return EvaluationCriteria::where('is_active', true)->get();
    }
}
