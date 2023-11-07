<?php

namespace App\Http\Controllers;

use App\Models\Customer;
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
        $customers = Customer::all();
        $actualInvoice = $invoice;

        return Inertia::render('Invoices/Invoice', [
            'updateRoute' => route('customers-update', ['customer' => $actualInvoice->id]),
            'invoice' => $actualInvoice,
            'updateInvoiceRoute' => route('invoices-update'),
            'allProducts' => $products,
            'allCustomers' => $customers,
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
        $fullInvoice =$request->input('fullInvoice');
        dump($fullInvoice['invoice_date']);
        $invoice = Invoice::find($fullInvoice['id']);

        $invoice->id = $fullInvoice['id'];
        $invoice->invoice_number = $fullInvoice['invoice_number'];
        $invoice->name = $fullInvoice['name'];
        $invoice->customer_id = $fullInvoice['customer_id'];
        $invoice->customer = $fullInvoice['customer'];
        $invoice->products = $fullInvoice['products'];
        $invoice->total = $fullInvoice['total'];
        $date = new DateTime($fullInvoice['invoice_date']);
        $invoice->invoice_date = $date->format('Y-m-d');
        $duedate = new DateTime($fullInvoice['invoice_due_date']);
        $invoice->invoice_due_date = $duedate->format('Y-m-d');
        $invoice->paid = $fullInvoice['paid'];
        $invoice->notes = $fullInvoice['notes'];


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
