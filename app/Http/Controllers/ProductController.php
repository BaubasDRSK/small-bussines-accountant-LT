<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    // ... (index and list methods remain the same) ...

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Products', [
            'newlist' => route('products-list'),
            'addNewItem' => route('products-create'),
            'deleteItem' => url ('products/delete'),
            'editItem' => url ('products/edit'),
        ]);
    }

    public function list(Request $request)
    {
        $search = $request->search ?? '';
        $pagination = (int)($request->pagination > 0 ? $request->pagination : 15);
        
        $products = Product::where(function($query) use ($search)
        {
            $query->where('name', 'like', '%' . $search . '%')
                ->orWhere('code', 'like', '%' . $search . '%')
                ->orWhere('description', 'like', '%' . $search . '%');
        }
        )->orderBy('code', 'desc')->paginate($pagination);

        return response()->json(
            [
                'message' => 'Products list renewed',
                'type' => 'success',
                'products' => $products,
            ],
            200 // Use 200 OK for a successful data retrieval
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Products/ProductForm', [
            'product' => null, // Pass null to indicate creation mode
            'storeRoute' => route('products-store'),
            'title' => 'Create New Product',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0'], 
        ]);

        Product::create($validated);

        return redirect()->route('products-index')->with([
            'message' => 'Product created successfully!',
            'type' => 'success',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return Inertia::render('Products/Product', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        return Inertia::render('Products/ProductForm', [
            'product' => $product, // Pass the existing product data
            'updateRoute' => route('products-update', $product),
            'title' => 'Edit Product: ' . $product->name,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            // Rule::unique ignores the current product's code during the unique check
            'code' => ['required', 'string', 'max:255', Rule::unique('products')->ignore($product->id)],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
        ]);

        $product->update($validated);

        return redirect()->route('products-index')->with([
            'message' => 'Product updated successfully!',
            'type' => 'success',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products-index')->with([
            'message' => 'Product deleted successfully!',
            'type' => 'success',
        ]);
    }
}