import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";

// Consistent styles from the client form
const inputClass = "w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1.5 px-3";
const labelClass = "text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 block";

export default function ProductForm({ auth, product, storeRoute, updateRoute, title }) {
    
    // Determine the route and method
    const isEditing = !!product;
    const actionRoute = isEditing ? updateRoute : storeRoute;
    const actionMethod = isEditing ? 'put' : 'post';

    // Initialize the form state
    const { data, setData, post, put, processing, errors } = useForm({
        code: product?.code || '',
        name: product?.name || '',
        description: product?.description || '',
        // Price is converted for display and editing: (e.g., price / 100)
        price: product ? (product.price / 100).toFixed(2) : '', 
    });

    const submit = (e) => {
        e.preventDefault();
        
        // Convert price back to the format expected by the backend (e.g., cents/lowest denomination)
        const priceInCents = Math.round(parseFloat(data.price) * 100);

        const payload = { ...data, price: priceInCents };

        if (isEditing) {
            put(actionRoute, {
                ...payload,
                onSuccess: () => console.log('Update Success!'),
            });
        } else {
            post(actionRoute, {
                ...payload,
                onSuccess: () => console.log('Store Success!'),
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    <Link 
                        href={route('products-index')}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
                    >
                        Back to Products
                    </Link>
                </div>
            }
        >
            <Head title={title} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="p-6 bg-white dark:bg-gray-800 shadow-xl sm:rounded-lg">
                        <form onSubmit={submit}>
                            {/* --- Grid Layout for Main Fields (Consistent with Client Form) --- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                

                                {/* Product Name Field */}
                                <div>
                                    <label htmlFor="name" className={labelClass}>Product Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className={inputClass}
                                        autoComplete="off"
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                                </div>

                                {/* Price Field */}
                                <div>
                                    <label htmlFor="price" className={labelClass}>Price (€)</label>
                                    <input
                                        id="price"
                                        type="number"
                                        step="0.01" // Allows for two decimal places
                                        name="price"
                                        value={data.price}
                                        className={inputClass}
                                        autoComplete="off"
                                        onChange={(e) => setData('price', e.target.value)}
                                    />
                                    {errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
                                </div>
                                
                                {/* Placeholder for Alignment (if needed, otherwise remove) */}
                                <div className="hidden md:block"></div> 

                            </div>

                            {/* --- Description/Notes Section (Full Width, Like Client Notes) --- */}
                            <div className="mb-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <label htmlFor="description" className={labelClass}>
                                    Product Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    rows="6"
                                    className={`${inputClass} resize-y h-32`}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                            </div>
                            
                            {/* --- Submit Button --- */}
                            <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out disabled:opacity-50"
                                    disabled={processing}
                                >
                                    {isEditing ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}