<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'role', 'created_at')->orderBy('created_at', 'asc')->get();
        return response()->json($users);
    }

    public function update(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return response()->json(['message' => 'Cannot change your own role.'], 422);
        }

        $validated = $request->validate([
            'role' => ['required', Rule::in(['admin', 'procurement_manager', 'procurement_officer'])],
        ]);

        $user->role = $validated['role'];
        $user->save();

        return response()->json($user);
    }
}
