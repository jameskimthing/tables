import { goto } from '$app/navigation';
import { createClient, type AuthChangeEvent, type UserResponse } from '@supabase/supabase-js';

const supabase = createClient(
	import.meta.env.VITE_PUBLIC_SUPABASE_URL,
	import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY
);

let user: UserResponse | null;
let prevAuthState: AuthChangeEvent | null = null;
supabase.auth.onAuthStateChange(async (authState: AuthChangeEvent) => {
	console.log('CHANGE! to: ' + authState);
	if (prevAuthState === authState) return;
	prevAuthState = authState;

	if (authState === 'SIGNED_OUT' || authState === 'USER_DELETED') {
		user = await supabase.auth.getUser();
		goto('/');
	} else {
		user = await supabase.auth.getUser();
		// goto('/home');
	}
});

async function getUser() {
	if (!user) user = await supabase.auth.getUser();
	return user;
}

export { supabase, getUser };
