

export default function SideBar() {
    return (
        <div className="bg-black/5 h-sc text-black w-6xs h-[100vh] p-4 flex flex-col rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-white pt-10" >Conversations</h2>
            <ul className="space-y-2">
                <li>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                        New Conversation
                    </button>
                </li>
            </ul>
        </div>
    );
}
