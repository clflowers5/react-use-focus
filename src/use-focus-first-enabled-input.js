import { useLayoutEffect } from 'react';

// focus inputs that are tabbable (don't have a negative tabindex)
export const DEFAULT_QUERY = `input:not([tabindex^="-"])`;

function focusFirstEnabledInput({
	containerRef,
	fallbackContainerRef,
	query = DEFAULT_QUERY,
	setCursorToEnd = false,
}) {
	setTimeout(() => {
		let hasFocused = false;

		if (containerRef && containerRef.current) {
			const inputs = [...containerRef.current.querySelectorAll(query)];
			const firstEnabledElement = inputs.find(element => element && !element.disabled);
			if (firstEnabledElement && typeof firstEnabledElement.focus === 'function') {
				firstEnabledElement.focus();
				hasFocused = true;

				if (setCursorToEnd) {
					const value = firstEnabledElement.value || '';
					const endPosition = value.length;
					firstEnabledElement.setSelectionRange(endPosition, endPosition);
				}
			}
		}

		if (!hasFocused && fallbackContainerRef) {
			focusFirstEnabledInput({
				containerRef: fallbackContainerRef,
				query,
				setCursorToEnd,
			});
		}
	}, 0);
}

function useFocusFirstEnabledInput({
	containerRef,
	fallbackContainerRef,
	query = DEFAULT_QUERY,
	setCursorToEnd = false,
}) {
	useLayoutEffect(() => focusFirstEnabledInput({
		containerRef,
		fallbackContainerRef,
		query,
		setCursorToEnd,
	}), [containerRef, fallbackContainerRef, query, setCursorToEnd]);
}

export {
	useFocusFirstEnabledInput as default,
	focusFirstEnabledInput,
};
