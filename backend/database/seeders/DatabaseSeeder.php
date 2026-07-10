<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Supplier;
use App\Models\Contract;
use App\Models\Evaluation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Users
        $manager = User::create([
            'name' => 'Manager User',
            'email' => 'manager@eval360.com',
            'password' => Hash::make('password'),
            'role' => 'manager',
        ]);
        
        $officer = User::create([
            'name' => 'Procurement Officer',
            'email' => 'officer@eval360.com',
            'password' => Hash::make('password'),
            'role' => 'officer',
        ]);

        // 2. Create Suppliers
        $suppliersData = [
            ['name' => 'Acme Logistics', 'category' => 'Logistics'],
            ['name' => 'Global Materials Inc.', 'category' => 'Raw Materials'],
            ['name' => 'TechSolutions Pro', 'category' => 'IT Services'],
            ['name' => 'Apex Office Supplies', 'category' => 'Office Supplies'],
            ['name' => 'FastFreight', 'category' => 'Logistics'],
            ['name' => 'Stellar Components', 'category' => 'Raw Materials'],
        ];

        $suppliers = [];
        foreach ($suppliersData as $data) {
            $suppliers[] = Supplier::create([
                'name' => $data['name'],
                'registration_number' => 'REG-' . rand(1000, 9999),
                'category' => $data['category'],
                'status' => 'active',
                'email' => strtolower(str_replace(' ', '', $data['name'])) . '@example.com',
            ]);
        }

        // 3. Create Contracts
        foreach ($suppliers as $supplier) {
            Contract::create([
                'supplier_id' => $supplier->id,
                'start_date' => Carbon::now()->subMonths(6),
                'end_date' => Carbon::now()->addDays(rand(10, 120)), // some expiring soon
                'status' => 'active',
            ]);
        }

        // 4. Create Evaluations for trend (last 6 periods)
        $periods = ['2025-Q3', '2025-Q4', '2026-Q1', '2026-Q2', '2026-Q3', '2026-Q4'];
        
        foreach ($suppliers as $index => $supplier) {
            foreach ($periods as $pIndex => $period) {
                // Generate a score that slightly improves or fluctuates
                $baseScore = 60 + ($index * 5); 
                $score = min(100, max(0, $baseScore + rand(-10, 15) + ($pIndex * 2)));

                Evaluation::create([
                    'supplier_id' => $supplier->id,
                    'evaluator_id' => $manager->id,
                    'score' => $score,
                    'period' => $period,
                    'status' => ($period === '2026-Q4') ? 'pending' : 'approved', // some pending for the dashboard
                ]);
            }
        }
    }
}
