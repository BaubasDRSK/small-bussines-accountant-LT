import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Messages from '../components/messages';
import { v4 as uuidv4 } from 'uuid';
import InvoicesList from "./InvoiceList";

export default function Settings({ auth, updateRoute, customer, invoices }) {

    const [edit, setEdit] = useState({});
    const [messages, setMessages] = useState([]);
    const [sort, setSort] = useState({sortDirection:'up', sortName:'due'});

    const [name, setName] = useState(customer.name);
    const [nickname, setNickname] = useState(customer.nickname);
    const [code, setCode] = useState(customer.code);
    const [vat_code, setVatCode] = useState(customer.vat_code);
    const [website, setWebsite] = useState(customer.website);

    const [street, setStreet] = useState(customer.street);
    const [city, setCity] = useState(customer.city);
    const [zip, setZip] = useState(customer.zip);
    const [country, setCountry] = useState(customer.country);

    const [cname, setCname] = useState(customer.contact_name);
    const [cphone, setCphone] = useState(customer.contact_phone);
    const [cemail, setCemail] = useState(customer.contact_email);

    const [company_notes, setCompanyNotes] = useState(customer.notes);

    const [invoicesList, setInvoicesList] = useState(invoices);

    //use efdetc for sort
    useEffect(()=>{
        sortInvoices();
    },[sort]);

    const  sortInvoices = (invoices) => {
        console.log(sort);
        invoices = invoices ?? invoicesList;
        invoices.forEach((item) => {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            const invoiceDue = new Date(item.invoice_due_date);
            const maxDueDays = 1000;
            const due = !item.paid ? (invoiceDue - today)/ (1000 * 60 * 60 * 24) : maxDueDays;
            item.due = due;
        });
        const sortedList = [...invoices];
        if (sort.sortDirection == 'up'){
            sortedList.sort((a,b)=>a[sort.sortName]- b[sort.sortName]);
        } else {
            sortedList.sort((a,b)=>b[sort.sortName]- a[sort.sortName]);
        }

        setInvoicesList([...sortedList]);
    };


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

    const updateField = () => {
        console.log('letsupdate');
        const updatedFields = {
            'name': name,
            'nickname': nickname,
            'code': code,
            'vat_code': vat_code,
            'website': website,
            'street': street,
            'city': city,
            'zip': zip,
            'country': country,
            'contact_name': cname,
            'contact_phone': cphone,
            'contact_email': cemail,
            'notes': company_notes,
        }

        axios.post(updateRoute, { updatedFields })
            .then(res => {
                if (res.status === 201) {
                    console.log('aaaa');
                    addMessage(res.data.message, res.data.type);

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

    const doSort = n => {
        setSort(s => {
          switch (s.sortDirection) {
              case 'down': return {sortDirection:'up', sortName:n};
              case 'up': return {sortDirection:'down', sortName:n};
            //   default: return {sortDirection:'default', sortName:n};
          }
        });
      }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className='flex justify-between'>
                    <h2 className=" flex-1 text-2xl leading-tight font-bold text-blue-500 dark:bg-gray-800 w-auto">
                        Client details
                    </h2>
                    <button className=" w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
                        <a href={route('customers-create')}>Add new client</a>
                    </button>
                </div>
            }
        >
            <Head title="Client Info" />
            <div className="py-12 ">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-wrap justify-items-center bg-gray-200">

                    <div className="flex-1 min-w-[300px] w-full md:w-1/3 bg-gray-200 p-6">
                        <h2 className="mb-4 text-lg font-bold text-blue-600">Customer details</h2>

                        <div className="flex justify-between items-center w-full">
                            <span className="py-2 text-gray-500 text-sm self-center mr-4 w-3/12">{"Client name:"}</span>
                            {edit.name ? (
                                <>
                                    <input className="py-0 px-2 w-8/12 m-0" type="text" value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <svg onClick={() => { setEdit({ ...edit, 'name': 0 }); updateField(); }} className=" w-1/12 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </>
                            ) : (
                                <>
                                    <p className="my-1 py-0 px-2 w-8/12">{name}</p>
                                    <svg onClick={() => { setEdit({ ...edit, 'name': 1 }) }}
                                        className=" w-1/12 h-4  inline-block text-blue-500 hover:text-orange-400"
                                        width="12" height="12" viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </>
                            )}
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <span className="py-2 text-gray-500 text-sm self-center mr-4 w-3/12">{"Nickname:"}</span>
                            {edit.nickname ? (
                                <>
                                    <input
                                        className="py-0 px-2 w-8/12 m-0"
                                        type="text"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                    />
                                    <svg onClick={() => { setEdit({ ...edit, 'nickname': 0 }); updateField() }} className="h-8 w-1/12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </>
                            ) : (
                                <>
                                    <p className="my-1 py-0 px-2 w-8/12">{nickname}</p>
                                    <svg className=" inline-block w-1/12 h-4 text-blue-500 hover:text-orange-400" onClick={() => { setEdit({ ...edit, 'nickname': 1 }); console.log(edit) }} width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </>
                            )}
                        </div>

                        <div className="flex justify-between items-center w-full">
                            <span className="py-2 text-gray-500 text-sm self-center mr-4 w-3/12">{"Compnay code:"}</span>
                            {edit.code ? (
                                <>
                                    <input
                                        className="py-0 px-2 w-8/12 m-0"
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                    />
                                    <svg onClick={() => { setEdit({ ...edit, 'code': 0 }); updateField() }} className="h-8 w-1/12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </>
                            ) : (
                                <>
                                    <p className="my-1 py-0 px-2 w-8/12">{code}</p>
                                    <svg className=" inline-block w-1/12 h-4 text-blue-500 hover:text-orange-400" onClick={() => { setEdit({ ...edit, 'code': 1 }) }} width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </>
                            )}
                        </div>

                        <div className="flex justify-between items-center w-full">
                            <span className="py-2 text-gray-500 text-sm self-center mr-4 w-3/12">{"VAT code:"}</span>
                            {edit.vat_code ? (
                                <>
                                    <input
                                        className="py-0 px-2 w-8/12 m-0"
                                        type="text"
                                        value={vat_code}
                                        onChange={(e) => setVatCode(e.target.value)}
                                    />
                                    <svg onClick={() => { setEdit({ ...edit, 'vat_code': 0 }); updateField() }} className="h-8 w-1/12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </>
                            ) : (
                                <>
                                    <p className="my-1 py-0 px-2 w-8/12">{vat_code}</p>
                                    <svg className=" inline-block w-1/12 h-4 text-blue-500 hover:text-orange-400" onClick={() => { setEdit({ ...edit, 'vat_code': 1 }) }} width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </>
                            )}
                        </div>

                        <div className="flex justify-between items-center w-full">
                            <span className="py-2 text-gray-500 text-sm self-center mr-4 w-3/12">{"Website:"}</span>
                            {edit.website ? (
                                <>
                                    <input
                                        className="py-0 px-2 w-8/12 m-0"
                                        type="text"
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                    />
                                    <svg onClick={() => { setEdit({ ...edit, 'website': 0 }); updateField() }} className="h-8 w-1/12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </>
                            ) : (
                                <>
                                    <p className="my-1 py-0 px-2 w-8/12">{website}</p>
                                    <svg className=" inline-block w-1/12 h-4 text-blue-500 hover:text-orange-400" onClick={() => { setEdit({ ...edit, 'website': 1 }) }} width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </>
                            )}
                        </div>

                    </div>

                    <div className="flex-1  min-w-[300px] w-full md:w-1/3 bg-gray-200 p-6">
                        <h2 className="mb-4 text-lg font-bold text-blue-600">Address details</h2>

                        <div className="flex justify-between items-center w-full">
                            <span className="py-2 text-gray-500 text-sm self-center mr-4 w-3/12">{"Address:"}</span>
                            {edit.street ? (
                                <>
                                    <input
                                        className="py-0 px-2 w-8/12 m-0"
                                        type="text"
                                        value={street}
                                        onChange={(e) => setStreet(e.target.value)}
                                    />
                                    <svg onClick={() => { setEdit({ ...edit, 'street': 0 }); updateField() }} className="h-8 w-1/12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </>
                            ) : (
                                <>
                                    <p className="my-1 py-0 px-2 w-8/12">{street}</p>
                                    <svg className=" inline-block w-1/12 h-4 text-blue-500 hover:text-orange-400" onClick={() => { setEdit({ ...edit, 'street': 1 }) }} width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </>
                            )}
                        </div>

                        <div className="flex justify-between items-center w-full">
                            <span className="py-2 text-gray-500 text-sm self-center mr-4 w-3/12">{"City:"}</span>
                            {edit.city ? (
                                <>
                                    <input
                                        className="py-0 px-2 w-8/12 m-0"
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                    <svg onClick={() => { setEdit({ ...edit, 'city': 0 }); updateField() }} className="h-8 w-1/12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </>
                            ) : (
                                <>
                                    <p className="my-1 py-0 px-2 w-8/12">{city}</p>
                                    <svg className=" inline-block w-1/12 h-4 text-blue-500 hover:text-orange-400" onClick={() => { setEdit({ ...edit, 'city': 1 }) }} width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </>
                            )}
                        </div>

                        <div className="flex justify-between items-center w-full">
                            <span className="py-2 text-gray-500 text-sm self-center mr-4 w-3/12">{"Country:"}</span>
                            {edit.country ? (
                                <>
                                    <input
                                        className="py-0 px-2 w-8/12 m-0"
                                        type="text"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                    />
                                    <svg onClick={() => { setEdit({ ...edit, 'country': 0 }); updateField() }} className="h-8 w-1/12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </>
                            ) : (
                                <>
                                    <p className="my-1 py-0 px-2 w-8/12">{country}</p>
                                    <svg className=" inline-block w-1/12 h-4 text-blue-500 hover:text-orange-400" onClick={() => { setEdit({ ...edit, 'country': 1 }) }} width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </>
                            )}
                        </div>

                        <div className="flex justify-between items-center w-full">
                            <span className="py-2 text-gray-500 text-sm self-center mr-4 w-3/12">{"ZIP:"}</span>
                            {edit.zip ? (
                                <>
                                    <input
                                        className="py-0 px-2 w-8/12 m-0"
                                        type="text"
                                        value={zip}
                                        onChange={(e) => setZip(e.target.value)}
                                    />
                                    <svg onClick={() => { setEdit({ ...edit, 'zip': 0 }); updateField() }} className="h-8 w-1/12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </>
                            ) : (
                                <>
                                    <p className="my-1 py-0 px-2 w-8/12">{zip}</p>
                                    <svg className=" inline-block w-1/12 h-4 text-blue-500 hover:text-orange-400" onClick={() => { setEdit({ ...edit, 'zip': 1 }) }} width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </>
                            )}
                        </div>



                    </div>

                    <div className="flex-1 md:flex-none justify-self-center min-w-[300px] md:w-1/3 bg-gray-200 p-6">
                        <h2 className="mb-4 text-lg font-bold text-blue-600">Primary contat:</h2>

                        <div className="flex justify-between items-center w-full">
                            <span className="py-2 text-gray-500 text-sm self-center mr-4 w-3/12">{"Name:"}</span>
                            {edit.cname ? (
                                <>
                                    <input
                                        className="py-0 px-2 w-8/12 m-0"
                                        type="text"
                                        value={cname}
                                        onChange={(e) => setCname(e.target.value)}
                                    />
                                    <svg onClick={() => { setEdit({ ...edit, 'cname': 0 }); updateField() }} className="h-8 w-1/12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </>
                            ) : (
                                <>
                                    <p className="my-1 py-0 px-2 w-8/12">{cname}</p>
                                    <svg className=" inline-block w-1/12 h-4 text-blue-500 hover:text-orange-400" onClick={() => { setEdit({ ...edit, 'cname': 1 }) }} width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </>
                            )}
                        </div>

                        <div className="flex justify-between items-center w-full">
                            <span className="py-2 text-gray-500 text-sm self-center mr-4 w-3/12">{"Phone:"}</span>
                            {edit.cphone ? (
                                <>
                                    <input
                                        className="py-0 px-2 w-8/12 m-0"
                                        type="text"
                                        value={cphone}
                                        onChange={(e) => setCphone(e.target.value)}
                                    />
                                    <svg onClick={() => { setEdit({ ...edit, 'cphone': 0 }); updateField() }} className="h-8 w-1/12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </>
                            ) : (
                                <>
                                    <p className="my-1 py-0 px-2 w-8/12">{cphone}</p>
                                    <svg className=" inline-block w-1/12 h-4 text-blue-500 hover:text-orange-400" onClick={() => { setEdit({ ...edit, 'cphone': 1 }) }} width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </>
                            )}
                        </div>

                        <div className="flex justify-between items-center w-full">
                            <span className="py-2 text-gray-500 text-sm self-center mr-4 w-3/12">{"Email:"}</span>
                            {edit.cemail ? (
                                <>
                                    <input
                                        className="py-0 px-2 w-8/12 m-0"
                                        type="text"
                                        value={cemail}
                                        onChange={(e) => setCemail(e.target.value)}
                                    />
                                    <svg onClick={() => { setEdit({ ...edit, 'cemail': 0 }); updateField() }} className="h-8 w-1/12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </>
                            ) : (
                                <>
                                    <p className="my-1 py-0 px-2 w-8/12">{cemail}</p>
                                    <svg className=" inline-block w-1/12 h-4 text-blue-500 hover:text-orange-400" onClick={() => { setEdit({ ...edit, 'cemail': 1 }) }} width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </>
                            )}
                        </div>
                    </div>
                    <div className=" px-6 w-full">
                        <h2 className="mb-4 text-lg font-bold text-blue-600">Notes:</h2>
                        <label className="text-gray-500 text-sm " htmlFor="note">Notes about this customer:</label>
                        <textarea className="w-full resize-none rounded-md"
                            onBlur={() => { setEdit({ ...edit, 'cemail': 0 }); updateField() }}
                            value={company_notes}
                            onChange={(event) => { setCompanyNotes(event.target.value); }}
                            id="note" rows="8" />
                    </div>
                </div>
                {/* invoices block */}
               <InvoicesList
                    invoicesList = {invoicesList}
                    doSort = {doSort}
                    setInvoicesList = {setInvoicesList}
                    sortInvoices = {sortInvoices}

                />
            </div>

            <Messages
                const messages={messages}
            />
        </AuthenticatedLayout>
    );
}
// ???
