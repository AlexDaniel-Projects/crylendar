<script lang="ts">
	import { Button, ScrollingValue } from 'svelte-ux';
	import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
	import { format, getDaysInMonth } from 'date-fns';

	type Option = '😢' | '😭' | '😡' | '😌';

	const options: Option[] = ['😢', '😭', '😡', '😌'];

	const data: Record<string, Option | undefined> = {
		'2024-08-25': '😭'
	};

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

	function setDataPoint(formattedDate: string) {
		data[formattedDate] = options[Math.floor(Math.random() * options.length)];
	}

	function toggleDataPoint(formattedDate: string) {
		// @ts-expect-error -- indexOf returns -1 if not found, that's OK
		let index = options.indexOf(data[formattedDate]);
		index += 1;
		if (index >= options.length) {
			data[formattedDate] = undefined;
		} else {
			data[formattedDate] = options[index];
		}
	}
</script>

<main class="p-4 grid place-items-center content-center">
	<div class="flex items-center mb-4 gap-1">
		<Button icon={mdiChevronLeft} variant="fill" color="primary" on:click={() => currentYear--}
			>Previous Year</Button
		>
		<Button variant="fill" color="primary" disabled>{currentYear}</Button>
		<Button icon={mdiChevronRight} variant="fill" color="primary" on:click={() => currentYear++}
			>Next Year</Button
		>
	</div>

	<div class="grid grid-cols-1 w-full">
		{#each months as month, i}
			<div class="grid grid-cols-[repeat(32,_minmax(0,_1fr))] justify-items-center items-center">
				<div class="font-bold">{month}</div>
				{#each days as day}
					{@const key = asKey(currentYear, i + 1, day)}
					<div class="w-full">
						<!-- button with on click -->
						<button
							on:mousedown={() => toggleDataPoint(key)}
							class="w-full Button flex items-center justify-center"
						>
							<ScrollingValue
								axis="x"
								value={day <= daysInMonth[i] ? options.indexOf(data[key]) : -2}
								let:value
							>
								<div
									class={`min-h-[52px] flex items-center justify-center ${value !== -1 ? 'text-3xl' : 'text-lg'}`}
								>
									<div class={key === today ? 'font-bold bg-red-500' : ''}>
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
