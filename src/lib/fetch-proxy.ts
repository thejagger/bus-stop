/**
 * Fetch proxy interceptor for ZET API
 * Routes requests to api.zet.hr through Vite's proxy to avoid CORS issues
 */

const originalFetch = window.fetch;
const OriginalXMLHttpRequest = window.XMLHttpRequest;

/**
 * Initialize fetch and XMLHttpRequest proxy for development
 * Intercepts requests to api.zet.hr and routes them through /zet-api proxy
 */
export function setupFetchProxy() {
  if (import.meta.env.DEV) {
    // Intercept fetch
    window.fetch = async function (
      input: RequestInfo | URL,
      init?: RequestInit
    ): Promise<Response> {
      let url: string;

      if (typeof input === "string") {
        url = input;
      } else if (input instanceof URL) {
        url = input.toString();
      } else {
        url = input.url;
      }

      // Check if the request is to api.zet.hr
      if (url.includes("api.zet.hr")) {
        // Replace api.zet.hr with /zet-api proxy endpoint
        const proxyUrl = url.replace(/https?:\/\/api\.zet\.hr/g, "/zet-api");

        // Create new request with proxy URL
        if (typeof input === "string") {
          return originalFetch(proxyUrl, init);
        } else if (input instanceof URL) {
          return originalFetch(new URL(proxyUrl, window.location.origin), init);
        } else {
          const newRequest = new Request(proxyUrl, {
            method: input.method,
            headers: input.headers,
            body: input.body,
            mode: input.mode,
            credentials: input.credentials,
            cache: input.cache,
            redirect: input.redirect,
            referrer: input.referrer,
            integrity: input.integrity,
          });
          return originalFetch(newRequest, init);
        }
      }

      // For all other requests, use original fetch
      return originalFetch(input, init);
    };

    // Intercept XMLHttpRequest
    window.XMLHttpRequest = class extends OriginalXMLHttpRequest {
      open(
        method: string,
        url: string | URL,
        async?: boolean,
        username?: string | null,
        password?: string | null
      ): void {
        const urlString = typeof url === "string" ? url : url.toString();

        // Check if the request is to api.zet.hr
        if (urlString.includes("api.zet.hr")) {
          // Replace api.zet.hr with /zet-api proxy endpoint
          const proxyUrl = urlString.replace(
            /https?:\/\/api\.zet\.hr/g,
            "/zet-api"
          );
          super.open(method, proxyUrl, async ?? true, username, password);
        } else {
          super.open(method, url, async ?? true, username, password);
        }
      }
    } as typeof XMLHttpRequest;
  }
}
