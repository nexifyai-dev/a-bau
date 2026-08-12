/**
 * JSON-LD-Helfer: escaped `<` zu `\u003c`, damit kein HTML-Injektionsvektor
 * über dangerouslySetInnerHTML entsteht (Review P2-29).
 */
export const ld = (o: unknown) => JSON.stringify(o).replace(/</g, "\\u003c");
