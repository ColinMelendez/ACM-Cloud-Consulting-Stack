<script>
	import ReactiveCursor from './ReactiveCursor.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { enhance } from '$app/forms';
	import { animate, inView, scroll} from 'motion';
	import { fade } from 'svelte/transition';
	import {
		Globe,
		Brain,
		Palette,
		Cloud,
		ArrowLeft
	} from 'lucide-svelte';

	onMount(() => {
		document.querySelectorAll('.scroll-fade-block').forEach((item) => {
			scroll(
				animate(item, { opacity: [0, 1, 1, 0] }),
				{
					target: item,
					offset: ['start end', 'end end', 'start start', 'end start']
				}
			);
		});

		inView('.scroll-section', ({ target }) => {
			animate(
				target,
				{ opacity: 1, x: [-100, 0] },
				{
					duration: 0.9,
					easing: [0.17, 0.55, 0.55, 1]
				}
			);

			return () => animate(target, { opacity: 0, x: -100 });
		});

		// Start auto-cycling every 5 seconds
		intervalId = setInterval(cycleService, 5000);
	});

	// Clean up interval when component is destroyed
	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});

	const apiUrl = import.meta.env.VITE_API_URL;

	let selectedService = $state('web');
	let intervalId;

	function toggleService(service) {
		// Clear the interval when user clicks
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
		selectedService = selectedService === service ? null : service;
	}

	function cycleService() {
		const currentIndex = services.findIndex(s => s.id === selectedService);
		const nextIndex = (currentIndex + 1) % services.length;
		selectedService = services[nextIndex].id;
	}

	const services = [
		{
			id: 'web',
			title: 'Web',
			extendedTitle: 'Web Development',
			description: 'Modern web applications built with cutting-edge technologies. Specializing in responsive design, progressive web apps, and interactive experiences.'
		},
		{
			id: 'ai',
			title: 'AI',
			extendedTitle: 'AI Solutions',
			description: 'Custom AI solutions including machine learning models, natural language processing, and intelligent automation systems.'
		},
		{
			id: 'design',
			title: 'Design',
			extendedTitle: 'UI/UX Design',
			description: 'User-centered design solutions focusing on intuitive interfaces, engaging user experiences, and beautiful visual aesthetics.'
		},
		{
			id: 'cloud',
			title: 'Cloud',
			extendedTitle: 'Cloud Infrastructure',
			description: 'Scalable cloud infrastructure and serverless solutions using AWS, Azure, or Google Cloud Platform.'
		}
	];

	let submitting = $state(false);
	let message = $state(null);
</script>

