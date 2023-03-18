<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	import Signin from './Signin.svelte';
	import Signup from './Signup.svelte';

	let info: { name: string; email: string; password: string } = {
		email: '',
		password: '',
		name: ''
	};

	let isLogin: boolean = true;
	let title: string;
	$: title = isLogin ? 'Login' : 'Make an Account';
</script>

<div class="absolute left-1/2 top-1/3" style="transform: translate(-50%,-50%);">
	<div class="scale-125">
		<div class="rounded-xl shadow-2xl flex flex-col">
			<div class="bg-slate-700 text-white rounded-t-xl text-center py-2 text-xl">
				{title}
			</div>
			<div class="p-4">
				{#if isLogin}
					<Signin {info} />
				{:else}
					<Signup {info} />
				{/if}

				<div
					class="mt-5 h-9 border-black border-2 rounded flex flex-row items-center justify-center"
				>
					<div
						class="w-full text-center h-full leading-7 cursor-pointer"
						style={isLogin ? 'background-color: #c1cabe' : ''}
						on:pointerup={() => (isLogin = true)}
					>
						Login
					</div>
					<div class="w-[3px] h-full bg-black" />
					<div
						class="w-full text-center h-full leading-7 cursor-pointer"
						style={!isLogin ? 'background-color: #c1cabe' : ''}
						on:pointerup={() => (isLogin = false)}
					>
						Make account
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
