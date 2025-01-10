<script context="module" lang="ts">
	import { writable } from 'svelte/store';
	import { Spring } from 'svelte/motion';
	import { scale } from 'svelte/transition';

	const coords = new Spring(
		{ x: 0, y: 0 },
		{ stiffness: 1, damping: 1 }
	);

	const coordsOuter = new Spring(
		{ x: 0, y: 0 },
		{ stiffness: 0.1, damping: 0.7 }
	);

	function createCursorStore() {
		const { subscribe, update } = writable({ x: 0, y: 0, text: '' });

		return {
			subscribe,
			setText: (event: MouseEvent) => {
				const target = event.target as HTMLElement;
				return update((n) => ({ ...n, text: target?.getAttribute('data-cursor') || '' }));
			},
			clearText: () => update((n) => ({ ...n, text: '' })),
			setCoords: ({ x, y }: { x: number; y: number }) => {
				coords.target = { x, y };
				coordsOuter.target = { x, y };
				return update((n) => ({ ...n, x, y }));
			}
		};
	}

	const cursorStore = createCursorStore();

	export function useCursor() {
		// Only add mouse events if not on a touch device
		if (!('ontouchstart' in window)) {
			document.addEventListener('mousemove', (e: MouseEvent) =>
				cursorStore.setCoords({ x: e.clientX, y: e.clientY })
			);
			document.querySelectorAll('[data-cursor]').forEach((el) => {
				const target = el as HTMLElement;
				target.addEventListener('mouseenter', (e: MouseEvent) => cursorStore.setText(e));
				target.addEventListener('mouseleave', () => cursorStore.clearText());
			});
		}
	}
</script>

<script>
	import { onMount } from 'svelte';
	onMount(useCursor);
</script>

{#if $cursorStore.text.length > 1}
	<div
		class="cursor-tooltip"
		style="transform:translate3d({coords.current.x}px, {coords.current.y}px, 0px)"
	>
		<span in:scale={{ duration: 300, start: 0.7 }}>
			{$cursorStore.text}
		</span>
	</div>
{/if}

<style>
	.cursor-tooltip {
		position: fixed;
		left: 20px; /* offset from cursor */
		top: 20px; /* offset from cursor */
		background: #2d3748;
		color: white;
		padding: 8px 12px;
		border-radius: 4px;
		font-size: 14px;
		pointer-events: none;
		z-index: 1000;
		white-space: nowrap;
		box-shadow: 0 2px 8px rgba(0,0,0,0.15);
	}

	/* Optional: Add a small arrow pointing to the cursor */
	.cursor-tooltip::before {
		content: '';
		position: absolute;
		left: -4px;
		top: -4px;
		width: 8px;
		height: 8px;
		background: #2d3748;
		transform: rotate(45deg);
	}

	/* Remove the global cursor styles since we're not using them anymore */
	:global(body), :global(a) {
		cursor: default;
	}

	@media (hover: none) and (pointer: coarse) {
		.cursor-tooltip {
			display: none;
		}
	}
</style>
