<script>
	import { fade } from 'svelte/transition';
</script>

<main in:fade>
	<h1>Hello World!</h1>
</main>

<style>
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
	}

	h1 {
		font-size: 2.5rem;
		color: #2d3748;
	}
</style>
