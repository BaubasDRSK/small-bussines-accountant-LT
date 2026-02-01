<?php

namespace App\Services;

use App\Models\InvoiceSequence;
use Illuminate\Support\Facades\DB;

class InvoiceNumberGenerator
{
    public static function next(string $key = 'default'): string
    {
        return DB::transaction(function () use ($key) {

            if ($key === 'default') {
                $sequence = InvoiceSequence::lockForUpdate()
                ->firstOrCreate(
                    ['key' => $key],
                    ['last_number' => config('invoice.start_number') - 1]
                ); 
            }

             if ($key === 'proforma') {
                $sequence = InvoiceSequence::lockForUpdate()
                ->firstOrCreate(
                    ['key' => $key],
                    ['last_number' => config('invoice.proforma_start_number') - 1]
                ); 
            }

            

            // Increment number
            $nextNumber = $sequence->last_number + 1;

            // Save back to database
            $sequence->update([
                'last_number' => $nextNumber,
            ]);

            // Read config values
            $prefix  = config('invoice.prefix');

            if ($key === 'proforma') {
                $prefix = 'IŠANKSTINĖ '.$prefix;
            }
            $padding = config('invoice.padding');

            // Format invoice number
            return sprintf(
                '%s-%s',
                $prefix,
                str_pad($nextNumber, $padding, '0', STR_PAD_LEFT)
            );
        });
    }
}
