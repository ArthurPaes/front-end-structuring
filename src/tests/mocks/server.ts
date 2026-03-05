/**
 * @file MSW server instance for Node.js (Vitest).
 *
 * For browser-based MSW (Storybook, dev), use setupWorker instead.
 */
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
