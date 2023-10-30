<?php

namespace App\Http\Controllers;

// use App\Http\Requests\StoreCustomerRequest;
// use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Carbon\Carbon;


class CustomerController extends Controller
{
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
        $search = $request->search ?? '';
        $pagination = $request->pagination;
        $page = $request->page;
        $customers = Customer::where(function($query) use ($search)
        {
            $query->where('name', 'like', '%' . $search . '%')
                ->orWhere('nickname', 'like', '%' . $search . '%')
                ->orWhere('code', 'like', '%' . $search . '%');
        }
        )->orderBy('name', 'asc')->paginate($pagination);



        $customers->each(function ($customer) {
            $today = Carbon::now();
            $customer->invoicesCount = $customer->invoices->count();
            $customer->invoiceThisMonth = $customer->invoicesThisMonth->count();
            $customer->total = $customer->invoices->sum('total');
            $customer->overdue = $customer->invoices->where('invoice_due_date', '<', $today->toDateString())->where('paid', false)->sum('total');;
            $customer->due = $customer->invoices->where('paid', false)->sum('total');
        });

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
        $newCustomer = new Customer;

        $newCustomer->name = $request->newClient['name'];
        $newCustomer->code = $request->newClient['code'];
        $newCustomer->vat_code = $request->newClient['vat_code'];
        $newCustomer->nickname = $request->newClient['nickname'];
        $newCustomer->street = $request->newClient['street'];
        $newCustomer->city = $request->newClient['city'];
        $newCustomer->country = $request->newClient['country'];
        $newCustomer->zip = $request->newClient['zip'];
        $newCustomer->notes = $request->newClient['notes'];
        $newCustomer->contact_name = $request->newClient['contact_name'];
        $newCustomer->contact_phone = $request->newClient['contact_phone'];
        $newCustomer->contact_email = $request->newClient['contact_email'];
        $newCustomer->website = $request->newClient['website'];


        $newCustomer->save();
        return response()->json(
            [
                'message' => 'Customer stored successfully',
                'type' => 'success',
                'route' => route('customers-index'),
                'aaa' => $request->newClient,

            ],
            201
        );

    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        $actualCustomer = $customer;
        return Inertia::render('Customers/Customer', [
            'storeRoute' => route('customers-store'),
            'customer' => $actualCustomer,
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        //
    }
}
