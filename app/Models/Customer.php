<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'code', 'vat_code', 'nickname', 'street', 'city', 'country', 'zip', 'notes', 'contact_name', 'contact_phone', 'contact_email', 'website'];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

     public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function invoicesThisMonth()
    {
        return $this->hasMany(Invoice::class)->whereMonth('invoice_date', now()->month);
    }
}
