import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
// Assuming Messages component is available for displaying success/error messages
// import Messages from '../components/messages'; 

export default function Products({ auth, newlist, flash }) {
    const [products, setProducts] = useState({ data: [], meta: {} });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(newlist, {
                params: {
                    search: search,
                    pagination: pagination,
                    page: page,
                }
            });
            // Assuming response.data.products is a Laravel Paginator structure
            setProducts(response.data.products); 
            // If you use a local Messages component:
            // addMessage(response.data.message, response.data.type);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching products:', error);
            // If you use a local Messages component:
            // addMessage('Failed to load products.', 'error');
        } finally {
            setLoading(false);
        }
    };
    
    // Initial fetch and refetch when search/pagination changes
    useEffect(() => {
        fetchProducts(1); // Reset to page 1 when search or pagination changes
    }, [search, pagination]);

    // Function to handle page change from the pagination component (if implemented)
    const handlePageChange = (page) => {
        if (page >= 1 && page <= products.meta.last_page) {
            fetchProducts(page);
        }
    };

    // Helper function to format price
    const formatPrice = (price) => {
        return (price / 100).toFixed(2);
    }


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="flex-1 text-3xl font-extrabold text-gray-900 dark:text-white">
                        Product Catalog
                    </h2>
                    <Link 
                        href={route('products-create')}
                        className="w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
                    >
                        + Add New Product
                    </Link>
                </div>
            }
        >
            <Head title="Products" />
            <div className="py-12 text-gray-700 dark:text-gray-200">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Search and Filter Row */}
                    <div className="flex justify-between items-center mb-6">
                        <input
                            type="text"
                            placeholder="Search by name or code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-1/3 rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
                        />
                        <select
                            value={pagination}
                            onChange={(e) => setPagination(e.target.value)}
                            className="rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 shadow-sm text-sm py-2 px-3"
                        >
                            <option value="10">10 per page</option>
                            <option value="25">25 per page</option>
                            <option value="50">50 per page</option>
                        </select>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow-xl sm:rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Code
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Price (€)
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 whitespace-nowrap text-center text-sm font-medium text-gray-500">Loading products...</td>
                                    </tr>
                                ) : products.data.length > 0 ? (
                                    products.data.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                                                {product.code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                {product.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 dark:text-green-400">
                                                {formatPrice(product.price)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link 
                                                    href={route('products-show', product.id)}
                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                                                    title="View"
                                                >
                                                    View
                                                </Link>
                                                <Link 
                                                    href={route('products-edit', product.id)}
                                                    className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 mr-4"
                                                    title="Edit"
                                                >
                                                    Edit
                                                </Link>
                                                {/* DELETE action must be an Inertia action for proper handling */}
                                                <Link 
                                                    as="button"
                                                    method="delete"
                                                    href={route('products-destroy', product.id)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    preserveScroll
                                                    onClick={(e) => {
                                                        if (!confirm('Are you sure you want to delete this product?')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    title="Delete"
                                                >
                                                    Delete
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-500">No products match your search criteria.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        
                        {/* Simple Pagination Footer */}
                        {products.meta.last_page > 1 && (
                            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button 
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-900"
                                    >
                                        Previous
                                    </button>
                                    <button 
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === products.meta.last_page}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-900"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            Showing <span className="font-medium">{products.meta.from}</span> to <span className="font-medium">{products.meta.to}</span> of{' '}
                                            <span className="font-medium">{products.meta.total}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        {/* You can map over products.meta.links for full pagination */}
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            {products.meta.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    className={`
                                                        relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                                        ${link.active
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900 dark:border-blue-500 dark:text-blue-300'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-900'
                                                        }
                                                        ${!link.url ? 'opacity-50 cursor-default' : ''}
                                                    `}
                                                    onClick={(e) => !link.url && e.preventDefault()}
                                                />
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}