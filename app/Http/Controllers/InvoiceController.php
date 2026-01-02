<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\Company;
use DateTime;
use Illuminate\Support\Facades\DB;
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
        $pagination = (int)$request->pagination;
        $sort = $request->sort ?? ['sortDirection' => 'asc', 'sortName' => 'due'];
       if ($sort['sortName'] === 'due') {
            $invoices = Invoice::with('customer')->where(function($query) use ($search)
            {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('invoice_number', 'like', '%' . $search . '%')
                    ->orWhereHas('customer', function ($customerQuery) use ($search) {
                        $customerQuery->where('name', 'like', '%' . $search . '%')
                        ->orWhere('nickname', 'like', '%' . $search . '%');;
                    });
            })->orderBy('paid', $sort['sortDirection'])
            ->orderBy('invoice_due_date', $sort['sortDirection'])->paginate($pagination);
       } else {
            $invoices = Invoice::with('customer')->where(function($query) use ($search)
            {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('invoice_number', 'like', '%' . $search . '%')
                    ->orWhereHas('customer', function ($customerQuery) use ($search) {
                        $customerQuery->where('name', 'like', '%' . $search . '%')
                        ->orWhere('nickname', 'like', '%' . $search . '%');
                    });
            })->orderBy($sort['sortName'], $sort['sortDirection'])->paginate($pagination);
       }




        if ($invoices) {
            foreach ($invoices as $invoice) {
                    $dueDate = new DateTime($invoice->invoice_due_date);
                    $yesterday = now();
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
    public function create(Int $id)
    {
        if ($id === 0) {
            $customer = [];
        }else{
            $dbcustomer = Customer::find($id);
            $customer = [
                $dbcustomer->id,
                $dbcustomer->name,
                $dbcustomer->code,
                $dbcustomer->vat_code,
                $dbcustomer->street,
                $dbcustomer->city,
                $dbcustomer->country,
                $dbcustomer->zip,
            ];
        };



        $products = Product::all();
        $customers = Customer::all();
        $actualInvoice = [
            'invoice_number' => 0,
            'customer' => $customer,
    ];

        return Inertia::render('Invoices/Invoice', [
            'storeRoute' => route('invoices-store'),
            'invoice' => $actualInvoice,
            'updateInvoiceRoute' => route('invoices-update'),
            'allProducts' => $products,
            'allCustomers' => $customers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $lastInvoice = Invoice::select('invoice_number')
        ->orderBy('invoice_number', 'desc')
        ->first();

        if ($lastInvoice) {
            $lastInvoiceNumber = $lastInvoice->invoice_number;
            $lastInvoiceNumber = str_replace('PSF-', '', $lastInvoiceNumber);
            $lastInvoiceNumber = (int)$lastInvoiceNumber;
        } else {
            // If there are no previous invoices, start from a specific number, e.g., 0.
            $lastInvoiceNumber = 0;
        }
        $nextInvoiceNumber = 'PSF-' . str_pad($lastInvoiceNumber + 1, 4, '0', STR_PAD_LEFT);

        $fullInvoice =$request->input('fullInvoice');
        $invoice = new Invoice();

        $invoice->invoice_number = $nextInvoiceNumber;
        $invoice->name = $fullInvoice['name'];
        $invoice->customer_id = $fullInvoice['customer'][0];
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
                'message' => 'Invoice '. $nextInvoiceNumber.' was stored.',
                'type' => 'success',
                'invoice' => $invoice->id,
            ],
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        $products = Product::all();
        $customers = Customer::all();
        $actualInvoice = $invoice;
        $company = Company::where('company_id', '1')->first();

        return Inertia::render('Invoices/Invoice', [
            'updateRoute' => route('customers-update', ['customer' => $actualInvoice->id]),
            'invoice' => $actualInvoice,
            'updateInvoiceRoute' => route('invoices-update'),
            'allProducts' => $products,
            'allCustomers' => $customers,
            'company' => $company,

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

    public function dashboard()
    {
        $totalSum = Invoice::all()->sum('total');
        $totalSumOverdue = DB::table('invoices')
        ->where('invoice_due_date', '<', now()->subDay()) // Due date is less than yesterday
        ->where('paid', false) // Unpaid invoices
        ->sum('total');

        $totalSumThisMonth = DB::table('invoices')
        ->whereBetween('invoice_date', [now()->startOfMonth(), now()->endOfMonth()])
        ->sum('total');

        $totalInvoicesThisMonth = DB::table('invoices')
        ->whereBetween('invoice_date', [now()->startOfMonth(), now()->endOfMonth()])
        ->count();

        $totalDueThisMonth = DB::table('invoices')
        ->whereBetween('invoice_due_date', [now()->startOfMonth(), now()->endOfMonth()])
        ->where('paid', false)
        ->sum('total');

        return response()->json(
            [
                'message' => 'Customer list renewed',
                'type' => 'success',
                'totalSales' => $totalSum,
                'totalOverdue' => $totalSumOverdue,
                'totalSumThisMonth' => $totalSumThisMonth,
                'totalInvoicesThisMonth' => $totalInvoicesThisMonth,
                'totalDueThisMonth' => $totalDueThisMonth

            ],
            201
        );
    }
}

