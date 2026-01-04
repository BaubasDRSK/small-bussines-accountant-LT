<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceSequence extends Model
{   
    protected $fillable = [
        'key',
        'last_number',
    ];

    use HasFactory;
}
