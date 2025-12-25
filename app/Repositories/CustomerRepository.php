<?php

namespace App\Repositories;

use App\Models\Customer;
use Request;
use Carbon\Carbon;
class CustomerRepository
{
  
    public function listCustomers()
    {
        return Customer::all();
    }
   
    public function customersList($request)
    {
        $search = $request->search ?? '';
        $pagination = (int) $request->pagination; 
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

        return $customers;
    }

    public function createCustomer($request)
    {
        $newCustomer = new Customer();
        $newCustomer -> fill($request->newClient);
        $newCustomer->save();

        return $newCustomer;
    }
}