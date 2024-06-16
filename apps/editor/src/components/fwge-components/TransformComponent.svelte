<script lang="ts">
	import type { Vector3 } from '@fwge/common';
	import type { Transform } from '@fwge/core';
	import { ButtonGroup, InputAddon, Label, NumberInput } from 'flowbite-svelte';

	export let component: Transform;

	type TransformProperty = 'position' | 'rotation' | 'scale';
	type TransformAxis = 'x' | 'y' | 'z';
	let step: number = 0;

	function enableScrolling(event: MouseEvent): void {
        const input = (event.target as HTMLInputElement)!;

        input.focus({ preventScroll: true });
		input.addEventListener('wheel', scroll);

        window.addEventListener('keydown', setScrollStep);
        window.addEventListener('keyup', resetScrollStep);
        
        step = 1;
	}
    
	function disableScrolling(event: MouseEvent): void {
        const input = (event.target as HTMLInputElement)!;

        input.blur();
        input.removeEventListener('wheel', scroll);

        window.removeEventListener('keydown', setScrollStep);
        window.removeEventListener('keyup', resetScrollStep);
        
        step = 0;
	}

	function setScrollStep(event: KeyboardEvent): void {
        if (event.ctrlKey) {
            step = 10;
        } else if (event.shiftKey) {
            step = 0.1;
        }
	}

	function resetScrollStep(): void {
        step = 1;
	}

	function scroll(event: Event): void {
		const [propertyName, axis] = (event.target as any).name.split('-') as [
			TransformProperty,
			TransformAxis
		];
		const up = (event as WheelEvent).deltaY < 0;

		let property: Vector3;

		switch (propertyName) {
			case 'position':
				property = component.Position;
				break;

			case 'rotation':
				property = component.Rotation;
				break;

			case 'scale':
				property = component.Scale;
				break;
		}

		switch (axis) {
			case 'x':
				property.X += up ? step : -step;
				(event.target! as HTMLInputElement).value = property.X + '';
				break;

			case 'y':
				property.Y += up ? step : -step;
				(event.target! as HTMLInputElement).value = property.Y + '';
				break;

			case 'z':
				property.Z += up ? step : -step;
				(event.target! as HTMLInputElement).value = property.Z + '';
				break;
		}
	}
</script>

<div>
	<Label>
		<span>Transform</span>

		<ButtonGroup size="sm">
			<InputAddon class="w-16">Position</InputAddon>
			<NumberInput
				label="X"
				name="position-x"
				on:mouseenter={enableScrolling}
				on:mouseleave={disableScrolling}
				bind:value={component.Position.X}
			/>
			<NumberInput
				label="Y"
				name="position-y"
				on:mouseenter={enableScrolling}
				on:mouseleave={disableScrolling}
				bind:value={component.Position.Y}
			/>
			<NumberInput
				label="Z"
				name="position-z"
				on:mouseenter={enableScrolling}
				on:mouseleave={disableScrolling}
				bind:value={component.Position.Z}
			/>
		</ButtonGroup>

		<ButtonGroup size="sm">
			<InputAddon class="w-16">Rotation</InputAddon>
			<NumberInput
				label="X"
				name="rotation-x"
				on:mouseenter={enableScrolling}
				on:mouseleave={disableScrolling}
				bind:value={component.Rotation.X}
			/>
			<NumberInput
				label="Y"
				name="rotation-y"
				on:mouseenter={enableScrolling}
				on:mouseleave={disableScrolling}
				bind:value={component.Rotation.Y}
			/>
			<NumberInput
				label="Z"
				name="rotation-z"
				on:mouseenter={enableScrolling}
				on:mouseleave={disableScrolling}
				bind:value={component.Rotation.Z}
			/>
		</ButtonGroup>

		<ButtonGroup size="sm">
			<InputAddon class="w-16">Scale</InputAddon>
			<NumberInput
				label="X"
				name="scale-x"
				on:mouseenter={enableScrolling}
				on:mouseleave={disableScrolling}
				bind:value={component.Scale.X}
			/>
			<NumberInput
				label="Y"
				name="scale-y"
				on:mouseenter={enableScrolling}
				on:mouseleave={disableScrolling}
				bind:value={component.Scale.Y}
			/>
			<NumberInput
				label="Z"
				name="scale-z"
				on:mouseenter={enableScrolling}
				on:mouseleave={disableScrolling}
				bind:value={component.Scale.Z}
			/>
		</ButtonGroup>
	</Label>
</div>
