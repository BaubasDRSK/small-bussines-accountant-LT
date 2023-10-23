import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Messages from './components/messages';
import { v4 as uuidv4 } from 'uuid';
// import { usePage } from '@inertiajs/inertia-react';

export default function Settings({ auth, newlist, customers }) {

    const [messages, setMessages] = useState([]);
    const [paginations, setPaginations] = useState(5);
    // const [filter, setFilter] = useState([]);
    // const [search, setSearch] = useState('nothing');
    const search = {
        'search': 'kaminas',
    }


    useEffect(() =>{
        console.log('saunam');
        console.log(search);
        axios.post(newlist, search)
        .then(res => {
            if (res.status === 201) {
                addMessage(res.data.message, res.data.type);
                console.log(res.data.aaa);
            }
            else {

            }
        }
        )
        .catch(e => {
            console.log(e);
        }
        );

    } ,[]);

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
        }, 2000);
        // success warning danger
    }


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-2xl leading-tight font-bold text-blue-500">
                    Customers
                </h2>
            }
        >
            <Head title="Settings" />
            <div className="py-12 ">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {console.log(customers)}
                    {console.log(customers['links'])}

                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <tbody className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    <input className="rounded-md placeholder-gray-300 " type="text" placeholder="Search by name" />
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <input className="rounded-md placeholder-gray-300 " type="text" placeholder="Search by Street" />
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <input className="rounded-md placeholder-gray-300 " type="text" placeholder="Search by city" />
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Record per page
                                    <select className="rounded-md text-gray-500 ml-4">
                                        <option value="option1">15</option>
                                        <option value="option2">30</option>
                                        <option value="option3">50</option>
                                    </select>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>

                            </tr>
                        </tbody>
                        <hr />
                        </table>
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Company name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Street
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    City
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                    {customers.data.map((item) => (

                            <tr key={item.code} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {item.name}
                            </th>
                            <td className="px-6 py-4">
                            {item.street}
                            </td>
                            <td className="px-6 py-4">
                            {item.city}
                            </td>
                            <td className="px-6 py-4">
                                $2999
                            </td>
                            <td className="px-6 py-4 text-right">
                                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                            </td>
                        </tr>
                    ))}
                        </tbody>
                        </table>
                        <div className="flex justify-center items-end ">
                            {customers.links.map((item) => (
                            <a key={item.label} href={item.url} dangerouslySetInnerHTML={{ __html: item.label }} className={`m-4 ${item.active && 'text-xl text-blue-500'}`}></a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
                <Messages
                    const messages = {messages}
                />
        </AuthenticatedLayout>
    );
}
// ???
