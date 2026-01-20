<script lang="ts">
	import { onMount } from 'svelte';

	let isGreen = $state(false);

	onMount(() => {
		// Flash immediately after load to show it works
		setTimeout(() => {
			triggerFlash();
			scheduleNextFlash();
		}, 1000);
	});

	function triggerFlash() {
		isGreen = true;
		const flashDuration = 100 + Math.random() * 400; // Random between 100ms (.1s) and 500ms (.5s)
		console.log(`FLASH! Duration: ${Math.round(flashDuration)}ms`);
		setTimeout(() => {
			isGreen = false;
		}, flashDuration);
	}

	const scheduleNextFlash = () => {
		// Roughly every 10 seconds (between 8 and 12 seconds)
		const randomDelay = 8000 + Math.random() * 4000;
		
		setTimeout(() => {
			triggerFlash();
			scheduleNextFlash();
		}, randomDelay);
	};
</script>

<svelte:head>
	<title>Makaylah Simulator</title>
</svelte:head>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="simulator" class:green={isGreen}></div>

<style>
	.simulator {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: black;
		z-index: 9999;
		pointer-events: none; /* Let clicks pass through if needed, though it's a simulator */
	}

	.green {
		background-color: #00ff00 !important;
	}
</style>
