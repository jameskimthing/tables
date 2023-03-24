import { alertUser } from '$lib/components/components/alert';
import { supabase } from '$lib/supabase';
import type { User } from '@supabase/supabase-js';

async function signin(info: { email: string; password: string }): Promise<User> {
	const { data, error } = await supabase.auth.signInWithPassword({
		email: info['email'],
		password: info['password']
	});

	if (error) throw error;

	alertUser('success', 'Successfully signed in!', data['user']!['email']!);
	return data['user']!;
}
async function signup(info: { email: string; password: string; name: string }): Promise<User> {
	const { data, error } = await supabase.auth.signUp({
		email: info['email'],
		password: info['password']
	});
	if (error) throw error;
	return data['user']!;
}
async function signout() {}

export { signin, signout, signup };
