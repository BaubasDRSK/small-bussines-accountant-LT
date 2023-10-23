<?php

namespace App\Http\Controllers;

// use App\Http\Requests\StoreCustomerRequest;
// use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use Inertia\Inertia;
use Illuminate\Http\Request;


class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = Customer::paginate(4);

        return Inertia::render('Customers', [
            'customers' => $customers,
            'newlist' => route('customers-listf'),
        ]);
    }

    public function list(Request $request)
    {
        $search = $request->search ?? '';
        $pagination = $request->pagination;
        $customers = Customer::where('name','like', '%'.$search.'%')->paginate($pagination);
        return response()->json(
            [
                'message' => 'Customer list renewed',
                'type' => 'success',
                'customers' => $customers,
                'aaa' => $search,

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
    public function show(Customer $customer)
    {
        //
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
