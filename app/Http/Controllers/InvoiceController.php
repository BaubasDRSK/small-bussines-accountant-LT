<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\Product;
use DateTime;
use Inertia\Inertia;



class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Invoices', [
            'newlist' => route('invoices-list'),
            'updateInvoiceRoute' => route('invoices-update'),
    ]);
    }

    public function list(Request $request)
    {
        $search = $request->search ?? '';
        $pagination = $request->pagination;
        $sort = $request->sort ?? ['sortDirection' => 'asc', 'sortName' => 'due'];
       if ($sort['sortName'] === 'due') {
            $invoices = Invoice::with('customer')->where(function($query) use ($search)
            {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('invoice_number', 'like', '%' . $search . '%')
                    ->orWhereHas('customer', function ($customerQuery) use ($search) {
                        $customerQuery->where('name', 'like', '%' . $search . '%');
                    });
            })->orderBy('paid', $sort['sortDirection'])
            ->orderBy('invoice_due_date', $sort['sortDirection'])->paginate($pagination);
       } else {
            $invoices = Invoice::with('customer')->where(function($query) use ($search)
            {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('invoice_number', 'like', '%' . $search . '%')
                    ->orWhereHas('customer', function ($customerQuery) use ($search) {
                        $customerQuery->where('name', 'like', '%' . $search . '%');
                    });
            })->orderBy($sort['sortName'], $sort['sortDirection'])->paginate($pagination);
       }




        if ($invoices) {
            foreach ($invoices as $invoice) {
                    $dueDate = new DateTime($invoice->invoice_due_date);
                    $yesterday = new DateTime('yesterday');
                    $interval = $yesterday->diff($dueDate);
                    $due = $interval->invert ? ($interval->days * (-1)) : $interval->days;
                    $due = $invoice->paid ? 1000 : $due;
                    $invoice->due = $due;
            }
        }
        return response()->json(
            [
                'message' => 'Invoices list renewed',
                'type' => 'success',
                'invoices' => $invoices,
            ],
            201
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        $products = Product::all();
        $actualInvoice = $invoice;

        return Inertia::render('Invoices/Invoice', [
            'updateRoute' => route('customers-update', ['customer' => $actualInvoice->id]),
            'invoice' => $actualInvoice,
            'updateInvoiceRoute' => route('invoices-update'),
            'allProducts' => $products,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoice $invoice)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invoice $invoice)
    {
        $invoice = Invoice::find($request->invoice);
        $invoice->paid = $request->paid;
        $invoice->save();
        return response()->json(
            [
                'message' => 'Invoice status updated successfully',
                'type' => 'success',
            ],
            201
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        //
    }
}
