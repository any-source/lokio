/**
 * @author lokio
 * @generated at <%= created_at %>
 */

import type { Context } from "hono";

type MiddlewareOptions = {
    // Define your middleware options here
    exampleOption?: string;
};

const <%= name %>Middleware = (options?: MiddlewareOptions) => {
    return async (c: Context, next: () => Promise<void>) => {
        // Middleware logic goes here
        if (options?.exampleOption) {
            console.log("Example option:", options.exampleOption);
        }

        // Example: Set a custom header
        c.header("X-Middleware-<%= name %>", "true");

        // Continue to the next middleware or handler
        await next();
    };
};

export default <%= name %>Middleware;