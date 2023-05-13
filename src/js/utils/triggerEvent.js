/**
 * Function to trigger custom event
 * @param {HTMLElement} context Context element
 * @param {string} eventType Event type
 * @param {any[]} data Data to be passed to handler
 */
export function trigger(context, eventType, data) {
  context.dispatchEvent(
    new CustomEvent(eventType, {
      bubbles: true,
      cancelable: true,
      detail: data || [],
    })
  );
}
