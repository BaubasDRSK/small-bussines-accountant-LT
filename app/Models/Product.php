<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Product extends Model
{
    use HasFactory;


    protected $fillable = [
        'name', 
        'description',
        'price' // Even though we generate this in booted(), it needs to be here
    ];

    protected static function booted()
    {
        static::creating(function ($product) {
            $lastProduct = self::where('code', 'LIKE', 'PRO-%')
                                ->orderBy('code', 'desc')
                                ->first();

            if (!$lastProduct) {
                $number = 1;
            } else {
                $number = (int) explode('-', $lastProduct->code)[1] + 1;
            }

            $product->code = 'PRO-' . sprintf('%05d', $number);
        });
    }

    protected function price(): Attribute
    {
        return Attribute::make(
            // // Accessor: Convert cents from DB to Dollars for the UI (e.g., 500 -> 5.00)
            // get: fn (int $value) => $value / 100,

            // Mutator: Convert Dollars from UI to cents for the DB (e.g., 5.00 -> 500)
            set: fn (float $value) => (int) ($value * 100),
        );
    }
}
