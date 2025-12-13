import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Messages from './components/messages';
import { v4 as uuidv4 } from 'uuid';
import ModalYesCancel from './components/modalYesCancel';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid'; // Assuming you have Heroicons installed

export default function Settings({ auth, newlist, updateInvoiceRoute }) {

    const [messages, setMessages] = useState([]);
    const [searchName, setSearchName] = useState(localStorage.getItem('searchInvoiceName')) ?? '';
    const [invoicesList, setInvoicesList] = useState(null);
    const [timer1, setTimer1] = useState(null);
    const [pagination, setPagination] = useState(localStorage.getItem('pagination') ?? 15);
    const [sort, setSort] = useState({ sortDirection: 'asc', sortName: 'due' });

    const [modalStatus, setModalStatus] = useState(false);
    const [modalItem, setModalItem] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState(null);


    useEffect(() => {
        localStorage.setItem('pagination', pagination);
        localStorage.setItem('searchInvoiceName', searchName);
        timer1 && clearTimeout(timer1);
        setTimer1(setTimeout(() => {
            // Include sort state in initial and search-triggered request
            uzklausa(newlist, searchName, sort);
        }, 500));
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
            setSearchName(value);
        }
    };

    const doSort = n => {
        setSort(s => {
            if (s.sortName !== n) {
                return { sortDirection: 'asc', sortName: n };
            }
            switch (s.sortDirection) {
                case 'desc': return { sortDirection: 'asc', sortName: n };
                case 'asc': return { sortDirection: 'desc', sortName: n };
                default: return { sortDirection: 'asc', sortName: 'due' };
            };
        });
    }

    // This useEffect is good for sorting, but should use the new sort state
    useEffect(() => {
        // Only run if the initial data is loaded or if searchName/pagination didn't already trigger it
        if (invoicesList !== null || searchName === '' && pagination === 15) {
            uzklausa(newlist, searchName, sort);
        }
    }, [sort]);

    const handlePaidStatusChange = (e, invoice) => {
        e.stopPropagation();
        // The modal handler will update the state locally before calling this
        const updatedInvoice = { ...invoice, paid: invoice.paid ? 0 : 1 };
        
        axios.post(updateInvoiceRoute, { fullInvoice: updatedInvoice })
            .then(res => {
                if (res.status === 201) {
                    addMessage(res.data.message, res.data.type);
                    // Update the list locally if successful to reflect the change
                    setInvoicesList(prevList => ({
                        ...prevList,
                        data: prevList.data.map(item =>
                            item.id === updatedInvoice.id ? updatedInvoice : item
                        )
                    }));
                }
                else {
                    addMessage('Update failed', 'danger');
                }
            })
            .catch(e => {
                console.log(e);
                addMessage('An error occurred during update', 'danger');
            });
    };

    const uzklausa = (url, value, currentSort) => {
        axios.post(url, {
            'search': value,
            'pagination': pagination,
            'sort': currentSort,
        })
            .then(res => {
                if (res.status === 201) {
                    // addMessage(res.data.message, res.data.type); // Keeping this commented out as per your original logic
                    setInvoicesList(res.data.invoices);
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

    const SortIcon = ({ name }) => {
        if (sort.sortName !== name) {
            return <div className="text-gray-400 dark:text-gray-500 ml-1">⇅</div>; // Neutral or small icon
        }
        return sort.sortDirection === 'asc' ? <ChevronUpIcon className="h-4 w-4 ml-1" /> : <ChevronDownIcon className="h-4 w-4 ml-1" />;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                // Updated header styling to match the dashboard's header look
                <div className='flex justify-between items-center'>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Invoices
                    </h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out">
                        <a href={route('invoices-create', [1])}>Add new invoice</a>
                    </button>
                </div>
            }
        >
            <Head title="Invoices" />

            {/* Adopted dashboard's main container and padding classes */}
            <div className="py-10">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">

                    {/* INVOICES TABLE SECTION */}
                    <section className="w-full max-w-full">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Invoice List
                            </h3>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">
                                View, filter, and manage all business invoices.
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
                                        placeholder="Search by invoice nr. or name or company"
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

                            {/* Invoices Table */}
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        {/* Sortable Column Headers */}
                                        <th scope="col" className="px-6 py-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-600/70 transition duration-150" onClick={() => doSort('invoice_number')}>
                                            <div className="flex items-center">
                                                <div className="flex flex-col">
                                                    <p className="font-semibold">Invoice number</p>
                                                    <p className="text-xs font-normal text-gray-400">Issue date</p>
                                                </div>
                                                <SortIcon name="invoice_number" />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-600/70 transition duration-150" onClick={() => doSort('name')}>
                                            <div className="flex items-center">
                                                <div className="flex flex-col">
                                                    <p className="font-semibold">Invoice name</p>
                                                    <p className="text-xs font-normal text-gray-400">Client</p>
                                                </div>
                                                <SortIcon name="name" />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 hidden lg:table-cell cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-600/70 transition duration-150" onClick={() => doSort('total')}>
                                            <div className="flex items-center">
                                                <p className="font-semibold">Total</p>
                                                <SortIcon name="total" />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 hidden lg:table-cell cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-600/70 transition duration-150" onClick={() => doSort('paid')}>
                                            <div className="flex items-center">
                                                <p className="font-semibold">Paid</p>
                                                <SortIcon name="paid" />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 hidden lg:table-cell cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-600/70 transition duration-150" onClick={() => doSort('due')}>
                                            <div className="flex items-center">
                                                <p className="font-semibold">Due Date</p>
                                                <SortIcon name="due" />
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoicesList !== null ? (invoicesList.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            onClick={() => window.location.href = '/invoices/show/' + item.id}
                                            className="cursor-pointer bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-150 ease-in-out"
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                <p className="text-base font-semibold text-blue-600 dark:text-blue-400">{item.invoice_number}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{item.invoice_date}</p>
                                                {/* Mobile summary */}
                                                <div className="block md:hidden mt-2 text-xs">
                                                    <p className=" text-gray-700 dark:text-gray-300">Total: {(item.total / 100).toFixed(2)}{" €"}</p>
                                                    <p className={`text-sm font-semibold ${item.paid ? 'text-green-600 dark:text-green-400' : item.due < 0 ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                                        Due: {item.invoice_due_date}
                                                    </p>
                                                    <div className="mt-1">
                                                        <label htmlFor={`paidStatus-${item.id}`} className="inline-flex items-center cursor-pointer">
                                                            <input type="checkbox"
                                                                onChange={(e) => {
                                                                    e.stopPropagation();
                                                                    setModalStatus(true);
                                                                    setModalItem(item);
                                                                    setModalTitle('Confirm Paid Status Change');
                                                                    // Pass the handler and the original event/item to the modal
                                                                    setModalAction(() => [handlePaidStatusChange, e]); 
                                                                    setModalMessage(`Are you sure you want to change paid status for invoice ${item.invoice_number}?`);
                                                                }}
                                                                id={`paidStatus-${item.id}`}
                                                                name={`paidStatus-${item.id}`}
                                                                checked={item.paid === 1}
                                                                className="rounded text-blue-600 shadow-sm focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                                            />
                                                            <span className={`ml-2 text-sm font-medium ${item.paid ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                                {item.paid ? 'Paid' : 'Unpaid'}
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <p className="text-gray-900 dark:text-white">{item.name}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{item.customer.name}</p>
                                            </td>

                                            <td className="px-6 py-4 hidden lg:table-cell font-semibold text-gray-900 dark:text-white">
                                                {(item.total / 100).toFixed(2)}{" €"}
                                            </td>

                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <label htmlFor={`paidStatusLarge-${item.id}`} className="inline-flex items-center cursor-pointer">
                                                    <input type="checkbox"
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            setModalStatus(true);
                                                            setModalItem(item);
                                                            setModalTitle('Confirm Paid Status Change');
                                                            setModalAction(() => [handlePaidStatusChange, e]);
                                                            setModalMessage(`Are you sure you want to change paid status for invoice ${item.invoice_number}?`);
                                                        }}
                                                        id={`paidStatusLarge-${item.id}`}
                                                        name={`paidStatusLarge-${item.id}`}
                                                        checked={item.paid === 1}
                                                        className="rounded text-blue-600 shadow-sm focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 h-5 w-5"
                                                    />
                                                    <span className={`ml-2 text-sm font-medium ${item.paid ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                        {item.paid ? 'Paid' : 'Unpaid'}
                                                    </span>
                                                </label>
                                            </td>

                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <p className={`font-semibold ${item.paid ? 'text-green-600 dark:text-green-400' : item.due < 0 ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                                    {item.invoice_due_date}
                                                </p>
                                                {!item.paid && item.due < 0 && (
                                                    <span className="text-xs font-medium text-red-500 dark:text-red-400">OVERDUE</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-base font-medium text-gray-900 dark:text-gray-300">Loading invoices...</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination Links */}
                            <div className="flex justify-center items-center py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                                {invoicesList !== null ? (invoicesList.links.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => { if (item.url) uzklausa(item.url, searchName, sort); }}
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
            
            {/* Modal and Messages components */}
            <ModalYesCancel
                modalItem={modalItem}
                modalStatus={modalStatus}
                setModalStatus={setModalStatus}
                modalTitle={modalTitle}
                modalMessage={modalMessage}
                modalAction={modalAction}
            >
            </ModalYesCancel>
            <Messages
                messages={messages}
            />
        </AuthenticatedLayout>
    );
}