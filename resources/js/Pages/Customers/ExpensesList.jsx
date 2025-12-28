import { useEffect, useState } from "react";
import ModalYesCancel from '../components/modalYesCancel';
import axios from 'axios'; 

export default function ExpensesList({ expensesList, doSort, setExpensesList, sortExpenses, updateExpenseRoute, addMessage }){

    const [search, setSearch]= useState('');
    const [expensesFullList, setExpensesFullList] = useState([]); 

    const [modalStatus, setModalStatus] = useState(false);
    const [modalItem, setModalItem] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState(null); 

    useEffect(() => {
        setExpensesFullList([...expensesList]);
    }, [expensesList]);


    const handlePaidStatusChange = (e, expense) =>{
        e.stopPropagation();
        console.log("siunciam");
        expense.paid = expense.paid ? 0 : 1;
        const fullExpense = expense;
        const updatedExpensesList = expensesList.map(item => {
            if(item.id === expense.id){
                item.paid = expense.paid;
                return item;
            }
            return item;
        });

        setExpensesList(updatedExpensesList);
        axios.post(updateExpenseRoute, {fullExpense})
        .then(res => {
            if (res.status === 201) {
                addMessage(res.data.message, res.data.type);
            }
        })
        .catch(e => {
            console.error("Error updating paid status:", e);
            addMessage('Failed to update paid status.', 'error');
        });
    };


    const searchExpenses = () => {
        const searchedList = [...expensesFullList];
        const filteredList = !search.length ? [...expensesFullList] : searchedList.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

        setExpensesList(sortExpenses(filteredList));
    };

    return (
        // FIX 1: Added dark:bg-gray-900 to the main container
        <div className="max-w-7xl mx-auto mt-3 py-4 sm:px-6 lg:px-8 flex flex-wrap justify-items-center bg-white dark:bg-gray-800"> 
            <h2 className="mb-4 text-lg font-bold text-blue-600">Client purchases invoices</h2>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 cursor-pointer" onClick={()=>doSort('expense_number', 'expenses')}>
                            <p className="text-m">Expense number</p>
                            <p className="text-xs">(issue date)</p>
                        </th>
                        <th scope="col" className="px-6 py-3" >
                            <div className="relative">
                                <label htmlFor="Search" className="sr-only"> Search </label>

                                <input
                                    type="text"
                                    id="Search"
                                    placeholder="Expense name"
                                    className="w-full rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm"
                                    value = {search}
                                    onChange = {(e)=> setSearch(e.target.value)}
                                    onKeyDown = {(e) => {
                                        if (e.key === 'Enter') {
                                            searchExpenses();
                                        }
                                    }}
                                />

                                <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
                                    <button type="button" className="text-gray-600 hover:text-gray-700"
                                        onClick = {() => searchExpenses()}
                                        >
                                    <span className="sr-only">Search</span>

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                        />
                                    </svg>
                                    </button>
                                </span>
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3 cursor-pointer" onClick={()=>doSort('total', 'expenses')}>
                            Total
                        </th>
                        <th scope="col" className="px-6 py-3 cursor-pointer" onClick={()=>doSort('paid', 'expenses')}>
                            Paid
                        </th>
                        <th scope="col" className="px-6 py-3 cursor-pointer"onClick={()=>doSort('due', 'expenses')}>
                            Due
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {expensesList.length ? (expensesList.map((item) => {
                        const today = new Date();
                        const yesterday = new Date(today);
                        yesterday.setDate(today.getDate() - 1);
                        const expenseDue = new Date(item.expense_due_date);
                        let textColor = item.paid ? "text-green-700" : "text-gray-700";
                        const isOverDue = expenseDue < yesterday && !item.paid;
                        textColor = isOverDue ? "text-red-500" : textColor;

                        const handleRowClick = (e) => {
                            e.stopPropagation();
                            window.location.href = '/expenses/show/'+item.id
                        };

                        return (
                            <tr key={item.expense_number} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer"
                                    onClick={handleRowClick}
                                >
                                    <p className="text-m">{item.expense_number}</p>
                                    <p className="text-xs">{item.expense_date}</p>
                                </td>
                                <td className="px-6 py-4 cursor-pointer"
                                    onClick={handleRowClick}
                                >
                                    {item.name}
                                </td>
                                <td className={`px-6 py-4 cursor-pointer ${textColor}`}
                                    onClick={handleRowClick}
                                >
                                    {(item.total/100).toFixed(2)}{" €"}
                                </td>
                                <td className={`px-6 py-4 ${textColor}`}>
                                    <input type="checkbox"
                                        onChange = {(e) => {
                                            setModalStatus(true);
                                            setModalItem(item);
                                            setModalTitle('Check again!');
                                            setModalAction(() => [handlePaidStatusChange, e]); 
                                            setModalMessage(`Are You sure you want to change paid status for expense ${item.expense_number}`);
                                        }}
                                        id="paidStatus" name="paidStatus" 
                                        checked={item.paid === 1 ? true : false} 
                                    />
                                </td>
                                <td className={`px-6 py-4 cursor-pointer ${textColor}`}
                                    onClick={handleRowClick}
                                >
                                    {item.expense_due_date}
                                </td>
                            </tr>
                        )
                    })) : (
                        <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-gray-300">No expenses</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <ModalYesCancel
                modalItem = {modalItem}
                modalStatus = {modalStatus}
                setModalStatus={setModalStatus}
                modalTitle = {modalTitle}
                modalMessage = {modalMessage}
                modalAction = {modalAction}
                >
            </ModalYesCancel>
        </div>

    )
}