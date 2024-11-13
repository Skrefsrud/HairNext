import { useState } from 'react';
import { createClient } from '../utils/supabase/client';

const AuthForm = () => {
    const supabase = createClient();
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h2 className="text-2xl font-bold mb-4">Sign In / Sign Up</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-2 p-2 border border-gray-300 rounded"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-2 p-2 border border-gray-300 rounded"
            />
            <button onClick={handleSignUp} className="bg-blue-500 text-white px-4 py-2 rounded mb-2">
                Sign Up
            </button>
            <button onClick={handleSignIn} className="bg-green-500 text-white px-4 py-2 rounded">
                Sign In
            </button>
            {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
    );
};

export default AuthForm;
