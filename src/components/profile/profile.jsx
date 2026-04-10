import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../common/UserAvatar';
import { useOrders } from '../../context/OrderContext';
import ConfirmDialog from '../common/ConfirmDialog';
import { ref, get, update } from 'firebase/database';
import { realtimeDb, auth } from '../../firebase';
import { updatePassword } from 'firebase/auth';

const ProfileSettings = () => {
  const { user } = useAuth();
  const { orders } = useOrders();

  const [address, setAddress] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchAddress = async () => {
      try {
        const userRef = ref(realtimeDb, `users/${user.id}`);
        const snapshot = await get(userRef);
        const data = snapshot.val();
        if (data && data.address) {
          setAddress(data.address);
        } else if (orders.length > 0 && orders[0].address) {
          const latest = `${orders[0].address.street}, ${orders[0].address.locality}, ${orders[0].address.city}, ${orders[0].address.state} - ${orders[0].address.pincode}`;
          setAddress(latest);
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };
    fetchAddress();
  }, [user, orders]);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleSaveClick = () => {
    setError('');
    setSuccess('');
    
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (newPassword.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    }
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    if (!user) return;
    setIsUpdating(true);
    setError('');
    setSuccess('');
    try {
      const userRef = ref(realtimeDb, `users/${user.id}`);
      await update(userRef, { address: address });

      if (newPassword) {
        if (!auth.currentUser) {
          setError("User session not found.");
          setIsUpdating(false);
          return;
        }
        await updatePassword(auth.currentUser, newPassword);
        setSuccess("Profile and password updated successfully.");
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setSuccess("Address updated successfully.");
      }
      setShowConfirm(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err.code === 'auth/requires-recent-login') {
        setError("Please log out and log back in to change password for security reasons.");
      } else {
        setError(err.message || "Failed to update profile.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="max-w-2xl">
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic mb-8">Profile Details.</h3>

        <div className="mb-10 flex items-center gap-6 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <UserAvatar name={user?.name} size="xl" />
            <div>
                <h4 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{user?.name}</h4>
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-1">Verified Account</p>
            </div>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
              <input
                type="text"
                defaultValue={user?.name || ""}
                placeholder="Your Name"
                className="w-full p-4 bg-slate-50 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
              <input
                type="email"
                value={user?.email || ""}
                placeholder="Your Email"
                className="w-full p-4 bg-slate-50 rounded-2xl border-none text-sm font-bold opacity-60 cursor-not-allowed outline-none"
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Delivery Address</label>
            <textarea
              rows="3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="No address saved yet. Place an order to save your address."
              className="w-full p-4 bg-slate-50 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
            ></textarea>
          </div>

          <div className="pt-6 border-t border-slate-50">
            <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-900 mb-6">
              <Lock size={16} /> Security Update
            </h4>
            <div className="space-y-4">
              {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold">{error}</div>}
              {success && <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl text-xs font-bold">{success}</div>}
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none text-sm font-bold outline-none"
              />
              {newPassword && (
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none text-sm font-bold outline-none"
                />
              )}
              <button
                type="button"
                onClick={handleSaveClick}
                disabled={isUpdating}
                className={`px-8 py-4 bg-amber-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-100 hover:bg-amber-700 transition-all ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Save Changes?"
        message="Are you sure you want to update your profile details?"
        confirmText="Yes, Save"
        confirmColor="bg-amber-600 hover:bg-amber-700"
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};

export default ProfileSettings;
