<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;
use DateTime;
use App\Models\Customer;
use App\Models\Product;

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

        foreach (range(1, 25) as $_) {
            DB::table('customers')->insert([
                'code' => $faker->unique()->numberBetween(10000000, 99999999),
                'vat_code' => "LT".$faker->unique()->numberBetween(10000000, 99999999),
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
                'description' => $faker->sentence(),
                'price' => $faker->numberBetween(100, 9999),
            ]);
        }

        function fakedateDue(){
            $faker = Faker::create('lt_LT');
            $currentDate = new DateTime();
            $startOfRange = clone $currentDate;
            $startOfRange->modify('-1 week');
            $endOfRange = clone $currentDate;
            $endOfRange->modify('+2 weeks');

            $randomDate = $faker->dateTimeBetween($startOfRange, $endOfRange);

            return $randomDate->format('Y-m-d');
        }

        function fakedate(){
            $faker = Faker::create('lt_LT');
            $currentDate = new DateTime();
            $startOfRange = clone $currentDate;
            $startOfRange->modify('-2 weeks');
            $endOfRange = clone $currentDate;

            $randomDate = $faker->dateTimeBetween($startOfRange, $endOfRange);

            return $randomDate->format('Y-m-d');
        }



        foreach (range(15, 105) as $_){

            $customerID = rand(1,25);
            $customer = Customer::find($customerID);
            $customerData = json_encode([$customer->id, $customer->name, $customer->code, $customer->vat_code, $customer->street, $customer->city, $customer->country, $customer->zip]);

            $total = 0;
            $products = [];
            $productsCount = rand(1,5);

            for ($i=1; $i<=$productsCount; $i++) {
            $productID = rand(1,9);
            $product = Product::find($productID);
            $quantity = rand(1,5);
            $lineTotal = $quantity * $product->price;
            $recordID = $i;
            $productData = [$recordID, $product->id, $product->code, $product->name, $product->description, $product->price, $quantity, $lineTotal];
            $products[] = $productData;
            $total = $total + $product->price;
            };

            $products = json_encode($products);

            DB::table('invoices')->insert([
                'invoice_number' => "PSF-".$faker->unique()->numberBetween(1000, 9999),
                'name' => $faker->sentence,
                'customer_id' => $customerID,
                'customer' => $customerData,
                'products' => $products,
                'invoice_date' => fakedate(),
                'invoice_due_date' => fakedateDue(),
                'total' => $total,
                'paid' => (bool) mt_rand(0, 1),
                'notes' => $faker->paragraph,
            ]);
        }

    }
}
