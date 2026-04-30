// Wrapper for base64-js to provide default export
import * as base64 from 'base64-js';

export const toByteArray = base64.toByteArray;
export const fromByteArray = base64.fromByteArray;
export default base64;