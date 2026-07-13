<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    public function index()
    {
        return Contract::with('supplier')->latest()->paginate(20);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'title' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'value' => 'nullable|numeric|min:0',
            'status' => 'sometimes|in:active,expired,terminated,renewal_pending',
            'sla_terms' => 'nullable|string',
        ]);

        if (!isset($validated['status'])) {
            $validated['status'] = 'active';
        }

        $contract = Contract::create($validated);

        return response()->json($contract->load('supplier'), 201);
    }

    public function show(Contract $contract)
    {
        return $contract->load('supplier');
    }

    public function update(Request $request, Contract $contract)
    {
        $validated = $request->validate([
            'supplier_id' => 'sometimes|exists:suppliers,id',
            'title' => 'sometimes|string|max:255',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'value' => 'nullable|numeric|min:0',
            'status' => 'sometimes|in:active,expired,terminated,renewal_pending',
            'sla_terms' => 'nullable|string',
        ]);

        $contract->update($validated);

        return $contract->load('supplier');
    }

    public function destroy(Contract $contract)
    {
        $contract->delete();
        return response()->noContent();
    }
}
