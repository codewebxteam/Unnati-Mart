import React, { useState, useEffect } from 'react';
import { Mail, Phone, Ban, Users, UserPlus, Star, Landmark, Filter, ChevronDown, Calendar } from 'lucide-react';
import { realtimeDb as db } from '../../firebase';
import { ref, onValue, update, push } from 'firebase/database';
import UserAvatar from '../../components/common/UserAvatar';

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [usersData, setUsersData] = useState({});
    const [ordersData, setOrdersData] = useState({});
    const [sortBy, setSortBy] = useState('Newest Customers');
    const [timeFilter, setTimeFilter] = useState('All Time');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showTimeDropdown, setShowTimeDropdown] = useState(false);
    const [isMsgModalOpen, setIsMsgModalOpen] = useState(false);
    const [msgText, setMsgText] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const handleBlockToggle = (uid) => {
        if (!uid || uid.startsWith('guest_')) {
            alert('Guest customers cannot be blocked directly.');
            return;
        }
        const isBlocked = usersData[uid]?.blocked || false;
        if (window.confirm(`Are you sure you want to ${isBlocked ? 'Unblock' : 'Block'} this customer?`)) {
            const userRef = ref(db, `users/${uid}`);
            update(userRef, { blocked: !isBlocked });
        }
    };

    const handleSendMessage = async () => {
        if (!msgText.trim() || !selectedCustomer) return;
        const uid = selectedCustomer.id;
        
        if (uid.startsWith('guest_')) {
            alert('Cannot send message to guest customer back-end records.');
            return;
        }

        try {
            const msgRef = ref(db, `users/${uid}/messages`);
            const newMsgRef = push(msgRef);
            await update(newMsgRef, {
                message: msgText,
                timestamp: new Date().toISOString(),
                sender: 'Admin',
                read: false
            });
            alert('Message sent successfully!');
            setMsgText('');
            setIsMsgModalOpen(false);
            setSelectedCustomer(null);
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message: " + error.message);
        }
    };

    useEffect(() => {
        const usersRef = ref(db, 'users');
        const ordersRef = ref(db, 'orders');

        const unsubUsers = onValue(usersRef, (snap) => {
            setUsersData(snap.val() || {});
        }, (err) => console.error("Users listener error:", err));

        const unsubOrders = onValue(ordersRef, (snap) => {
            setOrdersData(snap.val() || {});
            setIsLoading(false);
        }, (err) => console.error("Orders listener error:", err));

        return () => {
            unsubUsers();
            unsubOrders();
        };
    }, []);

    useEffect(() => {
        const customerMap = {};
        const ordersList = Object.keys(ordersData).map(key => ({
            ...ordersData[key],
            firebaseId: key
        }));

        // 1. Process from Orders
        ordersList.forEach(order => {
            const uid = order.userId || `guest_${order.firebaseId}`;
            const orderName = order.customer || order.address?.name || 'Anonymous';
            const userName = usersData[uid]?.displayName || usersData[uid]?.name;
            const orderEmail = order.email || order.address?.email;
            const userEmail = usersData[uid]?.email;
            const orderMobile = order.mobile || order.address?.mobile || '';
            const userMobile = usersData[uid]?.mobile || usersData[uid]?.phone || '';
            const contactNumber = orderMobile || userMobile || 'N/A';

            if (!customerMap[uid]) {
                customerMap[uid] = {
                    id: uid,
                    customer: orderName !== 'Anonymous' ? orderName : (userName || 'Anonymous'),
                    email: orderEmail || userEmail || 'N/A',
                    contact: contactNumber,
                    orders: 0,
                    spent: 0,
                    joined: usersData[uid]?.joinedAt ? new Date(usersData[uid].joinedAt).toLocaleDateString() : 'N/A',
                    address: order.address ? `${order.address.street}, ${order.address.locality}, ${order.address.city}` : 'No Address',
                    status: 'Active',
                    _rawJoinedDate: usersData[uid]?.joinedAt || null,
                    _earliestOrderDate: order.date ? new Date(order.date).getTime() : Infinity
                };
            } else {
                if (order.date) {
                    const orderTime = new Date(order.date).getTime();
                    if (orderTime < customerMap[uid]._earliestOrderDate) {
                        customerMap[uid]._earliestOrderDate = orderTime;
                    }
                }
            }
            customerMap[uid].orders += 1;
            customerMap[uid].spent += (order.grandTotal || order.amount || 0);
            if (order.address && customerMap[uid].address === 'No Address') {
                customerMap[uid].address = `${order.address.street}, ${order.address.locality}, ${order.address.city}`;
            }
            if (orderMobile && customerMap[uid].contact === 'N/A') {
                customerMap[uid].contact = orderMobile;
            }
        });

        // 2. Add users from usersData who haven't ordered yet
        Object.keys(usersData).forEach(uid => {
            if (!customerMap[uid]) {
                customerMap[uid] = {
                    id: uid,
                    customer: usersData[uid].displayName || usersData[uid].name || 'Anonymous',
                    email: usersData[uid].email || 'N/A',
                    contact: usersData[uid]?.mobile || usersData[uid]?.phone || 'N/A',
                    orders: 0,
                    spent: 0,
                    joined: usersData[uid].joinedAt ? new Date(usersData[uid].joinedAt).toLocaleDateString() : 'N/A',
                    address: 'No Address',
                    status: 'Active',
                    _rawJoinedDate: usersData[uid].joinedAt || null,
                    _earliestOrderDate: Infinity
                };
            }
        });

        const customerList = Object.values(customerMap).map(item => {
            let joinedStr = item.joined;
            if (joinedStr === 'N/A' && item._earliestOrderDate !== Infinity) {
                joinedStr = new Date(item._earliestOrderDate).toLocaleDateString();
            }
            return {
                ...item,
                joined: joinedStr,
                spent: `₹${item.spent.toLocaleString()}`,
                status: usersData[item.id]?.blocked ? 'Blocked' : (item.orders > 5 ? 'VIP' : 'Active')
            };
        });

        setCustomers(customerList);
    }, [usersData, ordersData]);

    // Helper to style the Status pill
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active': return 'bg-amber-100 text-amber-700';
            case 'VIP': return 'bg-[#fef08a] text-[#854d0e]';
            case 'Inactive': return 'bg-slate-100 text-slate-600';
            case 'Blocked': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    // Derived filtered and sorted customers
    const processedCustomers = React.useMemo(() => {
        let result = [...customers];

        // 1. Apply Time Filter
        // Note: For realistic time filtering we need real order dates, but based on the user's joined date 
        // to simplify. In a real scenario, "Highest Spending This Month" requires mapping orders by date.
        // Assuming joined date is ISO or parseable for demo purposes:
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const getStartOfWeek = () => {
            const d = new Date(now);
            const day = d.getDay();
            const diff = d.getDate() - day + (day == 0 ? -6 : 1);
            return new Date(d.setDate(diff)).setHours(0,0,0,0);
        };
        const startOfWeek = new Date(getStartOfWeek());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        if (timeFilter !== 'All Time') {
            result = result.filter(c => {
                if (c.joined === 'N/A') return false;
                const joinedDate = new Date(c._rawJoinedDate || c.joined); // Use raw if available or parse string
                if (isNaN(joinedDate.getTime())) return true; // fallback for unparseable

                if (timeFilter === 'Today') return joinedDate >= startOfToday;
                if (timeFilter === 'This Week') return joinedDate >= startOfWeek;
                if (timeFilter === 'This Month') return joinedDate >= startOfMonth;
                if (timeFilter === 'This Year') return joinedDate >= startOfYear;
                return true;
            });
        }

        // 2. Apply Sort
        result.sort((a, b) => {
            if (sortBy === 'Highest Spending') {
                const spentA = parseInt(a.spent.replace(/[₹,]/g, '')) || 0;
                const spentB = parseInt(b.spent.replace(/[₹,]/g, '')) || 0;
                return spentB - spentA;
            }
            if (sortBy === 'Most Orders') {
                return b.orders - a.orders;
            }
            if (sortBy === 'Newest Customers') {
                const dateA = new Date(a._rawJoinedDate || a.joined).getTime() || 0;
                const dateB = new Date(b._rawJoinedDate || b.joined).getTime() || 0;
                return dateB - dateA; // Newest first
            }
            if (sortBy === 'Oldest Customers') {
                const dateA = new Date(a._rawJoinedDate || a.joined).getTime() || Date.now();
                const dateB = new Date(b._rawJoinedDate || b.joined).getTime() || Date.now();
                return dateA - dateB; // Oldest first
            }
            return 0;
        });

        return result;
    }, [customers, sortBy, timeFilter]);

    return (
        <div className="max-w-7xl mx-auto w-full animate-fade-in pb-12">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Customers</h1>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <span className="hover:text-indigo-600 cursor-pointer transition-colors">Home</span>
                        <span>/</span>
                        <span className="text-indigo-600">Customers</span>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 relative z-10">
                    {/* Sort Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => { setShowSortDropdown(!showSortDropdown); setShowTimeDropdown(false); }}
                            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 px-4 rounded-xl font-bold text-sm transition-colors shadow-sm"
                        >
                            <Filter size={16} className="text-indigo-500" />
                            Sort By: {sortBy}
                            <ChevronDown size={14} className="text-slate-400 ml-1" />
                        </button>
                        
                        {showSortDropdown && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 z-50">
                                {['Highest Spending', 'Most Orders', 'Newest Customers', 'Oldest Customers'].map(option => (
                                    <button
                                        key={option}
                                        onClick={() => { setSortBy(option); setShowSortDropdown(false); }}
                                        className={`w-full text-left px-5 py-2.5 text-sm font-bold transition-colors ${sortBy === option ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Time Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => { setShowTimeDropdown(!showTimeDropdown); setShowSortDropdown(false); }}
                            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 px-4 rounded-xl font-bold text-sm transition-colors shadow-sm"
                        >
                            <Calendar size={16} className="text-amber-500" />
                            {timeFilter}
                            <ChevronDown size={14} className="text-slate-400 ml-1" />
                        </button>
                        
                        {showTimeDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 z-50">
                                {['All Time', 'Today', 'This Week', 'This Month', 'This Year'].map(option => (
                                    <button
                                        key={option}
                                        onClick={() => { setTimeFilter(option); setShowTimeDropdown(false); }}
                                        className={`w-full text-left px-5 py-2.5 text-sm font-bold transition-colors ${timeFilter === option ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Customers */}
                <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center relative overflow-hidden group border-b-4 border-b-indigo-500">
                    <h3 className="text-[2.2rem] font-black text-slate-800 tracking-tight mb-1">{customers.length}</h3>
                    <p className="text-sm font-bold text-slate-400">Total Customers</p>
                </div>

                {/* VIP Customers */}
                <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center relative overflow-hidden border-b-4 border-b-amber-500">
                    <h3 className="text-[2.2rem] font-black text-slate-800 tracking-tight mb-1">
                        {customers.filter(c => c.status === 'VIP').length}
                    </h3>
                    <p className="text-sm font-bold text-slate-400">VIP Customers</p>
                </div>

                {/* Avg Orders */}
                <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center relative overflow-hidden border-b-4 border-b-amber-500">
                    <h3 className="text-[2.2rem] font-black text-slate-800 tracking-tight mb-1">
                        {customers.length > 0 ? (customers.reduce((s, c) => s + c.orders, 0) / customers.length).toFixed(1) : 0}
                    </h3>
                    <p className="text-sm font-bold text-slate-400">Avg. Orders/User</p>
                </div>

                {/* Revenue/Cust */}
                <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center relative overflow-hidden border-b-4 border-b-rose-500">
                    <h3 className="text-[2.2rem] font-black text-slate-800 tracking-tight mb-1">
                        ₹{customers.length > 0 ? Math.floor(customers.reduce((s, c) => s + parseInt(c.spent.replace(/[₹,]/g, '')), 0) / customers.length).toLocaleString() : 0}
                    </h3>
                    <p className="text-sm font-bold text-slate-400">Avg. Revenue/User</p>
                </div>
            </div>

            {/* All Customers Table */}
            <div className="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">All Customers</h2>
                </div>

                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Customer</th>
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Email</th>
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Contact Number</th>
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Total Orders</th>
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Total Spent</th>
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Joined</th>
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Status</th>
                                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Loading data...</td>
                                </tr>
                            ) : processedCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No customers found</td>
                                </tr>
                            ) : processedCustomers.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar name={item.customer} size="sm" />
                                            <span className="font-bold text-slate-700 text-sm block">{item.customer}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-medium text-slate-700">{item.email}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm text-slate-600 font-semibold">{item.contact}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-semibold text-slate-700">{item.orders}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-bold text-slate-700">{item.spent}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-medium text-slate-500">{item.joined}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => { setSelectedCustomer(item); setIsMsgModalOpen(true); }}
                                                className="text-slate-400 hover:text-indigo-600 transition-colors" 
                                                title="Message"
                                            >
                                                <Mail size={16} strokeWidth={2.5} />
                                            </button>
                                            <button 
                                                onClick={() => handleBlockToggle(item.id)}
                                                className={`${usersData[item.id]?.blocked ? 'text-red-500 hover:text-red-600' : 'text-slate-400 hover:text-red-500'} transition-colors`} 
                                                title={usersData[item.id]?.blocked ? "Unblock" : "Block"}
                                            >
                                                <Ban size={16} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Message Modal */}
            {isMsgModalOpen && selectedCustomer && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4" onClick={() => setIsMsgModalOpen(false)}>
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-black text-slate-800 mb-2">Message to {selectedCustomer.customer}</h3>
                        <p className="text-xs text-slate-400 mb-4">This message will be sent to the user's inbox.</p>
                        
                        <textarea 
                            className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                            placeholder="Type your message here..."
                            value={msgText}
                            onChange={(e) => setMsgText(e.target.value)}
                        />
                        
                        <div className="flex justify-end gap-3 mt-5">
                            <button 
                                onClick={() => setIsMsgModalOpen(false)} 
                                className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSendMessage} 
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-200 transition-colors"
                            >
                                Send Message
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCustomers;

