import React, { useState, useEffect } from 'react';
import { Users, Search, MoreVertical, Eye, Mail, Download, Filter, Calendar, ChevronDown, Ban, AlertCircle, UserPlus } from 'lucide-react';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [statusTab, setStatusTab] = useState('All');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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

        // 2. Apply Status Tab Filter
        if (statusTab !== 'All') {
            result = result.filter(c => c.status === statusTab);
        }

        // 3. Apply Search Filter
        if (searchQuery) {
            const s = searchQuery.toLowerCase();
            result = result.filter(c => 
                c.customer.toLowerCase().includes(s) || 
                c.email.toLowerCase().includes(s) || 
                c.contact.toLowerCase().includes(s)
            );
        }

        // 4. Apply Sort
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
    }, [customers, sortBy, timeFilter, statusTab, searchQuery]);

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

            <div className="flex flex-col gap-6 mb-8">
                {/* Search and Status Filters */}
                <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        {/* Status Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                            {['All', 'Active', 'VIP', 'Blocked'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusTab(status)}
                                    className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                                        statusTab === status 
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' 
                                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600'
                                    }`}
                                >
                                    {status}
                                    <span className="ml-2 opacity-60">
                                        {status === 'All' ? customers.length : customers.filter(c => c.status === status).length}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div className="flex items-center gap-4 flex-1 max-w-2xl">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input 
                                    type="text"
                                    placeholder="Search by name, email or contact..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 transition-all shadow-inner"
                                />
                            </div>
                        </div>
                    </div>
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
                <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
                    <h2 className="text-lg font-bold text-slate-800">All Customers</h2>
                    
                    <div className="flex items-center gap-3">
                         {/* Sort Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => { setShowSortDropdown(!showSortDropdown); setShowTimeDropdown(false); }}
                                className="flex items-center gap-2 bg-slate-50 border-none text-slate-600 py-2.5 px-4 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-inner"
                            >
                                <Filter size={14} className="text-indigo-500" />
                                Sort: {sortBy}
                                <ChevronDown size={14} className="text-slate-400 ml-1" />
                            </button>
                            
                            {showSortDropdown && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 z-50">
                                    {['Highest Spending', 'Most Orders', 'Newest Customers', 'Oldest Customers'].map(option => (
                                        <button
                                            key={option}
                                            onClick={() => { setSortBy(option); setShowSortDropdown(false); }}
                                            className={`w-full text-left px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-colors ${sortBy === option ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
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
                                className="flex items-center gap-2 bg-slate-50 border-none text-slate-600 py-2.5 px-4 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-inner"
                            >
                                <Calendar size={14} className="text-amber-500" />
                                {timeFilter}
                                <ChevronDown size={14} className="text-slate-400 ml-1" />
                            </button>
                            
                            {showTimeDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 z-50">
                                    {['All Time', 'Today', 'This Week', 'This Month', 'This Year'].map(option => (
                                        <button
                                            key={option}
                                            onClick={() => { setTimeFilter(option); setShowTimeDropdown(false); }}
                                            className={`w-full text-left px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-colors ${timeFilter === option ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                            {processedCustomers.length} Records
                        </div>
                    </div>
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
                                        <div className="flex items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
                                            <button 
                                                onClick={() => { setSelectedCustomer(item); setIsProfileModalOpen(true); }}
                                                className="w-9 h-9 flex items-center justify-center bg-white text-indigo-500 hover:bg-indigo-600 hover:text-white rounded-xl shadow-sm border border-slate-200 transition-all active:scale-95" 
                                                title="View Profile"
                                            >
                                                <Eye size={14} strokeWidth={2.5} />
                                            </button>
                                            <button 
                                                onClick={() => { setSelectedCustomer(item); setIsMsgModalOpen(true); }}
                                                className="w-9 h-9 flex items-center justify-center bg-white text-emerald-500 hover:bg-emerald-600 hover:text-white rounded-xl shadow-sm border border-slate-200 transition-all active:scale-95" 
                                                title="Message"
                                            >
                                                <Mail size={14} strokeWidth={2.5} />
                                            </button>
                                            <button 
                                                onClick={() => handleBlockToggle(item.id)}
                                                className={`w-9 h-9 flex items-center justify-center bg-white ${usersData[item.id]?.blocked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'} hover:bg-red-600 hover:text-white rounded-xl shadow-sm border border-slate-200 transition-all active:scale-95`} 
                                                title={usersData[item.id]?.blocked ? "Unblock" : "Block"}
                                            >
                                                <Ban size={14} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                        <div className="group-hover:hidden text-slate-300 flex justify-end">
                                            <MoreVertical size={18} />
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

            {/* Profile Modal */}
            {isProfileModalOpen && selectedCustomer && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4" onClick={() => setIsProfileModalOpen(false)}>
                    <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-6 mb-8">
                            <UserAvatar name={selectedCustomer.customer} size="xl" />
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedCustomer.customer}</h3>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{selectedCustomer.email}</p>
                                <div className="flex gap-2 mt-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(selectedCustomer.status)}`}>
                                        {selectedCustomer.status}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500">
                                        Joined {selectedCustomer.joined}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {[
                                { label: 'Total Orders', value: selectedCustomer.orders, color: 'indigo' },
                                { label: 'Lifetime Spent', value: selectedCustomer.spent, color: 'emerald' },
                                { label: 'Avg Order', value: `₹${(parseInt(selectedCustomer.spent.replace(/[₹,]/g, '')) / (selectedCustomer.orders || 1)).toFixed(0)}`, color: 'amber' }
                            ].map((stat, i) => (
                                <div key={i} className={`p-4 rounded-2xl bg-${stat.color}-50 border border-${stat.color}-100`}>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                                    <h4 className={`text-xl font-black text-${stat.color}-700 tracking-tight`}>{stat.value}</h4>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Account Information</h4>
                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number</span>
                                        <span className="text-sm font-black text-slate-700">{selectedCustomer.contact}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Primary Address</span>
                                        <span className="text-sm font-black text-slate-700 max-w-[200px] text-right">{selectedCustomer.address}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsProfileModalOpen(false)}
                                className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-900/10"
                            >
                                Close Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCustomers;

