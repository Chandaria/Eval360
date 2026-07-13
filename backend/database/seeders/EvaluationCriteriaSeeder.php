<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EvaluationCriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $criteria = [
            ['name' => 'Delivery Timeliness', 'key' => 'delivery', 'weight' => 0.30],
            ['name' => 'Product Quality', 'key' => 'quality', 'weight' => 0.30],
            ['name' => 'Pricing Competitiveness', 'key' => 'pricing', 'weight' => 0.20],
            ['name' => 'Contract Compliance', 'key' => 'compliance', 'weight' => 0.20],
        ];

        foreach ($criteria as $c) {
            \App\Models\EvaluationCriteria::updateOrCreate(['key' => $c['key']], $c);
        }
    }
}
