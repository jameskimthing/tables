import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	import.meta.env.VITE_PUBLIC_SUPABASE_URL,
	import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY
);

// let previousAuthState: string;
// supabase.auth.onAuthStateChange(async (authState: AuthChangeEvent) => {
// 	if (authState === previousAuthState) return;
// 	previousAuthState = authState;

// 	if (authState === 'SIGNED_OUT' || authState === 'USER_DELETED') user = null;
// 	else user = await supabase.auth.getUser();
// });

// let user: UserResponse | null;
// async function getUser(): Promise<UserResponse> {
// 	if (!user) return await supabase.auth.getUser();
// 	return user;
// }

export { supabase };
