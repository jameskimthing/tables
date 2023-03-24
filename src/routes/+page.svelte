<script>
	import { goto } from '$app/navigation';
	import { getUser } from '$lib/supabase';

	(async () => {
		const user = await getUser();
		if (user) goto('/home');
		else goto('/auth');
	})();
</script>

<div class="text-center text-5xl pt-14">Loading...</div>