<main>
	<ReactiveCursor />
	<section class="hero chevron-top">
		<div class="section-content scroll-fade-block">
			<h1>ACM Cloud Consulting</h1>
			<p class="tagline">Student-led solutions for real-world challenges</p>
		</div>
	</section>

	<section class="services chevron-top-and-bottom">
		<div class="section-content scroll-fade-block">
			<h2>Our Services</h2>
			<div class="services-layout">
				<div class="service-list">
					{#each services as service}
						<div
							class="service-card {selectedService === service.id ? 'active' : ''}"
							onclick={() => toggleService(service.id)}
							onkeydown={(e) => e.key === 'Enter' && toggleService(service.id)}
							role="button"
							tabindex="0"
							data-cursor={service.extendedTitle}
						>
							<div class="service-icon">
								{#if service.id === 'web'}
									<Globe size={24} />
								{:else if service.id === 'ai'}
									<Brain size={24} />
								{:else if service.id === 'design'}
									<Palette size={24} />
								{:else if service.id === 'cloud'}
									<Cloud size={24} />
								{/if}
							</div>
							<h3>{service.title}</h3>
						</div>
					{/each}
				</div>
				<div class="service-detail">
					{#key selectedService}
						<div class="detail-content" in:fade>
							<h3>{services.find(s => s.id === selectedService)?.title}</h3>
							<p>{services.find(s => s.id === selectedService)?.description}</p>
						</div>
					{/key}
				</div>
			</div>
		</div>
	</section>

	<section class="contact chevron-bottom">
		<div class="section-content scroll-fade-block">
			<h2 class="scroll-section">Get In Touch</h2>
			<div class="form-container">
				<form
					class="contact-form"
					action={`${apiUrl}/leads`}
					method="POST"
					use:enhance={() => {
						submitting = true;
						return async ({ result }) => {
							submitting = false;
							if (result.type === 'success') {
								message = 'success';
							} else {
								message = 'error';
							}
						};
					}}
				>
					<input class="scroll-section" name="name" type="text" placeholder="Name" required />
					<input class="scroll-section" name="company" type="text" placeholder="Company" required />
					<input class="scroll-section" name="email" type="email" placeholder="Email" required />
					<textarea
						class="scroll-section"
						name="message"
						placeholder="how can we help you?"
						rows="4"
						required
					></textarea>
					<button class="scroll-section" type="submit" disabled={submitting}>
						{submitting ? 'Sending...' : 'Send Message'}
					</button>
				</form>
				{#if message === 'error'}
					<div class="success-overlay" transition:fade>
						<button class="back-button" onclick={() => message = null}>
							<ArrowLeft size={34} />
						</button>
						<h1>Thanks for reaching out!</h1>
					</div>
				{/if}
			</div>
		</div>
	</section>
</main>

<style>
	:global(body) {
		overflow-x: hidden;
		overscroll-behavior: none; /* Prevent bounce/rubber-band effect */
	}
	main {
		min-height: 100vh;
		margin: -20px;
		overflow-x: hidden;
		background-color: #ede4dc;
		background-image:
			/* Radial gradient overlay to fade out the grid */
			radial-gradient(
				circle at center,
				rgba(255, 255, 255, 1) 0%,
				rgba(255, 255, 255, 0.9) 20%,
				rgba(255, 255, 255, 0) 100%
			),
			/* Vertical lines */
				linear-gradient(to right, rgba(145, 145, 145, 0.636) 1px, transparent 1px),
			/* Horizontal lines */
				linear-gradient(to bottom, rgba(200, 200, 200, 0.469) 1px, transparent 1px);
		background-size:
			150% 150%,
			30px 30px,
			30px 30px;
		background-position:
			center center,
			0 0,
			0 0;
		background-attachment: fixed; /* Prevent background from scrolling */
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100vh;
	}

	section {
		height: 90vh;
		width: 120%;
		/* max-width: 1200px; */
		/* padding: 4rem 2rem; */
	}

	/* Add a container inside each section for content width control */
	.section-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 4rem 2rem;
	}

	.hero {
		text-align: center;
		min-height: 90vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.chevron-top {
		clip-path: polygon(0 0, 100% 0, 100% calc(100% - 50px), 50% 100%, 0 calc(100% - 50px));
	}
	.chevron-bottom {
		clip-path: polygon(0 0, 50% 50px, 100% 0, 100% 100%, 0 100%);
		margin-top: -40px;
	}

	.chevron-top-and-bottom {
		clip-path: polygon(
			0 0,
			/* top left */ 50% 50px,
			/* top middle point */ 100% 0,
			/* top right */ 100% calc(100% - 50px),
			/* bottom right */ 50% 100%,
			/* bottom middle point */ 0 calc(100% - 50px) /* bottom left */
		);
		margin-top: -40px; /* Adjust overlap as needed */
	}

	h1 {
		font-size: 4rem;
		color: #2d3748;
		margin-bottom: 1rem;
	}

	.tagline {
		font-size: 1.5rem;
		color: #4a5568;
	}

	.services {
		background-color: #4f95f044;
	}

	h2 {
		text-align: center;
		font-size: 2.5rem;
		margin-bottom: 2rem;
	}

	.services-layout {
		display: grid;
		grid-template-columns: 250px 1fr;
		gap: 2rem;
		padding: 2rem;
		max-width: 900px;
		margin: 0 auto;
	}

	.service-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.service-card {
		background: white;
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.service-card.active {
		background: #2d3748;
		color: white;
		transform: translateX(10px);
	}

	.service-icon {
		font-size: 1.5rem;
	}

	.service-card h3 {
		margin: 0;
		font-size: 1.2rem;
	}

	.service-detail {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		min-height: 250px;
	}

	.detail-content h3 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.detail-content p {
		line-height: 1.6;
		color: #4a5568;
	}

	.contact {
		height: 80vh;
		margin-bottom: 0;
		padding-bottom: 0;
		background-image: linear-gradient(to bottom, #fffdf75a, #e086195a);
	}

	.contact-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 600px;
		margin: 0 auto;
	}

	input,
	textarea {
		padding: 0.75rem;
		border: 1px solid #e2e8f0;
		border-radius: 4px;
		font-size: 1rem;
	}

	button {
		background-color: #2d3748;
		color: white;
		padding: 1rem 2rem;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	button:hover {
		background-color: #1a202c;
	}

	@media (max-width: 768px) {
		h1 {
			font-size: 2.5rem;
		}

		.tagline {
			font-size: 1.25rem;
		}

		.services-layout {
			grid-template-columns: 1fr;
		}

		.service-card.active {
			transform: translateX(0);
		}
	}

	.form-container {
		position: relative;
	}

	.success-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: radial-gradient(
			circle at center,
			rgba(255, 255, 255, 0.95),
			rgba(180, 180, 183, 0.056)
		);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		color: #2d3748;
	}

	.back-button {
		position: absolute;
		top: 20%;
		left: 15%;
		color: #2d3748;
		background: none;
		border: none;
		cursor: pointer;
		padding: 1rem;
		transition: opacity 0.2s;
	}

	.back-button:hover {
		background-color: #2d374800;
	}
</style>

