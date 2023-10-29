<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Product;
use Inertia\Inertia;



class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Products', [
            'newlist' => route('products-list'),
    ]);
    }


    public function list(Request $request)
    {
        $search = $request->search ?? '';
        $pagination = $request->pagination;
        $page = $request->page;
        $products = Product::where(function($query) use ($search)
        {
            $query->where('name', 'like', '%' . $search . '%')
                ->orWhere('price', 'like', '%' . $search . '%');
        }
        )->orderBy('code', 'desc')->paginate($pagination);

        return response()->json(
            [
                'message' => 'Invoices list renewed',
                'type' => 'success',
                'products' => $products,
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
    public function show(Product $product)
    {
        $productas = $product;
        return Inertia::render('Products/Product', [
            'storeRoute' => route('customers-store'),
            'product' => $productas,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
