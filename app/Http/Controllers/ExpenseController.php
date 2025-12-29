<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use App\Models\Customer;
use Illuminate\Http\Request;
use App\Models\Product;
use DateTime;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
            return Inertia::render('Expenses', [
                'newlist' => route('expenses-list'),
                'updateExpenseRoute' => route('expenses-update'),
        ]);
    }

    public function list(Request $request)
    {
        $search = $request->search ?? '';
        $pagination = (int)$request->pagination;
        $sort = $request->sort ?? ['sortDirection' => 'asc', 'sortName' => 'due'];
       if ($sort['sortName'] === 'due') {
            $expenses = Expense::with('customer')->where(function($query) use ($search)
            {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('expense_number', 'like', '%' . $search . '%')
                    ->orWhereHas('customer', function ($customerQuery) use ($search) {
                        $customerQuery->where('name', 'like', '%' . $search . '%')
                        ->orWhere('nickname', 'like', '%' . $search . '%');;
                    });
            })->orderBy('paid', $sort['sortDirection'])
            ->orderBy('expense_due_date', $sort['sortDirection'])->paginate($pagination);
       } else {
            $expenses = Expense::with('customer')->where(function($query) use ($search)
            {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('expense_number', 'like', '%' . $search . '%')
                    ->orWhereHas('customer', function ($customerQuery) use ($search) {
                        $customerQuery->where('name', 'like', '%' . $search . '%')
                        ->orWhere('nickname', 'like', '%' . $search . '%');
                    });
            })->orderBy($sort['sortName'], $sort['sortDirection'])->paginate($pagination);
       }


        if ($expenses) {
            foreach ($expenses as $expense) {
                    $dueDate = new DateTime($expense->expense_due_date);
                    $yesterday = now();
                    $interval = $yesterday->diff($dueDate);
                    $due = $interval->invert ? ($interval->days * (-1)) : $interval->days;
                    $due = $expense->paid ? 1000 : $due;
                    $expense->due = $due;
            }
        }

        return response()->json(
            [
                'message' => 'expenses list renewed',
                'type' => 'success',
                'expenses' => $expenses,
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
        $actualExpense = [
            'expense_number' => '',
            'customer' => $customer,
    ];

        return Inertia::render('Expenses/Expense', [
            'storeRoute' => route('expenses-store'),
            'expense' => $actualExpense,
            'updateExpenseRoute' => route('expenses-update'),
            'allProducts' => $products,
            'allCustomers' => $customers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
        $fullExpense =json_decode($request->input('fullExpense'), true);
        $expense = new Expense();

        $expense->expense_number = $fullExpense['expense_number'];
        $expense->name = $fullExpense['name'];
        $expense->customer_id = $fullExpense['customer'][0];
        $expense->customer = $fullExpense['customer'];
        $expense->products = $fullExpense['products'];
        $expense->total = $fullExpense['total'];
        $date = new DateTime($fullExpense['expense_date']);
        $expense->expense_date = $date->format('Y-m-d');
        $duedate = new DateTime($fullExpense['expense_due_date']);
        $expense->expense_due_date = $duedate->format('Y-m-d');
        $expense->paid = $fullExpense['paid'];
        $expense->notes = $fullExpense['notes'];

         if ($request->hasFile('file')) {
            $path = $request->file('file')->store('expenses', 'private');
            $expense->attachment_path = $path;
        } else {
            $expense->attachment_path = null;
        }

        $expense->save();

        return response()->json(
            [
                'message' => 'expense '. $expense->expense_number.' was stored.',
                'type' => 'success',
                'expense' => $expense->id,
            ],
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Expense $expense)
    {
        $products = Product::all();
        $customers = Customer::all();
        $actualExpense = $expense;
        $company = Customer::where('id', $expense->customer_id)->first();

        return Inertia::render('Expenses/Expense', [
            'updateRoute' => route('customers-update', ['customer' => $actualExpense->id]),
            'expense' => $actualExpense,
            'updateExpenseRoute' => route('expenses-update'),
            'allProducts' => $products,
            'allCustomers' => $customers,
            'company' => $company,
            'downloadAttachmentRoute' => route('expenses-download', ['expense' => $actualExpense->id]),

        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Expense $expense)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Expense $expense)
    {
        $fullExpense =json_decode($request->input('fullExpense'), true);

        $expense = Expense::find($fullExpense['id']);
        $expense->id = $fullExpense['id'];
        $expense->expense_number = $fullExpense['expense_number'];
        $expense->name = $fullExpense['name'];
        $expense->customer_id = $fullExpense['customer_id'];
        $expense->customer = $fullExpense['customer'];
        $expense->products = $fullExpense['products'];
        $expense->total = $fullExpense['total'];
        $date = new DateTime($fullExpense['expense_date']);
        $expense->expense_date = $date->format('Y-m-d');
        $duedate = new DateTime($fullExpense['expense_due_date']);
        $expense->expense_due_date = $duedate->format('Y-m-d');
        $expense->paid = $fullExpense['paid'];
        $expense->notes = $fullExpense['notes'];

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('expenses', 'private');
            $expense->attachment_path = $path;
        } else {
            $expense->attachment_path = null;
        }


        $expense->save();
        return response()->json(
            [
                'message' => 'expense status updated successfully',
                'type' => 'success',
            ],
            201
        );
    }

    public function downloadAttachment(Expense $expense)
{
        // 1. Verify the file path exists in the database
        if (!$expense->attachment_path) {
            return back()->with('error', 'No attachment found for this expense.');
        }

        // 2. Check if the file actually exists in the private storage/app folder
        if (!Storage::disk('private')->exists($expense->attachment_path)) {
            abort(404, 'The physical file was not found on the server.');
        }

        // 3. Return the download response
        // The second parameter is the filename the user will see (optional)
        return Storage::disk('private')->download(
            $expense->attachment_path, 
            'Receipt-' . $expense->expense_number . '.' . pathinfo($expense->attachment_path, PATHINFO_EXTENSION)
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        //
    }
}
