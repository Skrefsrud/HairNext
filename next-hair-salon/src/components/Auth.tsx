import { useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';

const Auth = () => {
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
        <div>
            <h2>Sign In / Sign Up</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignUp}>Sign Up</button>
            <button onClick={handleSignIn}>Sign In</button>
            <p>{message}</p>
        </div>
    );
};

export default Auth;
