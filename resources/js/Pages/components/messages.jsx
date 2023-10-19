
export default function Messages({ messages }){
    return (
        <div className="flex flex-col gap-1" style={{position: 'fixed', top: '50px', left: '0px'}}>
                {
                    messages.map(message =>
                        <div key={message.uuid} className={`m-1 ml-2 p-4 rounded text-xl
                                                            ${message.type === 'success' && 'bg-green-500'}
                                                            ${message.type === 'warning' && 'bg-orange-500'}
                                                            ${message.type === 'danger' && 'bg-red-500'}`} >
                            {message.text}
                        </div>
                    )
                }
            </div>
    )
}
