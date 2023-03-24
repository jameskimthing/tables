import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { createClient, type AuthChangeEvent, type UserResponse } from '@supabase/supabase-js';
import { get } from 'svelte/store';

const supabase = createClient(
	import.meta.env.VITE_PUBLIC_SUPABASE_URL,
	import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY
);

let user: UserResponse | undefined;
let prevAuthState: AuthChangeEvent | null = null;
supabase.auth.onAuthStateChange(async (authState: AuthChangeEvent) => {
	console.log('CHANGE! to: ' + authState);
	if (prevAuthState === authState) return;
	prevAuthState = authState;

	if (authState === 'SIGNED_OUT' || authState === 'USER_DELETED') {
		user = await supabase.auth.getUser();
		goto('/auth');
	} else {
		user = await supabase.auth.getUser();
		const url = get(page)['url']['pathname'];
		if (url === '/' || url === '/auth') goto('/home');
	}
});

async function getUser() {
	if (!user) await supabase.auth.getUser();
	return user;
}

export { supabase, getUser };
