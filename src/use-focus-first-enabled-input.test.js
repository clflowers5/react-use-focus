//@ts-nocheck
import React, { useRef } from 'react';
import { cleanup, render, waitFor } from '@testing-library/react';
import useFocusFirstEnabledInput from './use-focus-first-enabled-input';

describe('useFocusFirstEnabledInput', () => {
	function DummyComponent({ textDisabled, numberDisabled, setCursorToEnd, value }) {
		const containerRef = useRef();
		useFocusFirstEnabledInput({
			containerRef,
			setCursorToEnd,
		});

		return (
			<div ref={containerRef}>
				<input id="not-me" tabIndex="-1"/>

				<label htmlFor="text-input">Text</label>
				<input
					id="text-input"
					disabled={textDisabled}
					type="text"
					value={value}
					onChange={() => {
					}}
				/>

				<label htmlFor="number-input">Number</label>
				<input
					id="number-input"
					disabled={numberDisabled}
					type="number"
				/>
			</div>
		);
	}

	afterEach(cleanup);

	it('focuses the first enabled element with non-negative tabindex within the component when enabled', async () => {
		const { getByLabelText } = render(<DummyComponent textDisabled={false} numberDisabled={false}/>);
		const expectedFocusedInput = getByLabelText(/text/i);
		await waitFor(() => expect(document.activeElement).toEqual(expectedFocusedInput));
	});

	it('focuses the second element when the first is disabled', async () => {
		const { getByLabelText } = render(<DummyComponent textDisabled={true} numberDisabled={false}/>);
		const expectedFocusedInput = getByLabelText(/number/i);
		await waitFor(() => expect(document.activeElement).toEqual(expectedFocusedInput));
	});

	it('sets the cursor to the last position if `setCursorToEnd` is set to `true`', async () => {
		const { getByLabelText, rerender } = render(
			<DummyComponent
				setCursorToEnd={true}
				value="hello"
			/>,
		);
		let expectedFocusedInput = getByLabelText(/text/i);
		await waitFor(() => expect(document.activeElement).toEqual(expectedFocusedInput));
		expect(document.activeElement.selectionStart).toEqual(5); // length of `hello`

		rerender(
			<DummyComponent
				setCursorToEnd={true}
				value=""
			/>,
		);
		expectedFocusedInput = getByLabelText(/text/i);
		await waitFor(() => expect(document.activeElement).toEqual(expectedFocusedInput));
		expect(document.activeElement.selectionStart).toEqual(0); // length of empty string
	});
});
