<?php

namespace App\Http\Controllers;

// use App\Http\Requests\StoreCustomerRequest;
// use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Repositories\CustomerRepository;


class CustomerController extends Controller
{
     protected $customerRepository;

     public function __construct(CustomerRepository $customerRepository)
     {
         $this->customerRepository = $customerRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        return Inertia::render('Customers', [
                'newlist' => route('customers-list'),
        ]);
    }

    public function list(Request $request)
    {
        $page = $request->page ?? 1;

        $customers = $this->customerRepository->customersList($request);
        return response()->json(
            [
                'message' => 'Customer list renewed',
                'type' => 'success',
                'customers' => $customers,
                'aaa' => $page,
            ],
            201
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('NewCustomer', [
            'storeRoute' => route('customers-store'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->customerRepository->createCustomer($request);

        return response()->json(
            [
                'message' => 'Customer stored successfully',
                'type' => 'success',
                'route' => route('customers-index'),
            ],
            201
        );

    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        return Inertia::render('Customers/Customer', [
            'updateRoute' => route('customers-update', ['customer' => $customer->id]),
            'customer' => $customer,
            'invoices'  => $customer->invoices()->orderBy('invoice_number', 'asc')->get(),
            'expenses' => $customer->expenses()->orderBy('expense_number', 'asc')->get(),
            'updateInvoiceRoute' => route('invoices-update'),
            'upadeteExpenseRoute' => route('expenses-update'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customer $customer)
    {
        $customer -> update($request->updatedFields);

        return response()->json(
            [
                'message' => 'Client data updated',
                'type' => 'success',
            ],
            201
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        //
    }

    public function dashboard()
    {
        $totalCustomers = Customer::all()->count();

        return response()->json(
            [
                'message' => 'Customer list renewed',
                'type' => 'success',
                'totalCustomers' => $totalCustomers,


            ],
            201
        );
    }
}
