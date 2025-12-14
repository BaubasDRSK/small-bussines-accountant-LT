<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $fillable = [
        'name',
        'code',
        'vat_code', // <--- Make sure the mapped keys are here
        'street',
        'city',
        'country',
        'phone',
        'email',
        'web',
        'bank_name', // <--- Mapped key
        'bank_account', // <--- Mapped key
    ];
}
