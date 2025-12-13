import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import Messages from './components/messages';
import { v4 as uuidv4 } from 'uuid';
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Products({ auth, newlist }) {

    const [messages, setMessages] = useState([]);
    const [searchName, setSearchName] = useState(localStorage.getItem('searchItem') || '');
    const [productsList, setProductsList] = useState(null);
    const [timer1, setTimer1] = useState(null);
    const [pagination, setPagination] = useState(localStorage.getItem('pagination') || '15');


    // 1. FIX: Stabilize addMessage using useCallback
    const addMessage = useCallback((text, type) => {
        const uuid = uuidv4();
        const message = {
            text,
            type,
            uuid
        };
        // Use functional state update form (m => ...) to avoid needing 'messages' in dependency array
        setMessages(m => [message, ...m]); 
        
        setTimeout(() => {
            setMessages(m => m.filter(msg => msg.uuid !== uuid));
        }, 2000); 
    }, []); // Dependency Array is empty because setMessages is stable

    // 2. uzklausa now depends on a stable addMessage and stable pagination
    const uzklausa = useCallback((url, value) => {
        axios.post(url, {
            'search': value,
            'pagination': pagination,
        })
        .then(res => {
            if (res.status === 201) {
                addMessage(res.data.message, res.data.type);
                setProductsList(res.data.products);
                console.log(res.data.products);
            }
            else {
                addMessage('Something went wrong', 'danger');
            }
        })
        .catch(e => {
            console.error(e);
            addMessage('Request failed: Check console for details.', 'danger');
        });
    }, [pagination, addMessage]); // dependencies: pagination, addMessage


    useEffect(() => {
        localStorage.setItem('pagination', pagination);
        localStorage.setItem('searchItem', searchName);

        // Standard cleanup pattern for timer
        if (timer1) {
            clearTimeout(timer1);
        }

        const newTimer = setTimeout(() => {
            uzklausa(newlist, searchName);
        }, 200);

        setTimer1(newTimer);

        // Cleanup function
        return () => {
            if (newTimer) {
                clearTimeout(newTimer);
            }
        };
    }, [searchName, pagination, newlist, uzklausa]); // dependencies: searchName, pagination, newlist, uzklausa


    const makeSearch = (field, value) => {
        if (field === 'name') {
            console.log(pagination);
            setSearchName(value);
        }
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        📦 Products / Services
                    </h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out">
                        <a href="#">Add new product</a>
                    </button>
                </div>
            }
        >
            <Head title="Products" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">

                        {/* Search and Pagination Controls */}
                        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-t-lg'>
                            <div className="flex-1 min-w-0 mb-4 sm:mb-0">
                                <input
                                    className="w-full sm:min-w-[300px] rounded-lg border-gray-300 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150 ease-in-out"
                                    type="text"
                                    placeholder="Search by name / description or price"
                                    onChange={(e) => makeSearch('name', e.target.value)}
                                    value={searchName}
                                />
                            </div>

                            <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 sm:ml-4">
                                <label htmlFor="pagination-select" className="mr-2 hidden md:inline">
                                    Records per page:
                                </label>
                                <select 
                                    id="pagination-select"
                                    onChange={e => setPagination(e.target.value)} 
                                    value={pagination} 
                                    className="rounded-lg border-gray-300 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-200 text-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="15">15</option>
                                    <option value="30">30</option>
                                    <option value="50">50</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Table (omitted for brevity) */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 w-1/12">ID</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 w-3/12">Product (service) name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 w-4/12">Description</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 w-2/12">Price</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 w-2/12">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                    {productsList !== null && productsList.data.length > 0 ? (
                                        productsList.data.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.code || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{item.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{item.description || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">{(item.price / 100).toFixed(2)} €</td>
                                                <td className="px-6 py-4 flex gap-4">
                                                    <a href="#" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600" title="Edit"> 
                                                         <PencilSquareIcon className="w-5 h-5" />
                                                    </a>
                                                    <a href="#" className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600" title="Delete">
                                                        <TrashIcon className="w-5 h-5" />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {productsList === null ? 'Loading products...' : 'No products found.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Links (omitted for brevity) */}
                        {productsList?.links && productsList.links.length > 3 && (
                            <div className="flex justify-center items-center py-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
                                {productsList.links.map((item, index) => (
                                    <span 
                                        key={index}
                                        onClick={() => { item.url && uzklausa(item.url, searchName); }}
                                        dangerouslySetInnerHTML={{ __html: item.label.replace('Previous', '«').replace('Next', '»') }}
                                        className={`mx-2 px-3 py-1 cursor-pointer rounded-lg text-sm transition duration-150 ease-in-out
                                            ${item.url ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700' : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'}
                                            ${item.active ? 'bg-blue-500 text-white dark:bg-blue-600 hover:bg-blue-500 dark:hover:bg-blue-600 font-bold' : ''}`}
                                    ></span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <Messages messages={messages} />
        </AuthenticatedLayout>
    );
}