import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Messages from '../components/messages';
import { v4 as uuidv4 } from 'uuid';
import ProductsList from "./Products";
import Select from 'react-select';
import Datepicker from "react-tailwindcss-datepicker";

export default function Invoice({ auth, updateRoute, invoice, updateInvoiceRoute, allProducts, allCustomers, storeRoute }) {

    const [thisInvoice, setThisInvoice] = useState(invoice ?? null);
    const [invoiceDate, setInvoiceDate] = useState({
        startDate: new Date(invoice.invoice_date) ?? new Date('today'),
        endDate: new Date(invoice.invoice_date) ?? new Date('today')
    });

    const [invoiceDueDate, setInvoiceDueDate] = useState({
        startDate: new Date(invoice.invoice_due_date) ?? new Date('today'),
        endDate: new Date(invoice.invoice_due_date) ?? new Date('today')
    });
    const [invoiceNotes, setInvoiceNotes] = useState(invoice.notes ?? '');
    const [paid, setPaid] = useState(invoice.paid) ?? false;
    const [invoiceTotal, setInvoiceTotal] = useState(invoice.total ?? 0);

    const [edit, setEdit] = useState({});
    const [messages, setMessages] = useState([]);
    const [sort, setSort] = useState({ sortDirection: 'up', sortName: 'due' });
    // [id, name, code, vat, street, city, country, zip]
    const [customer, setCustomer] = useState(invoice.customer ?? []);
    // [recodrID ,id, code, name, description, price, quantity, total]
    const [products, setProducts] = useState(invoice.products ?? []);

    const customersOptions = allCustomers.map(customer => {
        return ({ value: customer.id, label: customer.name })
    });

    const handleCustomerChange = (customerID) => {
        const thisCustomer = allCustomers.filter(customer => customer.id === customerID);
        const newCustomer = [];
        newCustomer[0] = thisCustomer[0]['id'];
        newCustomer[1] = thisCustomer[0]['name'];
        newCustomer[2] = thisCustomer[0]['code'];
        newCustomer[3] = thisCustomer[0]['vat_code'];
        newCustomer[4] = thisCustomer[0]['street'];
        newCustomer[5] = thisCustomer[0]['city'];
        newCustomer[6] = thisCustomer[0]['country'];
        newCustomer[7] = thisCustomer[0]['zip'];
        setCustomer([...newCustomer]);
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

    const handleInvoiceDateChange = (date) => {
        setInvoiceDate(date);
    };

    const handleInvoiceDueDateChange = (date) => {
        setInvoiceDueDate(date);
    };

    const handelSaveInvoice = () => {

        //['invoice_number', 'name', 'customer_id', 'customer', 'products', 'total', 'invoice_date', 'invoice_due_date', 'paid', 'notes']

        const fullInvoice = thisInvoice;
        fullInvoice['invoice_date'] = invoiceDate['startDate'];
        fullInvoice['invoice_due_date'] = invoiceDueDate['startDate'];
        fullInvoice['notes'] = invoiceNotes;
        fullInvoice['paid'] = paid ? true : false;
        fullInvoice['customer_id'] = customer[0];
        fullInvoice['customer'] = customer;
        fullInvoice['products'] = products;
        fullInvoice['total'] = invoiceTotal;
        console.log(fullInvoice);


       axios.post(updateInvoiceRoute, { fullInvoice })
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
    };

    const handelStoreInvoice = () => {
        console.log(thisInvoice, "Invoice");
        console.log(invoiceDate, " Date");
        console.log(invoiceDueDate, " Date");
        console.log(paid, 'paid');
        console.log(customer, 'customer');
        console.log(products, 'producst');
        console.log(invoiceNotes, 'invoiceNotes');
         //['invoice_number', 'name', 'customer_id', 'customer', 'products', 'total', 'invoice_date', 'invoice_due_date', 'paid', 'notes']

         const fullInvoice = thisInvoice;
         fullInvoice['invoice_date'] = invoiceDate['startDate'];
         fullInvoice['invoice_due_date'] = invoiceDueDate['startDate'];
         fullInvoice['notes'] = invoiceNotes;
         fullInvoice['paid'] = paid ? true : false;
         fullInvoice['customer'] = customer;
         fullInvoice['products'] = products;
         fullInvoice['total'] = invoiceTotal;
         console.log(fullInvoice);


        axios.post(storeRoute, { fullInvoice })
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
     };



    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className='flex justify-between'>
                    <h2 className=" flex-1 text-2xl leading-tight font-bold text-blue-500 dark:bg-gray-800 w-auto">
                        Invoice {thisInvoice.invoice_number} details
                    </h2>
                    <button className=" w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
                        <a href={route('customers-create')}>Add new client</a>
                    </button>
                </div>
            }
        >
            <Head title="Client Info" />
            <div className="py-12 ">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-wrap justify-items-center bg-gray-200 pt-5 ">
                    <div className="w-full flex gap-6 flex-wrap px-5 mt-4">
                        <div className='w-full md:w-1/3 flex items-center '>
                            <h2 className="mb-1 text-lg font-bold text-blue-600"> Invoice paid: </h2>
                            <input type="checkbox" className='w-5 h-5 ml-2'
                                    onChange = {() => setPaid(()=> {
                                        const newstatus = paid ? 0 : 1;
                                        return newstatus;
                                    })}
                                    id="paidStatus" name="paidStatus"  checked={paid === 1 ? true : false} />
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-wrap justify-items-center bg-gray-200 pt-5 ">
                    <div className="w-full max-w-[400px] px-5">
                        <h2 className="mb-1 text-lg font-bold text-blue-600">Select customer for invoice:</h2>
                        <Select
                            options={customersOptions}
                            value={{ value: customer[0], label: customer[1] }}
                            onChange={(selectedOption) => handleCustomerChange(selectedOption.value)}
                        />
                    </div>
                </div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-wrap justify-items-center bg-gray-200 pt-5 ">
                    <div className="w-full flex gap-6 flex-wrap px-5">
                            <div className='w-full md:w-1/3'>
                                <h2 className="mb-1 text-lg font-bold text-blue-600"> Invoice Date: </h2>
                                <Datepicker
                                    inputClassName="w-full rounded-md  font-normal "
                                    containerClassName=""
                                    asSingle={true}
                                    value={invoiceDate}
                                    onChange={handleInvoiceDateChange}
                                />
                            </div>
                            <div className='w-full md:w-1/3'>
                                <h2 className="mb-1 text-lg font-bold text-blue-600">Invoice Due Date:</h2>
                                <Datepicker
                                    inputClassName="w-full rounded-md  font-normal "
                                    containerClassName=""
                                    asSingle={true}
                                    value={invoiceDueDate}
                                    onChange={handleInvoiceDueDateChange}
                                />
                            </div>
                        </div>
                </div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-wrap justify-items-center bg-gray-200">
                    <div className="flex-1 min-w-[300px] w-full md:w-1/2 bg-gray-200 p-6">

                        <h2 className="mb-4 text-lg font-bold text-blue-600">Customer details</h2>

                        <div className="flex justify-between items-center w-full">
                            <span className="py-2 text-gray-500 text-sm self-center mr-4 w-3/12">{"Company name:"}</span>
                            {edit.name ? (
                                <>
                                    <input className="py-0 px-2 w-8/12 m-0" type="text" value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <svg onClick={() => { setEdit({ ...edit, 'name': 0 }); updateField(); }} className=" w-1/12 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </>
                            ) : (
                                <>
                                    <p className="my-1 py-0 px-2 w-8/12">{customer[1]}</p>
                                    <svg onClick={() => { setEdit({ ...edit, 'name': 1 }) }}
                                        className=" w-1/12 h-4  inline-block text-blue-500 hover:text-orange-400"
                                        width="12" height="12" viewBox="0 0 24 24"
                                        xmlns="http:www.w3.org/2000/svg"
                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </>
                            )}
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <span className="py-2 text-gray-500 text-sm self-center mr-4 w-3/12">{"Company code:"}</span>
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
                                    <p className="my-1 py-0 px-2 w-8/12">{customer[2]}</p>
                                    <svg className=" inline-block w-1/12 h-4 text-blue-500 hover:text-orange-400" onClick={() => { setEdit({ ...edit, 'nickname': 1 }); console.log(edit) }} width="12" height="12" viewBox="0 0 24 24" xmlns="http:www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </>
                            )}
                        </div>

                        <div className="flex justify-between items-center w-full">
                            <span className="py-2 text-gray-500 text-sm self-center mr-4 w-3/12">{"VAT code:"}</span>
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
                                    <p className="my-1 py-0 px-2 w-8/12">{customer[3]}</p>
                                    <svg className=" inline-block w-1/12 h-4 text-blue-500 hover:text-orange-400" onClick={() => { setEdit({ ...edit, 'code': 1 }) }} width="12" height="12" viewBox="0 0 24 24" xmlns="http:www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </>
                            )}
                        </div>
                    </div>


                    <div className="flex-1 md:flex-none justify-self-center min-w-[300px] md:w-1/2 bg-gray-200 p-6">
                        <h2 className="mb-4 text-lg font-bold text-blue-600">Adress:</h2>

                        <div className="flex justify-between items-center w-full">
                            <span className="py-2 text-gray-500 text-sm self-center mr-4 w-3/12">{"Street (house, flat):"}</span>
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
                                    <p className="my-1 py-0 px-2 w-8/12">{customer[4]}</p>
                                    <svg className=" inline-block w-1/12 h-4 text-blue-500 hover:text-orange-400" onClick={() => { setEdit({ ...edit, 'cname': 1 }) }} width="12" height="12" viewBox="0 0 24 24" xmlns="http:www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </>
                            )}
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <span className="py-2 text-gray-500 text-sm self-center mr-4 w-3/12">{"City:"}</span>
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
                                    <p className="my-1 py-0 px-2 w-8/12">{customer[5]}</p>
                                    <svg className=" inline-block w-1/12 h-4 text-blue-500 hover:text-orange-400" onClick={() => { setEdit({ ...edit, 'cname': 1 }) }} width="12" height="12" viewBox="0 0 24 24" xmlns="http:www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </>
                            )}
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <span className="py-2 text-gray-500 text-sm self-center mr-4 w-3/12">{"Country:"}</span>
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
                                    <p className="my-1 py-0 px-2 w-8/12">{customer[6]}</p>
                                    <svg className=" inline-block w-1/12 h-4 text-blue-500 hover:text-orange-400" onClick={() => { setEdit({ ...edit, 'cname': 1 }) }} width="12" height="12" viewBox="0 0 24 24" xmlns="http:www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </>
                            )}
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <span className="py-2 text-gray-500 text-sm self-center mr-4 w-3/12">{"ZIP:"}</span>
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
                                    <p className="my-1 py-0 px-2 w-8/12">{customer[7]}</p>
                                    <svg className=" inline-block w-1/12 h-4 text-blue-500 hover:text-orange-400" onClick={() => { setEdit({ ...edit, 'cname': 1 }) }} width="12" height="12" viewBox="0 0 24 24" xmlns="http:www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </>
                            )}
                        </div>


                    </div>
                    <div className=" px-6 w-full">
                        <h2 className="mb-4 text-lg font-bold text-blue-600">Notes:</h2>
                        <label className="text-gray-500 text-sm " htmlFor="note">Invoice Notes:</label>
                        <textarea className="w-full resize-none rounded-md"
                            //onBlur={() => { setEdit({ ...edit, 'cemail': 0 }); updateField() }}
                            value={invoiceNotes}
                            onChange={(event) => { setInvoiceNotes(event.target.value); }}
                            id="note" rows="8" />
                    </div>
                </div>
                <ProductsList
                    products={products}
                    setProducts={setProducts}
                    allProducts={allProducts}
                    invoiceTotal = {invoiceTotal}
                    setInvoiceTotal = {setInvoiceTotal}
                //  addMessage = {addMessage}
                />
                <div className="max-w-7xl mx-auto mt-3 py-4 sm:px-6 lg:px-8 flex flex-wrap justify-items-center bg-gray-100 justify-end">
                    <button className="bg-red-500 text-white hover:bg-red-600 mr-4 hover:text-white px-4 py-2 rounded-md flex items-center"
                        onClick={() => {
                            window.location.href = '/invoices';
                        }}
                    >
                        Cancel
                    </button>
                    <button className="bg-green-500 text-white hover:bg-green-600 hover:text-white px-4 py-2 rounded-md flex items-center"
                        onClick={() => thisInvoice.invoice_number === 0 ? handelStoreInvoice() : handelSaveInvoice()}
                    >
                        Save invoice
                    </button>
                </div>
            </div>

            <Messages
                const messages={messages}
            />
        </AuthenticatedLayout>
    );
}
// ???
