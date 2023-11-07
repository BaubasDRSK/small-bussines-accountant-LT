import { useEffect, useState } from "react";
import ModalYesCancel from '../components/modalYesCancel';

export default function InvoicesList({ invoicesList, doSort, setInvoicesList, sortInvoices, updateInvoiceRoute, addMessage }){

    const [search, setSearch]= useState('');
    const [invoicesFullList, setInvoicesFullList] = useState([...invoicesList]);

    const [modalStatus, setModalStatus] = useState(false);
    const [modalItem, setModalItem] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState(null);

    const  handlePaidStatusChange =  (e, invoice) =>{
            e.stopPropagation();
            invoice.paid = invoice.paid ? 0 : 1;
            const updatedInvoicesList = invoicesList.map(item => {
                if(item.id === invoice.id){
                    item.paid = invoice.paid;
                    return item;
                }
                return item;
            });

            setInvoicesList(updatedInvoicesList);
            axios.post(updateInvoiceRoute, {invoice: invoice.id, paid: invoice.paid})
            .then(res => {
                if (res.status === 201) {
                    addMessage(res.data.message, res.data.type);
                    localStorage.setItem('searchName', newClient['name']);
                    window.location.href = res.data.route;
                }
                else {

                }
            }
            )
            .catch(e => {
                console.log(e);
            }
            );
    };


    const searchInvoices = () => {
        const searchedList = [...invoicesFullList];
        const filteredList = !search.length ? [...invoicesFullList] : searchedList.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

        setInvoicesList(sortInvoices(filteredList));
    };

    return (
        <div className="max-w-7xl mx-auto mt-3 py-4 sm:px-6 lg:px-8 flex flex-wrap justify-items-center bg-gray-200">
                    <h2 className="mb-4 text-lg font-bold text-blue-600">Client invoices</h2>
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3" onClick={()=>doSort('invoice_number')}>
                                            <p className="text-m">Invoice number</p>
                                            <p className="text-xs">(issue date)</p>
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
                                        <th scope="col" className="px-6 py-3" onClick={()=>doSort('paid')}>
                                           Paid
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
                                        let textColor = item.paid ? "text-green-700" : "text-gray-700";
                                        const isOverDue = invoiceDue < yesterday && !item.paid;
                                        textColor = isOverDue ? "text-red-500" : textColor;

                                        return (

                                        <tr key={item.invoice_number} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log('cia kur reikia');
                                                    window.location.href = '/invoices/show/'+item.id
                                                }}
                                            >
                                                <p className="text-m">{item.invoice_number}</p>
                                                <p className="text-xs">{item.invoice_date}</p>
                                            </td>
                                            <td className="px-6 py-4"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log('cia kur reikia');
                                                    window.location.href = '/invoices/show/'+item.id
                                                }}
                                            >
                                                {item.name}
                                            </td>
                                            <td className={`px-6 py-4 ${textColor}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log('cia kur reikia');
                                                    window.location.href = '/invoices/show/'+item.id
                                                }}
                                            >
                                                {(item.total/100).toFixed(2)}{" €"}
                                            </td>
                                            <td className={`px-6 py-4 ${textColor}`}>
                                                <input type="checkbox"
                                                    onChange = {(e) => {
                                                        setModalStatus(true);
                                                        setModalItem(item);
                                                        setModalTitle('Check again!');
                                                        setModalAction(() => [handlePaidStatusChange, e]);
                                                        setModalMessage(`Are You sure you want to change paid status for invoice  ${item.invoice_number}`);
                                                    }}
                                                    id="paidStatus" name="paidStatus"  checked={item.paid === 1 ? true : false} />
                                            </td>
                                            <td className={`px-6 py-4 ${textColor}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log('cia kur reikia');
                                                    window.location.href = '/invoices/show/'+item.id
                                                }}
                                            >
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
                            {console.log(modalAction)}
                <ModalYesCancel
                    modalItem = {modalItem}
                    modalStatus = {modalStatus}
                    setModalStatus={setModalStatus}
                    modalTitle = {modalTitle}
                    modalMessage = {modalMessage}
                    modalAction = {modalAction}
                    >
                </ModalYesCancel>
                </div>

    )
}
