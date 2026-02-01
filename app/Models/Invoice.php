<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = ['invoice_number', 'name', 'customer_id', 'customer', 'products', 'total', 'invoice_date', 'invoice_due_date', 'paid', 'notes', 'cash_order'];

    protected $casts = [
        'customer' => 'array',
        'products' => 'array',
        'registered' => 'boolean',
        'cash_order' => 'array',
        'editable' => 'boolean',
    ];


    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

}

