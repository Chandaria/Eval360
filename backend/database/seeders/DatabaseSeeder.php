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
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@eval360.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);
        
        $manager = User::create([
            'name' => 'Manager User',
            'email' => 'manager@eval360.test',
            'password' => Hash::make('password'),
            'role' => 'procurement_manager',
        ]);
        
        $officer = User::create([
            'name' => 'Procurement Officer',
            'email' => 'officer@eval360.test',
            'password' => Hash::make('password'),
            'role' => 'procurement_officer',
        ]);

        $this->call([
            EvaluationCriteriaSeeder::class,
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
                'title' => 'Master Services Agreement - ' . date('Y'),
                'start_date' => Carbon::now()->subMonths(6),
                'end_date' => Carbon::now()->addDays(rand(10, 120)),
                'value' => rand(50000, 500000),
                'status' => 'active',
                'sla_terms' => 'Standard 99.9% uptime. Quarterly performance reviews.',
            ]);
        }

        // 4. Create Evaluations for trend (last 6 periods)
        $periods = ['2025-Q3', '2025-Q4', '2026-Q1', '2026-Q2', '2026-Q3', '2026-Q4'];
        $allCriteria = \App\Models\EvaluationCriteria::all();
        
        foreach ($suppliers as $index => $supplier) {
            foreach ($periods as $pIndex => $period) {
                // Generate a base performance
                $baseScore = 60 + ($index * 5); 
                
                $totalScore = 0;
                $scoresData = [];

                foreach ($allCriteria as $criteria) {
                    $rawScore = min(100, max(0, $baseScore + rand(-10, 15) + ($pIndex * 2)));
                    $weightedScore = $rawScore * $criteria->weight;
                    $totalScore += $weightedScore;

                    $scoresData[] = new \App\Models\EvaluationScore([
                        'criteria_id' => $criteria->id,
                        'raw_score' => $rawScore,
                        'weight_used' => $criteria->weight,
                        'weighted_score' => $weightedScore,
                    ]);
                }

                $status = ($period === '2026-Q4') ? 'submitted' : 'approved';
                $evaluation = Evaluation::create([
                    'supplier_id' => $supplier->id,
                    'evaluator_id' => $officer->id, // Let's make officer the evaluator, manager the approver
                    'total_score' => $totalScore,
                    'period' => $period,
                    'status' => $status,
                    'approved_by' => $status === 'approved' ? $manager->id : null,
                    'approved_at' => $status === 'approved' ? Carbon::now()->subDays(rand(1, 30)) : null,
                ]);

                $evaluation->evaluation_scores()->saveMany($scoresData);
            }
        }
    }
}
