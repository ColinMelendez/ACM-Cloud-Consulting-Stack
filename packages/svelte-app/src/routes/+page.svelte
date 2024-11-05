<script>
	import { fade } from 'svelte/transition';
    const apiUrl = import.meta.env.VITE_API_URL;
</script>

<main in:fade>
	<section class="hero">
		<h1>UCLA ACM Consulting</h1>
        <p>API URL: {apiUrl}</p>
		<p class="tagline">Student-led solutions for real-world challenges</p>
	</section>

	<section class="services">
		<h2>Our Services</h2>
		<div class="service-grid">
			<div class="service-card">
				<h3>Web Development</h3>
				<p>Custom websites and web applications built with modern technologies</p>
			</div>
			<div class="service-card">
				<h3>Mobile Apps</h3>
				<p>Native and cross-platform mobile applications</p>
			</div>
			<div class="service-card">
				<h3>Technical Consulting</h3>
				<p>Expert advice on software architecture and technology solutions</p>
			</div>
		</div>
	</section>

	<section class="contact">
		<h2>Get In Touch</h2>
		<form class="contact-form">
			<input type="text" placeholder="Name" required>
			<input type="text" placeholder="Company" required>
			<input type="email" placeholder="Email" required>
			<textarea placeholder="Tell us about your project" rows="4" required></textarea>
			<button type="submit">Send Message</button>
		</form>
	</section>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100vh;
	}

	section {
		width: 100%;
		max-width: 1200px;
		padding: 4rem 2rem;
	}

	.hero {
		text-align: center;
		min-height: 60vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	h1 {
		font-size: 3.5rem;
		color: #2d3748;
		margin-bottom: 1rem;
	}

	.tagline {
		font-size: 1.5rem;
		color: #4a5568;
	}

	.services {
		background-color: #f7fafc;
	}

	h2 {
		text-align: center;
		font-size: 2.5rem;
		margin-bottom: 2rem;
	}

	.service-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
	}

	.service-card {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}

	.service-card h3 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}

	.contact-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 600px;
		margin: 0 auto;
	}

	input, textarea {
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
	}
</style>
