<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'Povilas',
            'last_name' => 'Grikis',
            'email' => 'povilas@gmail.com',
            'password' => Hash::make('123'),
        ]);

        $faker = Faker::create('lt_LT');

        foreach (range(1, 12) as $_) {
            DB::table('customers')->insert([
                'code' => $faker->unique()->numberBetween(10000000, 99999999),
                'vat_code' => $faker->unique()->numberBetween(10000000, 99999999),
                'name' => $faker->company(),
                'nickname' => $faker->company(),
                'street' => $faker->streetAddress,
                'city' => $faker->city,
                'country' => $faker->country,
                'zip' => $faker->postcode,
                'notes' => $faker->paragraph,
                'contact_name' => $faker->name,
            ]);
        }

        for ($i=1; $i<10; $i++){
            DB::table('products')->insert([
                'name' => $faker->unique()->word,
                'code' => "PRO-0000".$i,
                'description' => $faker->paragraph,
                'price' => $faker->numberBetween(100, 9999),
            ]);
        }

        foreach (range(1, 25) as $_){
            DB::table('invoices')->insert([
                'invoice_number' => $faker->unique()->numberBetween(1000, 9999),
                'name' => $faker->sentence,
                'customer_id' => $faker->numberBetween(1, 5),

                'total' => $faker->numberBetween(1000, 9999),
            ]);
        }

    }
}
