/**
 * @author lokio
 * @generated at <%= created_at %>
 */
import type { Context } from "hono";

const <%= Name %>Controller = async (c: Context) => {
    try {
        return c.json(
            {
                message: "Success",
                results: null
            },
            200,
        );
    } catch (error) {
        return c.json(
            {
                message: "Error",
                results: error,
            },
            500,
        );
    }
};

export default <%= Name %>Controller;
