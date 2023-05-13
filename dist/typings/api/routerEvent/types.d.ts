import { Router } from '../router/Router';
export type RouteInfo = [
    {
        path: string;
        hash: boolean;
    },
    PopStateEvent,
    Router
];
