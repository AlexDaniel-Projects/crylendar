<script lang="ts">
	import { AppBar, Button, NavItem, Tooltip, settings, ThemeInit, ThemeSwitch } from 'svelte-ux';

	import { page } from '$app/stores';
	import '../app.postcss';

	settings({
		components: {
			AppBar: {
				classes: 'bg-primary text-white shadow-md'
			},
			AppLayout: {
				classes: {
					nav: 'bg-neutral-800 py-2'
				}
			},
			NavItem: {
				classes: {
					root: 'text-sm text-gray-400 pl-6 py-2 hover:text-white hover:bg-gray-300/10 [&:where(.is-active)]:text-sky-400 [&:where(.is-active)]:bg-gray-500/10'
				}
			}
		}
	});
</script>

<ThemeInit />

<AppBar title="crylendar – track your mood throughout the years" class="">
	<svelte:fragment slot="menuIcon">
		<NavItem
			path="/"
			text="Home"
			icon="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"
			currentUrl={$page.url}
			class="pl-3 pr-4 text-gray-900 [&:where(.is-active)]:text-sky-100"
		/>

		<NavItem
			path="/about"
			text="About"
			icon="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"
			currentUrl={$page.url}
			class="pl-3 pr-4 text-gray-900 [&:where(.is-active)]:text-sky-100"
		/>
	</svelte:fragment>

	<div slot="title" class="text-center w-full">
		<!--<h1 class="text-2xl font-semibold">Welcome to ✨Crylendar✨</h1>-->
	</div>

	<div slot="actions" class="flex gap-3">
		<Tooltip title="View repository" placement="left" offset={2}>
			<Button
				icon="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
				href="https://github.com/AlexDaniel-Projects/crylendar"
				class="p-2"
				target="_blank"
			/>
		</Tooltip>

		<Tooltip title="Change theme" placement="left" offset={2}>
			<div class="grid grid-cols-[auto,1fr] gap-3 items-center justify-items-start">
				<ThemeSwitch />
			</div>
		</Tooltip>
	</div>
</AppBar>

<slot />
