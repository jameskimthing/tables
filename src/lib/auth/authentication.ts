import { supabase } from '$lib/supabase';
import type { User } from '@supabase/supabase-js';

export async function signin(info: { email: string; password: string }): Promise<User> {
	const { data, error } = await supabase.auth.signInWithPassword({
		email: info['email'],
		password: info['password']
	});

	if (error) throw error;
	return data['user']!;
}
export async function signup(info: {
	email: string;
	password: string;
	name: string;
}): Promise<User> {
	const { data, error } = await supabase.auth.signUp({
		email: info['email'],
		password: info['password']
	});
	if (error) throw error;
	return data['user']!;
}
export async function signout() {}
