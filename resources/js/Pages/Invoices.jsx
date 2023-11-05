import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Messages from './components/messages';
import { v4 as uuidv4 } from 'uuid';
import ModalYesCancel from './components/modalYesCancel';

export default function Settings({ auth, newlist }) {

    const [messages, setMessages] = useState([]);
    const [searchName, setSearchName] = useState(localStorage.getItem('searchName'));
    const [invoicesList, setInvoicesList] = useState(null);
    const [timer1, setTimer1] = useState(null);
    const [pagination, setPagination] = useState(localStorage.getItem('pagination'));
    const [sort, setSort] = useState({sortDirection:'asc', sortName:'due'});

    const [modalStatus, setModalStatus] = useState(false);
    const [modalItem, setModalItem] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState(null);



    useEffect(() => {
        localStorage.setItem('pagination', pagination);
        localStorage.setItem('searchName', searchName);
        timer1 && clearTimeout(timer1);
        setTimer1(setTimeout(() => {
            uzklausa(newlist, searchName);
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
          switch (s.sortDirection) {
              case 'desc': return {sortDirection:'asc', sortName:n};
              case 'asc': return {sortDirection:'desc', sortName:n};
              default: return {sortDirection:'asc', sortName:'due'};
          };
        });
      }

    const  sortInvoices = (invoices) => {
        const sortedList = [...invoices.data];
        console.log(sortedList);
        if (sort.sortDirection == 'up'){
            console.log('up');
            sortedList.sort((a,b)=>{
            if (typeof a[sort.sortName] === 'number' && typeof b[sort.sortName] === 'number'){
                return a[sort.sortName]- b[sort.sortName];
            } else {
                return a[sort.sortName].localeCompare(b[sort.sortName]);
            }
            });
        } else {
            console.log('down');
            sortedList.sort((a,b)=>{
            if (typeof a[sort.sortName] === 'number' && typeof b[sort.sortName] === 'number'){
                console.log(b[sort.sortName], a[sort.sortName])
                return b[sort.sortName]- a[sort.sortName];
            } else {
                console.log('down text');
                return b[sort.sortName].localeCompare(a[sort.sortName]);
            }
            });
        }
        invoices['data'] = [...sortedList];
        console.log(invoices);
        return invoices;
    };

    useEffect(()=>{
        // invoicesList !== null ? setInvoicesList(sortInvoices(invoicesList)) : null;
        uzklausa(newlist, searchName, sort);
    },[sort]);

    const  handlePaidStatusChange =  (invoice, ) =>{
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

    const uzklausa = (url, value, sort) => {
        axios.post(url, {
            'search': value,
            'pagination': pagination,
            'sort': sort,
        })
            .then(res => {
                if (res.status === 201) {
                    addMessage(res.data.message, res.data.type);
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className='flex justify-between'>
                    <h2 className=" flex-1 text-2xl leading-tight font-bold text-blue-500 dark:bg-gray-800 w-auto">
                        Customers
                    </h2>
                    <button className=" w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
                        <a href={route('customers-create')}>Add new client</a>
                    </button>
                </div>
            }
        >
            <Head title="Settings" />
            <div className="py-12 ">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

                        <div className='flex flex-wrap justify-between w-full text-sm text-left text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400'>
                            <div className="flex px-6 py-3">
                                <input
                                    className=" flex min-w-[230px] w-auto rounded-md placeholder-gray-300 dark:bg-gray-500 dark:placeholder-gray-300 dark:text-gray-300"
                                    type="text"
                                    placeholder="Search by name / nickname or ID"
                                    onChange={(e) => makeSearch('name', e.target.value)}
                                    value={searchName}
                                />
                            </div>
                            <div className=" flex px-6 py-3 justify-end">
                                <div>
                                    Records per page
                                    <select onChange={e => setPagination(e.target.value)} defaultValue={pagination} className="rounded-md text-gray-500 ml-4 dark:bg-gray-500 dark:text-gray-300">
                                        <option value={15}>15</option>
                                        <option value={30}>30</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3" onClick={()=>doSort('invoice_number')}>
                                        <p className="text-m">Invoice number</p>
                                        <p className="text-xs">(issue date)</p>
                                    </th>
                                    <th scope="col" className="px-6 py-3" onClick={()=>doSort('name')}>
                                        <p className="text-s">Invoice name</p>
                                        <p className="text-xs">Client</p>
                                    </th>
                                    <th scope="col" className="px-6 py-3 hidden lg:table-cell" onClick={()=>doSort('total')}>
                                        <p>Total</p>
                                    </th>
                                    <th scope="col" className="px-6 py-3 hidden lg:table-cell" onClick={()=>doSort('paid')}>
                                        <p>Paid</p>
                                    </th>
                                    <th scope="col" className="px-6 py-3 hidden lg:table-cell" onClick={()=>doSort('due')}>
                                        <p>Due</p>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoicesList !== null ? (invoicesList.data.map((item) => (

                                    <tr
                                        // onClick={() => window.location.href = '/customers/show/' + item.id}
                                        key={item.id}
                                        className="cursor-pointer bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <p className="text-m">{item.invoice_number}</p>
                                            <p className="text-xs">{item.invoice_date}</p>

                                        </td>

                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <p className="text-m">{item.name}</p>
                                            <p className=" text-xs text-gray-600">{item.customer.name}</p>
                                            <div className="block md:hidden">
                                                <p className=" text-xs text-gray-600">{(item.total / 100).toFixed(2)}{" €"}</p>
                                            </div>
                                        </td>
                                        <td className={`'px-6 py-4  hidden lg:table-cell ' ${item.paid ? 'text-green-700' : item.due < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                            <p>{(item.total / 100).toFixed(2)}{" €"}</p>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <input type="checkbox"
                                                onChange={() => {
                                                    setModalStatus(true);
                                                    setModalItem(item);
                                                    setModalTitle('Check again!');
                                                    setModalAction(() => handlePaidStatusChange);
                                                    setModalMessage(`Are You sure you want to change paid status for invoice  ${item.invoice_number}`);
                                                }}
                                                id="paidStatus" name="paidStatus" checked={item.paid === 1 ? true : false} />
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <p className={`${item.paid ? 'text-green-700' : item.due < 0 ? 'text-red-500' : 'text-gray-500'}`}>{item.invoice_due_date}</p>
                                        </td>
                                    </tr>
                                ))) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-gray-300">Loading</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="flex justify-center items-end ">
                            {invoicesList !== null ? (invoicesList.links.map((item) => (
                                <p key={item.label}

                                    onClick={() => { uzklausa(item.url, searchName); }}
                                    dangerouslySetInnerHTML={{ __html: item.label }}
                                    className={`m-4 ${item.active && 'text-xl text-blue-500'} cursor-pointer`}

                                ></p>
                            ))) : (
                                <p className="m-4">Loading</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ModalYesCancel
                    modalItem = {modalItem}
                    modalStatus = {modalStatus}
                    setModalStatus={setModalStatus}
                    modalTitle = {modalTitle}
                    modalMessage = {modalMessage}
                    modalAction = {modalAction}
                    >
            </ModalYesCancel>
            <Messages
                const messages={messages}
            />
        </AuthenticatedLayout>
    );
}
// ???
