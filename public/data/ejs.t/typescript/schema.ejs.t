/**
 * @author lokio
 * @generated at <%= created_at %>
 */


import { z } from "zod";
const <%= name %>Schema = z.object({
	example: z.string(),
});
export type <%= name %>Schema = z.infer<typeof <%= name %>Schema>;
export default <%= name %>Schema;
