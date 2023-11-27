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
    const [validations, setValidations] = useState({});

    const handleUpdateValue = (key, newValue) => {
        setComp({
            ...companyInfo,
            [key]: newValue,
        });
    };

    const handleValidation = (key, value) => {
        console.log(key);
        if (key === 'name'){ nameValidation(value)};
        if (key === 'code'){ codeValidation(value)};
        if (key === 'vatcode'){ vatcodeValidation(value)};
        if (key === 'street'){ streetValidation(value)};
        if (key === 'city'){ cityValidation(value)};
        if (key === 'country'){ countryValidation(value)};
    };

    // validations

    const nameValidation = (value) => {
        setValidations((prevValidations) => ({
            ...prevValidations,
            ['name']: [],
        }));
        value.length === 0 ? setValidations((prevValidations) => ({ ...prevValidations, ['name']: [...prevValidations['name'], "Field is required"], })) : null;
        /\d/.test(value.trim()) ? setValidations((prevValidations) => ({ ...prevValidations, ['name']: ["No numbers allowed"], })) : null;
        /^[a-zA-Z0-9-\s]*$/.test(value.trim()) ? null : setValidations((prevValidations) => ({ ...prevValidations, ['name']: [...prevValidations['name'], "No special characters allowed"], }));
    }

    const codeValidation = (value) => {
        setValidations((prevValidations) => ({
            ...prevValidations,
            ['code']: [],
        }));
        value.length === 0 ? setValidations((prevValidations) => ({ ...prevValidations, ['code']: [...prevValidations['code'], "Field is required"], })) : null;
        /[a-zA-Z]/.test(value.trim()) ? setValidations((prevValidations) => ({ ...prevValidations, ['code']: ["Code must be only numbers"], })) : null;
        /^[a-zA-Z0-9]*$/.test(value.trim()) ? null : setValidations((prevValidations) => ({ ...prevValidations, ['code']: [...prevValidations['code'], "No special characters allowed"], }));
    }

    const vatcodeValidation = (value) => {
        setValidations((prevValidations) => ({
            ...prevValidations,
            ['vatcode']: [],
        }));
        value.length === 0 ? setValidations((prevValidations) => ({ ...prevValidations, ['vatcode']: ["Field is required"], })) : null;
        (/^(LT\d{9}(?:\d{3})?|-)$/.test(value.trim())) ? null : setValidations((prevValidations) => ({ ...prevValidations, ['vatcode']: [...prevValidations['vatcode'],"Check your VAT code"], }));
        }

    const streetValidation = (value) => {
        setValidations((prevValidations) => ({
            ...prevValidations,
            ['street']: [],
        }));
        value.length === 0 ? setValidations((prevValidations) => ({ ...prevValidations, ['street']: ["Field is required"], })) : null;
        (/^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\d.\s-]{2,}$/.test(value.trim())) ? null : setValidations((prevValidations) => ({ ...prevValidations, ['street']: [...prevValidations['street'],"Check info again"], }));
        }

    const cityValidation = (value) => {
        setValidations((prevValidations) => ({
            ...prevValidations,
            ['city']: [],
        }));
        value.length === 0 ? setValidations((prevValidations) => ({ ...prevValidations, ['city']: ["Field is required"], })) : null;
        (/^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s-]{2,}$/.test(value.trim())) ? null : setValidations((prevValidations) => ({ ...prevValidations, ['city']: [...prevValidations['city'],"Check info again"], }));
        }

    const countryValidation = (value) => {
        setValidations((prevValidations) => ({
            ...prevValidations,
            ['country']: [],
        }));
        value.length === 0 ? setValidations((prevValidations) => ({ ...prevValidations, ['country']: ["Field is required"], })) : null;
        (/^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s-]{2,}$/.test(value.trim())) ? null : setValidations((prevValidations) => ({ ...prevValidations, ['country']: [...prevValidations['country'],"Check info again"], }));
        }


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
        }, 1500);
        // success warning danger
    }

    const store = () => {
        console.log('Store');

        axios.post(storeUrl, companyInfo)
            .then(res => {
                if (res.status === 201) {
                    setCompanyInfoServer({ ...companyInfo })
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
        window.location.href = '/customers';
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
            <div className="py-12 ">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-2xl font-bold text-blue-500 w-auto mx-auto text-center">
                            Settings of your company
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-gray-900 sm:w-full md:w-10/12 lg:w-1/2 mx-auto">
                            <h3 className="text-xl font-bold text-blue-500 bg-gray-100 pl-5 pr-5 rounded-t">
                                Company details:
                            </h3>
                            <div className="border-t border-gray-300 mb-3"></div> {/* Hairline top */}
                            {companyInfoKeys.map((key) => (

                                <div className="mb-4" key={key}>
                                    {key === 'street' ? (<div>
                                        <div className="border-t border-gray-300 mb-3"></div> {/* Hairline top */}
                                        <h3 className="text-xl font-bold text-blue-500 bg-gray-100 pl-5 pr-5 rounded-t">
                                            Address details:
                                        </h3>
                                        <div className="border-t border-gray-300 mb-3"></div> {/* Hairline top */}
                                    </div>) : (null)}
                                    {key === 'phone' ? (<div>
                                        <div className="border-t border-gray-300 mb-3"></div> {/* Hairline top */}
                                        <h3 className="text-xl font-bold text-blue-500 bg-gray-100 pl-5 pr-5 rounded-t">
                                            Contact details:
                                        </h3>
                                        <div className="border-t border-gray-300 mb-3"></div> {/* Hairline top */}
                                    </div>) : (null)}
                                    {key === 'bank' ? (<div>
                                        <div className="border-t border-gray-300 mb-3"></div> {/* Hairline top */}
                                        <h3 className="text-xl font-bold text-blue-500 bg-gray-100 pl-5 pr-5 rounded-t">
                                            Bank details:
                                        </h3>
                                        <div className="border-t border-gray-300 mb-3"></div> {/* Hairline top */}
                                    </div>) : (null)}
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
                                        onChange={(e) => {
                                            handleUpdateValue(key, e.target.value); //str.trim();
                                            handleValidation(key, e.target.value);
                                        }}
                                    />
                                      {/* validation alert */}
                                      {/* {validations[key] ?? []} */}
                                      {validations[key] ? (<div>
                                        {validations[key].length === 0 ?
                                            (
                                                <div role="alert" className="rounded border-s-4 border-green-500 bg-green-50 p-4 mt-2">
                                                    {/* <strong className="block font-medium text-green-800"> Check value again: </strong> */}


                                                        <p className="mt-2 text-sm text-green-700">
                                                            Field info is correct
                                                        </p>

                                                </div>
                                            ) : (
                                                <div role="alert" className="rounded border-s-4 border-red-500 bg-red-50 p-4 mt-2">
                                                    {/* <strong className="block font-medium text-red-800"> Check value again: </strong> */}

                                                    {validations[key].map((msg) => (
                                                        <p key={msg} className="mt-2 text-sm text-red-700">
                                                            {msg}
                                                        </p>
                                                    ))}
                                                </div>
                                            )

                                        }

                                    </div>) : (null)}
                                    {/* validation alrt end */}
                                </div>

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
                    const messages={messages}


                />
            </div>
        </AuthenticatedLayout>
    );
}
// ???
