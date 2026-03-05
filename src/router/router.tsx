/**
 * @file Router instance — uses createBrowserRouter for data routing.
 */
import { createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';

export const router = createBrowserRouter(routes);
