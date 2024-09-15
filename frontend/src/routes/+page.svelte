<script lang="ts">
	import { Button, ScrollingValue, Dialog, SelectField, Field, Input, Icon } from 'svelte-ux';
	import { mdiChevronLeft, mdiChevronRight, mdiPlusBox, mdiInformationOutline } from '@mdi/js';
	import { format, getDaysInMonth } from 'date-fns';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

	type Option = '😌' | '😢' | '😭' | '😡' | '😊';
	const options: Option[] = ['😌', '😢', '😭', '😡', '😊'];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars -- temporarily not used
	let loading = false;

	const defaultCalendars = [
		{ label: 'public calendar', value: 'public' }, //
		{ label: 'another public calendar', value: 'public-2' } //
	];
	let availableCalendars: typeof defaultCalendars = [];

	interface CalendarData {
		token: string;
		name: string;
		data: Record<string, Option | undefined>;
		createdAt: Date;
	}

	let calendarData: CalendarData = {
		token: '',
		name: '',
		data: {},
		createdAt: new Date()
	};

	$: calendarToken = $page.url.searchParams.get('id');

	$: {
		if (browser) {
			if (!calendarToken) {
				goto(`?id=public`);
			}
			if (calendarToken) {
				fetchData(calendarToken);
			}
		}
	}

	function saveCalendars(calendarData: CalendarData) {
		const calendars = Object.fromEntries(availableCalendars.map((c) => [c.value, c]));
		Object.assign(calendars, JSON.parse(localStorage.getItem('calendars') || '{}'));
		calendars[calendarData.token] = { label: calendarData.name, value: calendarData.token };
		localStorage.setItem('calendars', JSON.stringify(calendars));
	}

	function loadCalendars() {
		if (localStorage.getItem('calendars')) {
			availableCalendars = Object.values(JSON.parse(localStorage.getItem('calendars') || '{}'));
		}
		for (const calendar of defaultCalendars) {
			if (!availableCalendars.find((c) => c.value === calendar.value)) {
				availableCalendars.push(calendar);
			}
		}
	}

	async function fetchData(calendarToken: string) {
		try {
			loading = true;
			const response = await fetch(`${apiUrl}/calendars/${calendarToken}/`);
			if (response.status === 200) {
				calendarData = await response.json();
				saveCalendars(calendarData);
				loadCalendars();
			}
			loading = false;
		} catch (error) {
			console.error('Failed to fetch data:', error);
		}
	}

	let currentYear = new Date().getFullYear();

	const months = [
		'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
	]; // prettier-ignore

	$: daysInMonth = Array.from({ length: 12 }, (_, month) =>
		getDaysInMonth(new Date(currentYear, month))
	);
	const days = Array.from({ length: 31 }, (_, i) => i + 1);

	const today = format(new Date(), 'yyyy-MM-dd');

	function asKey(year: number, month: number, day: number) {
		const date = new Date(year, month - 1, day);
		const formattedDate = format(date, 'yyyy-MM-dd');
		return formattedDate;
	}

	async function toggleDataPoint(formattedDate: string) {
		// @ts-expect-error -- indexOf returns -1 if not found, that's OK
		let index = options.indexOf(calendarData.data[formattedDate]);
		index += 1;
		if (index >= options.length) {
			calendarData.data[formattedDate] = undefined;
		} else {
			calendarData.data[formattedDate] = options[index];
		}

		try {
			const response = await fetch(`${apiUrl}/calendars/${calendarToken}/data/`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ date: formattedDate, value: calendarData.data[formattedDate] })
			});
			if (response.status !== 200) {
				console.error('Failed to update data:', response);
			}
		} catch (error) {
			console.error('Failed to update data:', error);
		}
	}

	function isWeekend(formattedDate: string) {
		const date = new Date(formattedDate);
		return date.getDay() === 0 || date.getDay() === 6;
	}

	let dialogOpen = false;
	let newCalendarName = 'my new calendar';

	function openDialog() {
		dialogOpen = true;
	}

	async function createCalendar() {
		try {
			const result = await fetch(`${apiUrl}/calendars/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: newCalendarName })
			});
			const createdCalendars = await result.json();
			if (createdCalendars.length === 1) {
				const { token } = createdCalendars[0];
				await fetchData(token);
				goto(`?id=${token}`);
			}
		} catch (error) {
			console.error('Failed to create calendar:', error);
		}
	}

	function changeCalendar(event: CustomEvent) {
		goto(`?id=${event.detail.value}`);
	}

	function valueForDay(value: Option | undefined, day: number, month: number) {
		if (day > daysInMonth[month]) {
			return -2;
		}
		if (!value) {
			return -1;
		}
		return options.indexOf(value);
	}
</script>

<main class="p-4 grid place-items-center content-center">
	<Dialog bind:open={dialogOpen}>
		<div slot="title">create new calendar</div>
		<div slot="actions">
			<Button variant="fill" color="primary" on:click={createCalendar}>create</Button>
		</div>
		<div class="m-6 mt-2 mb-2">
			<Field label="calendar name" let:id>
				<Input {id} bind:value={newCalendarName} class="min-w-[300px]" />
			</Field>
		</div>
		<div class="mx-6 my-3">
			<Icon path={mdiInformationOutline} />
			only you and people who have the link will be able to see it
		</div>
	</Dialog>
	<div class="flex flex-wrap-reverse items-stretch mb-4 gap-1 justify-center">
		<Button icon={mdiChevronLeft} variant="fill" color="primary" on:click={() => currentYear--}
			><div class="px-2">previous year</div></Button
		>
		<Button variant="fill" color="primary" disabled>{currentYear}</Button>
		<Button icon={mdiChevronRight} variant="fill" color="primary" on:click={() => currentYear++}
			><div class="px-2">next year</div></Button
		>

		<div class="flex items-stretch gap-1">
			{#if browser && availableCalendars.length > 0}
				<SelectField
					label="current calendar"
					class="max-w-[300px]"
					options={availableCalendars}
					clearable={false}
					dense={true}
					stepper={true}
					value={calendarToken}
					on:change={changeCalendar}
				/>
			{:else}
				<div class="w-[300px] h-[46px] bg-surface-100 rounded animate-pulse"></div>
			{/if}
			<Button icon={mdiPlusBox} variant="fill" color="primary" on:click={openDialog}
				><div class="pl-2">create new</div></Button
			>
		</div>
	</div>

	<div class="grid grid-cols-[repeat(12,_minmax(0,_1fr))] xl:grid-cols-1 w-full xl:min-w-[1200px]">
		{#each months as month, i}
			<div
				class="grid grid-cols-1 xl:grid-cols-[repeat(32,_minmax(0,_1fr))] justify-items-center items-center border-r xl:border-r-0 xl:border-b last:border-0 border-gray-500"
			>
				<div class="font-bold">{month}</div>
				{#each days as day}
					{@const key = asKey(currentYear, i + 1, day)}
					{@const dataValue = valueForDay(calendarData.data[key], day, i)}
					<div class="w-full">
						<button
							on:mousedown={() => toggleDataPoint(key)}
							class="w-full Button flex items-center justify-center"
							disabled={key > today || dataValue === -2}
						>
							<ScrollingValue axis="x" value={dataValue} let:value>
								<div
									class={`min-h-[32px] md:min-h-[52px] flex items-center justify-center ${value !== -1 ? 'text-2xl md:text-3xl' : 'text-md md:text-lg'}`}
								>
									<div
										class="{key === today ? 'today' : ''} {isWeekend(key) ? 'weekend' : 'workday'}"
									>
										{#if value > -2}
											{options[value] ?? day}
										{/if}
									</div>
								</div>
							</ScrollingValue>
						</button>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</main>

<style lang="postcss">
	.workday {
		color: var(--color-secondary);
		transition: color 0.2s linear;
	}
	.weekend {
		color: #888;
		transition: color 0.2s linear;
	}

	button {
		border-radius: 4px;
		transition: opacity 0.2s linear;
	}
	button:disabled {
		opacity: 0.2;
		cursor: not-allowed;
	}
	button:hover {
		background-color: rgba(126, 126, 126, 0.05);
	}

	.today {
		font-weight: bold;
	}
</style>
