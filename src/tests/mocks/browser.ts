/**
 * @file MSW browser worker — intercepts requests in the dev browser environment.
 *
 * Shares the same handlers as the Node test server so mock behaviour
 * is identical between browser dev mode and unit/integration tests.
 */
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
