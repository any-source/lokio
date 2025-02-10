/**
 * @author lokio
 * @generated at 2025-02-10T08:28:55.889Z
 */


import { ApiClient } from "@/server/clients/hono.client";

import type asdSchema from "@/server/schemas/asd_schema";
import { useMutation } from "@tanstack/react-query";
import type { z } from "zod";
import { type ErrorResponse, OnError } from "@/utils/asert_error";



const mutationFn = async (data: z.infer<typeof asdSchema>) => {
	try {
		const client = await ApiClient();
		const r = await client.api.ex.$post({
			json: data,
		});
		if (!r.ok) {
			const err: ErrorResponse = await r.json();
			const error = OnError(err);
			throw new Error(`Ups : ${error}`);
		}
		const resp = await r.json();
		return resp;
	} catch (error) {
		const er = error instanceof Error ? error.message : String(error);
		throw new Error(er);
	}
};

const CallAsd = () => {
	return useMutation({
		mutationKey: ["asd"],
		mutationFn,
	});
};


export default CallAsd;