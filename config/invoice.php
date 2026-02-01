<?php
return [
    'prefix'  => env('INVOICE_PREFIX', 'INV'),
    'padding' => env('INVOICE_PADDING', 6),
    'start_number' => env('INVOICE_START_NUMBER', 1),
    'proforma_start_number' => env('PROFORMA_START_NUMBER', 1),
    'cash_order_start_number' => env('CASH_ORDER_START_NUMBER', 1),
];