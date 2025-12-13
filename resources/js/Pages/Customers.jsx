import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Messages from './components/messages';
import { v4 as uuidv4 } from 'uuid';

export default function Settings({ auth, newlist, customers }) {

    const [messages, setMessages] = useState([]);
    const [searchName, setSearchName] = useState(localStorage.getItem('searchName') ?? '');
    const [customersList, setCustomersList] = useState(null);
    const [timer1, setTimer1] = useState(null);
    const [pagination, setPagination] = useState(localStorage.getItem('pagination') ?? 15);


    // ... (Your useEffect, addMessage, makeSearch, and uzklausa functions remain unchanged)
    useEffect(() => {
        localStorage.setItem('pagination', pagination);
        localStorage.setItem('searchName', searchName);
        timer1 && clearTimeout(timer1);
        setTimer1(setTimeout(() => {
            uzklausa(newlist, searchName);
        }, 200));
    }, [searchName, pagination])

    const addMessage = (text, type) => {
        const uuid = uuidv4();
        const message = {
            text,
            type,
            uuid
        };
        setMessages(m => [message, ...m]);
        setTimeout(() => {
            setMessages(m => m.filter(m => m.uuid !== uuid));
        }, 1000);
        // success warning danger < is messeages type :)
    }

    const makeSearch = (field, value) => {
        if (field === 'name') {
            console.log(pagination);
            setSearchName(value);
        }
    };

    const uzklausa = (url, value) => {
        console.log(url);
        axios.post(url, {
            'search': value,
            'pagination': pagination,
        })
            .then(res => {
                if (res.status === 201) {
                    addMessage(res.data.message, res.data.type);
                    setCustomersList(res.data.customers);
                    console.log(res.data.customers);
                }
                else {
                    addMessage('Something went wrong', 'danger');
                }
            }
            )
            .catch(e => {
                console.log(e);
            }
            );

    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                // Updated header styling to match the dashboard's header look
                <div className='flex justify-between items-center'>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Clients
                    </h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out">
                        <a href={route('customers-create')}>Add new client</a>
                    </button>
                </div>
            }
        >
            <Head title="Clients" />

            {/* Changed 'py-12' to 'py-10' and container classes */}
            <div className="py-10">
                {/* Adopted dashboard's max-width, centering, and padding classes */}
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">

                    {/* CLIENTS TABLE SECTION */}
                    <section className="w-full max-w-full">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Client List
                            </h3>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">
                                Manage and view all registered clients.
                            </p>
                        </div>

                        {/* Updated table container styling for a cleaner look */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg border border-gray-200 dark:border-gray-700">

                            {/* Search and Pagination Controls */}
                            <div className='flex flex-col md:flex-row justify-between w-full p-4 border-b dark:border-gray-700'>
                                <div className="flex mb-4 md:mb-0">
                                    <input
                                        className="min-w-0 md:min-w-[300px] lg:min-w-[400px] w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-300 dark:text-gray-200 focus:border-blue-500 focus:ring-blue-500 transition duration-150 ease-in-out"
                                        type="text"
                                        placeholder="Search by name / nickname or ID"
                                        onChange={(e) => makeSearch('name', e.target.value)}
                                        value={searchName}
                                    />
                                </div>

                                <div className="flex items-center justify-end text-sm text-gray-700 dark:text-gray-400">
                                    <label htmlFor="pagination-select" className="mr-3 whitespace-nowrap">
                                        Records per page
                                    </label>
                                    <select
                                        id="pagination-select"
                                        onChange={e => setPagination(e.target.value)}
                                        defaultValue={pagination}
                                        className="rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150 ease-in-out"
                                    >
                                        <option value={15}>15</option>
                                        <option value={30}>30</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Clients Table */}
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            <p>Company name</p>
                                            <p className=" text-xs text-gray-400">Nickname</p>
                                        </th>
                                        <th scope="col" className="px-6 py-3 hidden lg:table-cell">
                                            <p>Invoices count</p>
                                            <p className=" text-xs text-gray-400">Invoices this month</p>
                                        </th>
                                        <th scope="col" className="px-6 py-3 hidden lg:table-cell">
                                            <p>Total sales</p>
                                            <p className=" text-xs text-gray-400">Due / Overdue</p>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customersList !== null ? (customersList.data.map((item) => (

                                        <tr
                                            onClick={() => window.location.href = '/customers/show/'+item.id}
                                            key={item.code}
                                            className="cursor-pointer bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-150 ease-in-out"
                                        >
                                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                <p>{item.name}</p>
                                                <p className=" text-xs text-gray-600 dark:text-gray-400">{item.nickname}</p>
                                                {/* Mobile summary */}
                                                <div className="block md:hidden mt-2 text-xs">
                                                    <p className=" text-gray-700 dark:text-gray-300">Total: {(item.total/100).toFixed(2)}{" €"}</p>
                                                    <p className=" text-gray-700 dark:text-gray-300">Due: {(item.due/100).toFixed(2)}{" €"}{" / "}<span className = {item.overdue > 0 ? 'text-red-600 dark:text-red-400 font-bold' : 'text-gray-500 dark:text-gray-400'}>Overdue: {(item.overdue/100).toFixed(2)}{" €"}</span></p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <p className="text-gray-900 dark:text-white">{item.invoicesCount}</p>
                                                <p className=" text-xs text-gray-600 dark:text-gray-400">{item.invoiceThisMonth ?? 0}</p>
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <p className="text-gray-900 dark:text-white">{(item.total/100).toFixed(2)}{" €"}</p>
                                                <p className=" text-xs text-gray-600 dark:text-gray-400">{(item.due/100).toFixed(2)}{" €"}{" / "}<span className = {item.overdue > 0 ? 'text-red-600 dark:text-red-400 font-bold' : 'text-gray-500 dark:text-gray-400'}>{(item.overdue/100).toFixed(2)}{" €"}</span></p>
                                            </td>
                                        </tr>
                                    ))) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-base font-medium text-gray-900 dark:text-gray-300">Loading clients...</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination Links */}
                            <div className="flex justify-center items-center py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                                {customersList !== null ? (customersList.links.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => { if(item.url) uzklausa(item.url, searchName); }}
                                        dangerouslySetInnerHTML={{ __html: item.label }}
                                        className={`mx-1 p-2 min-w-[32px] text-center rounded-lg transition duration-150 ease-in-out ${
                                            item.active
                                                ? 'bg-blue-600 text-white font-bold text-base'
                                                : item.url
                                                    ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer'
                                                    : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                        }`}
                                        disabled={!item.url}
                                    />
                                ))) : (
                                    <p className="m-4 text-gray-700 dark:text-gray-300">Loading pagination...</p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Messages
                const messages={messages}
            />
        </AuthenticatedLayout>
    );
}