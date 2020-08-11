import React, { useRef } from 'react';
import { cleanup, render, waitFor, wait } from '@testing-library/react';
import useFocusFirstEmptyInput from './use-focus-first-empty-input';

describe('useFocusFirstEmptyInput', () => {
	// eslint-disable-next-line react/prop-types
	function DummyComponent({ textValue, numberValue }) {
		const containerRef = useRef();
		useFocusFirstEmptyInput({ containerRef });

		return (
			<div ref={containerRef}>
				<input id="not-me" tabIndex="-1" />

				<label htmlFor="text-input">Text</label>
				<input
					id="text-input"
					readOnly={true}
					type="text"
					value={textValue}
				/>

				<label htmlFor="number-input">Number</label>
				<input
					id="number-input"
					readOnly={true}
					type="number"
					value={numberValue}
				/>
			</div>
		);
	}

	afterEach(cleanup);

	it('focuses the first empty input with non-negative tabindex within the component when its value is empty', async () => {
		const { getByLabelText } = render(<DummyComponent/>);
		const expectedFocusedInput = getByLabelText(/text/i);
    await waitFor(() => expect(document.activeElement).toEqual(expectedFocusedInput));
	});

	it('focuses the second element when the first input has a value', async () => {
		const { getByLabelText } = render(<DummyComponent textValue="foo"/>);
		const expectedFocusedInput = getByLabelText(/number/i);
		await waitFor(() => expect(document.activeElement).toEqual(expectedFocusedInput));
	});
});
