import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Messages from './components/messages';
import { v4 as uuidv4 } from 'uuid';


export default function Settings({ auth, storeUrl, company }) {
    const [companyInfoServer, setCompanyInfoServer] = useState(company[0]);
    const companyInfoKeys = Object.keys(companyInfoServer);
    const [companyInfo, setComp] = useState(companyInfoServer);
    const [messages, setMessages] = useState([]);

    const handleUpdateValue = (key, newValue) => {
        setComp({
          ...companyInfo,
          [key]: newValue,
        });
      };

    function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
    }

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

    const store = () => {
        console.log('Store');

        axios.post(storeUrl, companyInfo)
            .then(res => {
                if (res.status === 201) {
                    setCompanyInfoServer({...companyInfo})
                    addMessage(res.data.message, res.data.type);
                    console.log('Urraaa');
                }
                else {

                }
            }
            )
            .catch(e => {
                console.log(e);
            }
            );
    }

    const cancel = () => {
        setComp({
            ...companyInfoServer,
          })
        addMessage('Data restored', 'warning');
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-2xl leading-tight font-bold text-blue-500">
                    Settings
                </h2>
            }
        >
            <Head title="Settings" />
            {console.log(companyInfoServer)}
            {console.log(companyInfoKeys)}
            <div className="py-12 ">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-2xl font-bold text-blue-500 w-auto mx- auto text-center">
                            Settings of yout company
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-gray-900 w-1/2 mx-auto">
                        {companyInfoKeys.map((key) => (
                             key ==='isvat' ?
                             (
                                <div className="mb-4" key={key}>
                                    <label
                                        htmlFor={key}
                                        className="block text-gray-600 font-bold mb-1"
                                    >
                                        Are You VAT registered?:
                                    </label>
                                    <input
                                        id={key}
                                        className="px-4 py-2 border border-gray-300 rounded "
                                        type="checkbox"
                                        checked={companyInfo[key]}
                                        onChange={() =>
                                            setComp({
                                                ...companyInfo,
                                                [key]: (companyInfo[key] === 1 ? 0 : 1),
                                              })
                                        }
                                    />
                                </div>
                             ) : (
                                <div className="mb-4" key={key}>
                                    <label
                                        htmlFor={key}
                                        className="block text-gray-600 font-bold mb-1"
                                    >
                                        {capitalizeFirstLetter(key)}:
                                    </label>
                                    <input
                                        id={key}
                                        className="px-4 py-2 border border-gray-300 rounded w-full"
                                        type="text"
                                        value={companyInfo[key]}
                                        onChange={(e) => handleUpdateValue(key, e.target.value)}
                                    />
                                </div>)
                            )
                        )}

                            <div className="border-t border-gray-300 mt-3"></div> {/* Hairline bottom */}
                            <div className="flex justify-center">
                                <button onClick={store} className="mt-5 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" >Save</button>
                                <button onClick={cancel} className="mt-5 ml-5 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" >Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Messages
                    const messages = {messages}


                />
            </div>
        </AuthenticatedLayout>
    );
}
// ???
