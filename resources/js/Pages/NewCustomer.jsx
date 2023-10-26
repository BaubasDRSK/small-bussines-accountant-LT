import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Messages from './components/messages';
import { v4 as uuidv4 } from 'uuid';


export default function Settings({ auth, storeRoute }) {
    const [messages, setMessages] = useState([]);

    const companyDetails = [['name','Company name'], ['nickname','Company nickname (brand etc)'], ['code','Company reg. code'], ['vat_code', 'Company VAT code (if any)'] ];
    const companyAddress = [['street','Street, house, flat..'], ['city', 'City'], ['country','Country'], ['zip','Postal code']];
    const companyContact = [['contact_name','Primary contact name'], ['contact_phone','Primary contact phone'], ['contact_email','Primary contact email'], ['website','Company website'] ];
    const companyNotes = ['notes'];
    // const companyBank = ['bank_name', 'bank_account_number', 'bank_swift_code' ];

    const [newClient, setNewClient] = useState({
                                            name:'',
                                            nickname:'',
                                            code:'',
                                            vat_code:'',
                                            street:'',
                                            city:'',
                                            country:'',
                                            zip:'',
                                            contact_name:'',
                                            contact_phone:'',
                                            contact_email:'',
                                            website:'',
                                            notes:''
    });

    const handleUpdateValue = (key, newValue) => {
        setNewClient({
          ...newClient,
          [key]: newValue,
        });
      };

    const store = () => {
        axios.post(storeRoute, {newClient})
           .then(res => {
                if (res.status === 201) {
                    // addMessage(res.data.message, res.data.type);
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

     return (
        <AuthenticatedLayout
            user={auth.user}
            header={
               <div className='flex justify-between gap-4' >
                    <h2 className=" flex-1 text-2xl leading-tight font-bold text-blue-500 dark:bg-gray-800 w-auto">
                        New Client
                    </h2>
                    <button className=" w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
                        <p onClick={store}>Save</p>
                    </button>
                    <button className=" w-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
                        <a href={route('customers-index')}>Cancle</a>
                    </button>
                </div>
            }
        >
            <Head title="New Client" />
            {console.log(newClient)}
            <div className="py-12 ">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <div className="flex justify-center items-end dark:bg-gray-800 dark:text-gray-400">
                            <div className=" flex flex-col md:flex-row flex-wrap gap-7 justify-center w-full px-6">
                                <div className='w-full md:w-1/4 min-w-[250px] flex-col'>
                                    {companyDetails.map((item) =>(
                                        <div key={item[0]} className='my-4'>
                                            <label
                                                htmlFor={item[0]}
                                                className="block text-gray-600  dark:text-gray-400 font-bold mb-1 "
                                            >
                                                {item[1]}:
                                            </label>
                                            <input
                                                id={item[0]}
                                                className="px-4 py-2 border border-gray-300  dark:bg-gray-600 rounded w-full mb-4"
                                                type="text"
                                                value={newClient[item[0]]}
                                                onChange={(e) => handleUpdateValue(item[0], e.target.value)}
                                            />
                                        </div>
                                    ))}
                                    </div>
                                    <div className='w-full md:w-1/4 min-w-[250px] flex-col'>
                                        {companyAddress.map((item) =>(
                                            <div key={item[0]} className='my-4'>
                                                <label
                                                    htmlFor={item[0]}
                                                    className="block text-gray-600  dark:text-gray-400 font-bold mb-1 "
                                                >
                                                    {item[1]}:
                                                </label>
                                                <input
                                                    id={item[0]}
                                                    className="px-4 py-2 border border-gray-300  dark:bg-gray-600 rounded w-full mb-4"
                                                    type="text"
                                                    value={newClient[item[0]]}
                                                    onChange={(e) => handleUpdateValue(item[0], e.target.value)}
                                                />
                                            </div>
                                        ))}
                                </div>
                                <div className='w-full md:w-1/4 min-w-[250px] flex-col'>
                                        {companyContact.map((item, index) =>(
                                            <div key={item[0]} className='my-4'>
                                                <label
                                                    htmlFor={item[0]}
                                                    className="block text-gray-600  dark:text-gray-400 font-bold mb-1 "
                                                >
                                                    {item[1]}{' '}{index}:
                                                </label>
                                                <input
                                                    id={item[0]}
                                                    className="px-4 py-2 border border-gray-300  dark:bg-gray-600 rounded w-full mb-4"
                                                    type="text"
                                                    value={newClient[item[0]]}
                                                    onChange={(e) => handleUpdateValue(item[0], e.target.value)}
                                                />
                                            </div>
                                        ))}
                                </div>
                                <div className='w-4/5 '>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes about client:</label>
                                    <textarea id="notes" name="input" className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200" rows="4" placeholder="Enter a long text..."
                                                value={newClient['notes']}
                                                onChange={(e) => handleUpdateValue('notes', e.target.value)}></textarea>
                                </div>
                                <div className='w-4/5 flex justify-center gap-4 mb-4'>
                                    <button className=" w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
                                        <p onClick={store}>Save</p>
                                    </button>
                                    <button className=" w-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
                                        <a href={route('customers-index')}>Cancle</a>
                                    </button>
                                </div>
                            </div>
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
