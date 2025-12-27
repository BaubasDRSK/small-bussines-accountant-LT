<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
   use HasFactory;

    protected $fillable = ['expense_number', 'name', 'customer_id', 'customer', 'products', 'total', 'expense_date', 'expense_due_date', 'paid', 'notes'];

    protected $casts = [
        'customer' => 'array',
        'products' => 'array',
    ];


    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
