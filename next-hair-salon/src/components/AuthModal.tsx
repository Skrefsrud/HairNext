// components/AuthModal.tsx
import { useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSignUp = async () => {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setMessage(`Sign up error: ${error.message}`);
        else setMessage('Check your email for the confirmation link!');
    };

    const handleSignIn = async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setMessage(`Sign in error: ${error.message}`);
        else setMessage('Logged in successfully!');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <button
                    onClick={onClose}
                    className="text-gray-500 float-right"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-semibold text-center mb-4">Sign In / Sign Up</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button
                    onClick={handleSignUp}
                    className="w-full bg-blue-500 text-white p-2 rounded mb-2"
                >
                    Sign Up
                </button>
                <button
                    onClick={handleSignIn}
                    className="w-full bg-green-500 text-white p-2 rounded"
                >
                    Sign In
                </button>
                <p className="text-center mt-4 text-gray-500">{message}</p>
            </div>
        </div>
    );
};

export default AuthModal;
