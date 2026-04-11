import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithPopup,
    updateProfile
} from 'firebase/auth';
import { auth, googleProvider, realtimeDb } from '../firebase';
import { ref, update } from 'firebase/database';
import Loader from '../components/common/Loader';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authView, setAuthView] = useState('login');

    const openAuthModal = (view = 'login') => {
        setAuthView(view);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => setIsAuthModalOpen(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const isAdmin = currentUser.email?.toLowerCase() === 'admin786@gmail.com';
                const userData = {
                    id: currentUser.uid,
                    email: currentUser.email,
                    name: isAdmin ? 'Meraj Hussain' : (currentUser.displayName || currentUser.email.split('@')[0]),
                    photo: currentUser.photoURL,
                    role: isAdmin ? 'admin' : 'member',
                    joinedAt: currentUser.metadata.creationTime,
                    lastLogin: new Date().toISOString()
                };
                setUser(userData);

                // Persist user to Realtime Database for Admin Dashboard visibility
                const userRef = ref(realtimeDb, `users/${currentUser.uid}`);
                update(userRef, userData).catch(error => {
                    console.error("Error persisting user to DB:", error);
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = useCallback(async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            console.error("Login Error:", error.code, error.message);
            let errorMessage = 'Invalid email or password';
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'Account not found. Please sign up first.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password. Please try again.';
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid credentials. Check email/password or sign up if new.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many attempts. Access temporarily blocked. Please wait a few minutes.';
            }
            
            return { success: false, message: `${errorMessage} (${error.code})`, code: error.code };
        }
    }, []);

    const signup = useCallback(async (name, email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            
            // Explicitly force update DB with correct name to avoid race condition with onAuthStateChanged
            const userData = {
                id: userCredential.user.uid,
                email: userCredential.user.email,
                name: name,
                role: 'member',
                joinedAt: userCredential.user.metadata.creationTime || new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            const userRef = ref(realtimeDb, `users/${userCredential.user.uid}`);
            await update(userRef, userData);

            return { success: true };
        } catch (error) {
            console.error("Signup Error:", error.code, error.message);
            let errorMessage = 'Signup failed. Please try again.';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered. Try logging in.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak. Use at least 6 characters.';
            }
            return { success: false, message: errorMessage };
        }
    }, []);

    const loginWithGoogle = useCallback(async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            return { success: true };
        } catch (error) {
            console.error("Google Login Error:", error.code, error.message);
            let errorMessage = 'Google Login failed';
            
            if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Popup blocked by browser. Please allow popups for this site.';
            } else if (error.code === 'auth/unauthorized-domain') {
                errorMessage = 'This domain is not authorized for Google Login. Please add your domain to Firebase console.';
            } else if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Login canceled by user.';
            }
            
            return { success: false, message: `${errorMessage} (${error.code})`, code: error.code };
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await signOut(auth);
            return true;
        } catch (error) {
            console.error("Logout Error:", error.message);
            return false;
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            login,
            signup,
            loginWithGoogle,
            logout,
            loading,
            isAuthModalOpen,
            authView,
            openAuthModal,
            closeAuthModal
        }}>
            {loading ? <Loader /> : children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
