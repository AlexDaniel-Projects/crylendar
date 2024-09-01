<script lang="ts">
	import { Button, Icon } from 'svelte-ux';
	import { mdiHeart } from '@mdi/js';
</script>

<main class="p-2">
	<h1 class="text-3xl font-semibold">About</h1>
	<p class="my-2">Track your mood throughout the years!</p>

	<p class="my-2">
		Built with
		<Button target="_blank" color="primary" class="p-0 py-0.5" href="https://svelte.dev/"
			>Svelte</Button
		>,
		<Button target="_blank" color="primary" class="p-0 py-0.5" href="https://kit.svelte.dev/"
			>SvelteKit</Button
		>,
		<Button target="_blank" color="primary" class="p-0 py-0.5" href="https://svelte-ux.techniq.dev/"
			>Svelte UX</Button
		>,
		<Button target="_blank" color="primary" class="p-0 py-0.5" href="https://hono.dev/">Hono</Button
		> and
		<Button target="_blank" color="primary" class="p-0 py-0.5" href="https://orm.drizzle.team/"
			>Drizzle ORM</Button
		>.
	</p>

	<p class="my-2">
		Made with <Icon data={mdiHeart} class="align-bottom text-red-400" size="1.35em" />
		by <Button
			href="https://github.com/AlexDaniel"
			target="_blank"
			color="primary"
			class="p-0 py-0.5">AlexDaniel</Button
		>
	</p>
</main>
