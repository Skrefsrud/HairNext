import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabase/supabaseClient';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data.user) {
                router.push('/auth');
            } else {
                setUser(data.user);
            }
        };
        getUser();
    }, []);

    if (!user) return null;

    return <>{children}</>;
};

export default ProtectedRoute;
