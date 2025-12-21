<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('products')->insert([
            [
                'code' => 'PRO-00001',
                'name' => 'Spausdinimas',
                'description' => 'Spausdinimo paslaugos',
                'price' => 1000,
            ],
            [
                'code' => 'PRO-00002',
                'name' => 'Reklamos gamyba',
                'description' => 'Reklamos gamyba',
                'price' => 3500,
            ],
            [
                'code' => 'PRO-00003',
                'name' => 'Siuvinėjimas',
                'description' => 'Su siuvinėjimu susije reikalai',
                'price' => 1500,
            ],
            [
                'code' => 'PRO-00004',
                'name' => 'CNC frezavimas',
                'description' => 'CNC reikalai',
                'price' => 2000,
            ],
            [
                'code' => 'PRO-00005',
                'name' => 'Perpardavimas',
                'description' => 'Perpardavimas kitu gaminiu',
                'price' => 1000,
            ],
            [
                'code' => 'PRO-00006',
                'name' => 'Pristatymas',
                'description' => 'Pristatymas',
                'price' => 500,
            ],
            [
                'code' => 'PRO-00007',
                'name' => 'Maketavimas',
                'description' => 'Maketavimas',
                'price' => 600,
            ],
        ]);
    }
}
