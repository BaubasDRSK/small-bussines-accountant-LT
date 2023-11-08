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
                <div className='flex justify-between'>
                    <h2 className=" flex-1 text-2xl leading-tight font-bold text-blue-500 dark:bg-gray-800 w-auto">
                        Clients
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
                                    className=" flex min-w-[300px] lg:min-w-[400px]  w-auto rounded-md placeholder-gray-300 dark:bg-gray-500 dark:placeholder-gray-300 dark:text-gray-300"
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
                                        <p className=" text-xs text-gray-400">Due / OverDue</p>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {customersList !== null ? (customersList.data.map((item) => (

                                    <tr
                                        onClick={() => window.location.href = '/customers/show/'+item.id}
                                        key={item.code}
                                        className="cursor-pointer bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <p>{item.name}</p>
                                            <p className=" text-xs text-gray-600">{item.nickname}</p>
                                            <div className="block md:hidden">
                                                <p className=" text-xs text-gray-600">{(item.total/100).toFixed(2)}{" €"}</p>
                                                <p className=" text-xs text-gray-600">{(item.due/100).toFixed(2)}{" €"}{" / "}<span className = {item.overdue > 0 ? 'text-red-600 font-bold' : 'text-gray-500'}>{(item.overdue/100).toFixed(2)}{" €"}</span></p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <p>{item.invoicesCount}</p>
                                            <p className=" text-xs text-gray-600">{item.invoiceThisMonth ?? 0}</p>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            {(item.total/100).toFixed(2)}{" €"}
                                            <p className=" text-xs text-gray-600">{(item.due/100).toFixed(2)}{" €"}{" / "}<span className = {item.overdue > 0 ? 'text-red-600 font-bold' : 'text-gray-500'}>{(item.overdue/100).toFixed(2)}{" €"}</span></p>
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
                            {customersList !== null ? (customersList.links.map((item) => (
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
            <Messages
                const messages={messages}
            />
        </AuthenticatedLayout>
    );
}
// ???
