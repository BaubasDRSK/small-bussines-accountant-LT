import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Messages from '../components/messages';
import { v4 as uuidv4 } from 'uuid';
import ProductsList from "./Products";

export default function Invoice({ auth, updateRoute, invoice, updateInvoiceRoute, allProducts }) {

    const [edit, setEdit] = useState({});
    const [messages, setMessages] = useState([]);
    const [sort, setSort] = useState({sortDirection:'up', sortName:'due'});
        // [id, name, code, vat, street, city, country, zip]
    const [customer, setCustomer] = useState(invoice.customer ?? []);
    // [recodrID ,id, code, name, description, price, quantity, total]
    const [products, setProducts] = useState(invoice.products ?? []);



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

    return (
         <AuthenticatedLayout
             user={auth.user}
             header={
                 <div className='flex justify-between'>
                     <h2 className=" flex-1 text-2xl leading-tight font-bold text-blue-500 dark:bg-gray-800 w-auto">
                         Invoice {invoice.invoice_number} details
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
                             value={invoice.notes  }
                             onChange={(event) => { setCompanyNotes(event.target.value); }}
                             id="note" rows="8" />
                     </div>
                 </div>
                 <ProductsList
                     products = {products}
                     setProducts={setProducts}
                     allProducts = {allProducts}
                    //  addMessage = {addMessage}
                 />
                 <div className="max-w-7xl mx-auto mt-3 py-4 sm:px-6 lg:px-8 flex flex-wrap justify-items-center bg-gray-100 justify-end">
                    <button className="bg-red-500 text-white hover:bg-red-600 mr-4 hover:text-white px-4 py-2 rounded-md flex items-center"
                        onClick={() => {
                            const newID = products.reduce((largest, current) => {
                                const itemId = current[0];
                                return itemId > largest ? itemId : largest;
                            }, 0);
                            setProducts([...products, [newID+1, '', '', '', '', '', '', '']]);
                        }}
                    >
                        Cancel
                    </button>
                    <button className="bg-green-500 text-white hover:bg-green-600 hover:text-white px-4 py-2 rounded-md flex items-center"
                        onClick={() => {
                            const newID = products.reduce((largest, current) => {
                                const itemId = current[0];
                                return itemId > largest ? itemId : largest;
                            }, 0);
                            setProducts([...products, [newID+1, '', '', '', '', '', '', '']]);
                        }}
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
