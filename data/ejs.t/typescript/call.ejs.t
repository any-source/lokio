/**
 * @author lokio
 * @generated at <%= created_at %>
 */


import { ApiClient } from "@/server/clients/hono.client";
<% if (isQuery) { %>
import { OnError, type ErrorResponse } from "@/utils/asert_error";
import { useQuery } from "@tanstack/react-query";
<% } else { %>
import type <%= name %>Schema from "@/server/schemas/<%= name %>_schema";
import { useMutation } from "@tanstack/react-query";
import type { z } from "zod";
import { type ErrorResponse, OnError } from "@/utils/asert_error";
<% } %>

<% if (isQuery) { %>
const queryFn = async () => {
	try {
		const client = await ApiClient();
		const r = await client.api.ex.$get();
		if (!r.ok) {
			const err: ErrorResponse = await r.json();
			const error = OnError(err);
			throw new Error(`Ups : ${error}`);
		}
		const data = await r.json();
		return data.results;
	} catch (error) {
		const er = error instanceof Error ? error.message : String(error);
		throw new Error(er);
	}
};

const Call<%= Name %> = () => {
	return useQuery({
		queryKey: ["<%= name %>"],
		queryFn,
		retry: 1,
	});
};
<% } else { %>
const mutationFn = async (data: z.infer<typeof <%= name %>Schema>) => {
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

const Call<%= Name %> = () => {
	return useMutation({
		mutationKey: ["<%= name %>"],
		mutationFn,
	});
};
<% } %>

export default Call<%= Name %>;