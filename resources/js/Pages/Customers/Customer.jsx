import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Messages from '../components/messages';
import { v4 as uuidv4 } from 'uuid';

export default function Settings({ auth, newlist, customer }) {

    const [messages, setMessages] = useState([]);
    const [searchName, setSearchName] = useState(localStorage.getItem('searchName'));
    const [customersList, setCustomersList] = useState(null);
    const [timer1, setTimer1] = useState(null);
    const [pagination, setPagination] = useState(localStorage.getItem('pagination'));


    console.log(customer);

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
                        Customer111
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

                </div>
            </div>
            <Messages
                const messages={messages}
            />
        </AuthenticatedLayout>
    );
}
// ???
