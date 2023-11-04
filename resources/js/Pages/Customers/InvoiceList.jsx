import { useEffect, useState } from "react";

export default function InvoicesList({ invoicesList, doSort, setInvoicesList, sortInvoices }){

    const [search, setSearch]= useState('');
    const [invoicesFullList, setInvoicesFullList] = useState([...invoicesList]);

    const searchInvoices = () => {
        const searchedList = [...invoicesFullList];
        const filteredList = !search.length ? [...invoicesFullList] : searchedList.filter(item => item.name.toLowerCase().includes(search));

        setInvoicesList([...filteredList]);
    };

    return (
        <div className="max-w-7xl mx-auto mt-3 pt-3 sm:px-6 lg:px-8 flex flex-wrap justify-items-center bg-gray-200">
                    <h2 className="mb-4 text-lg font-bold text-blue-600">Client invoices</h2>
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3" onClick={()=>doSort('invoice_number')}>
                                            Invoice number
                                        </th>
                                        <th scope="col" className="px-6 py-3" >
                                            <div className="relative">
                                                <label htmlFor="Search" className="sr-only"> Search </label>

                                                <input
                                                    type="text"
                                                    id="Search"
                                                    placeholder="Invoice name"
                                                    className="w-full rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm"
                                                    value = {search}
                                                    onChange = {(e)=> setSearch(e.target.value)}
                                                />

                                                <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
                                                    <button type="button" className="text-gray-600 hover:text-gray-700"
                                                        onClick = {() => searchInvoices()}
                                                        >
                                                    <span className="sr-only">Search</span>

                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="h-4 w-4"
                                                    >
                                                        <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                                        />
                                                    </svg>
                                                    </button>
                                                </span>
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3" onClick={()=>doSort('total')}>
                                            Total
                                        </th>
                                        <th scope="col" className="px-6 py-3"onClick={()=>doSort('due')}>
                                            Due
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoicesList.length ? (invoicesList.map((item) => {
                                        const today = new Date();
                                        const yesterday = new Date(today);
                                        yesterday.setDate(today.getDate() - 1);
                                        const invoiceDue = new Date(item.invoice_due_date);
                                        let textColor = item.paid ? "text-green-500" : "text-gray-500";
                                        const isOverDue = invoiceDue < yesterday && !item.paid;
                                        textColor = isOverDue ? "text-red-500" : textColor;

                                        return (

                                        <tr key={item.invoice_number} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.invoice_number}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.name}
                                            </td>
                                            <td className={`px-6 py-4 ${textColor}`}>
                                                {(item.total/100).toFixed(2)}{" €"}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {item.invoice_due_date}
                                            </td>
                                        </tr>
                                    )})) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-gray-300">No invoices</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                </div>
    )
}
