<script>
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';

	(async () => {
		const user = await supabase.auth.getUser();
		if (user) goto('/home');
		else goto('/auth');
	})();
</script>

<div class="text-center text-5xl pt-14">Loading...</div>
