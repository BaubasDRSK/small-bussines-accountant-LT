<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $casts = [
        'customer' => 'array',
        'products' => 'array',
    ];


    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

}

