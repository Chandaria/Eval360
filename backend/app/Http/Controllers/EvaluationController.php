<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Models\Evaluation;
use App\Models\EvaluationScore;
use App\Models\EvaluationCriteria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EvaluationController extends Controller
{
    public function indexAll(Request $request)
    {
        $query = Evaluation::with(['supplier', 'evaluator', 'approver']);

        if ($request->has('status') && in_array($request->status, ['submitted', 'approved'])) {
            $query->where('status', $request->status);
        }

        if ($request->has('supplier_id') && $request->supplier_id) {
            $query->where('supplier_id', $request->supplier_id);
        }

        $query->orderBy('period', 'desc');

        if ($request->has('limit')) {
            return response()->json($query->take($request->limit)->get());
        }

        return $query->paginate(20);
    }

    public function index(Supplier $supplier)
    {
        return $supplier->evaluations()->with('evaluation_scores.criteria')->orderBy('period', 'desc')->paginate(20);
    }

    public function show(Evaluation $evaluation)
    {
        $evaluation->load(['supplier', 'evaluator', 'approver', 'evaluation_scores.criteria']);
        return response()->json($evaluation);
    }

    public function store(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'period' => 'required|string',
            'comments' => 'nullable|string',
            'scores' => 'required|array',
            'scores.*.criteria_id' => 'required|exists:evaluation_criteria,id',
            'scores.*.raw_score' => 'required|numeric|min:0|max:100',
        ]);

        $evaluation = DB::transaction(function () use ($validated, $supplier) {
            $totalScore = 0;
            $scoresData = [];

            foreach ($validated['scores'] as $scoreInput) {
                $criteria = EvaluationCriteria::find($scoreInput['criteria_id']);
                $weightedScore = $scoreInput['raw_score'] * $criteria->weight;
                $totalScore += $weightedScore;

                $scoresData[] = new EvaluationScore([
                    'criteria_id' => $criteria->id,
                    'raw_score' => $scoreInput['raw_score'],
                    'weight_used' => $criteria->weight,
                    'weighted_score' => $weightedScore,
                ]);
            }

            $evaluation = $supplier->evaluations()->create([
                'evaluator_id' => Auth::id(),
                'total_score' => $totalScore,
                'period' => $validated['period'],
                'comments' => $validated['comments'] ?? null,
                'status' => 'submitted',
            ]);

            $evaluation->evaluation_scores()->saveMany($scoresData);

            return $evaluation->load('evaluation_scores.criteria');
        });

        return response()->json($evaluation, 201);
    }

    public function approve(Evaluation $evaluation)
    {
        if ($evaluation->status !== 'submitted') {
            return response()->json(['message' => 'Evaluation cannot be approved because it is not in submitted status.'], 422);
        }

        $evaluation->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
            'approved_at' => now(),
        ]);

        return response()->json($evaluation);
    }
}
