import { useLayoutEffect } from 'react';

// focus inputs that are tabbable (don't have a negative tabindex)
export const DEFAULT_QUERY = `input:not([tabindex^="-"])`;

function focusFirstEmptyInput({
	containerRef,
	fallbackToFirstEnabled = false,
	query = DEFAULT_QUERY,
}) {
	setTimeout(() => {
		if (containerRef && containerRef.current) {
			const inputs = [...containerRef.current.querySelectorAll(query)];
			const firstEmptyElement = inputs.find(element => element && !element.value && !element.disabled);
			if (firstEmptyElement && typeof firstEmptyElement.focus === 'function') {
				firstEmptyElement.focus();
			} else if (fallbackToFirstEnabled === true) {
				const firstEnabledInput = inputs.find(element => element && !element.disabled);
				if (firstEnabledInput && typeof firstEnabledInput.focus === 'function') {
					firstEnabledInput.focus();
				}
			}
		}
	}, 0);
}

function useFocusFirstEmptyInput({
	containerRef,
	fallbackToFirstEnabled = false,
	query = DEFAULT_QUERY,
}) {
	useLayoutEffect(() => focusFirstEmptyInput({
		containerRef,
		query,
		fallbackToFirstEnabled,
	}), [containerRef, fallbackToFirstEnabled, query]);
}

export {
	useFocusFirstEmptyInput as default,
	focusFirstEmptyInput,
};
