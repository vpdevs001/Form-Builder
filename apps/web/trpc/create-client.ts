import { httpLink, httpBatchStreamLink } from "@repo/trpc/client";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  return c({
    url: env.NEXT_PUBLIC_API_URL ?? "/trpc",
    fetch(url, options) {
      return fetch(url, {
        ...options,
        credentials: "include",
      }).then(async (res) => {
        if (!res.ok) {
          let body: unknown = "<unreadable>";
          try {
            const text = await res.clone().text();
            try {
              body = JSON.parse(text);
            } catch {
              body = text;
            }
          } catch (err) {
            // ignore
          }
          // Log useful diagnostics to the browser console for investigation
          // eslint-disable-next-line no-console
          console.error("trpc fetch non-OK response", { url, status: res.status, body });
        }
        return res;
      });
    },
  });
};
