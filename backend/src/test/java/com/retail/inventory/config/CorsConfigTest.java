package com.retail.inventory.config;

import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.filter.CorsFilter;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CorsConfigTest {
    private final CorsConfig config = new CorsConfig();

    @Test
    void permitsGetFromExactConfiguredVercelOrigin() throws Exception {
        CorsFilter filter = config.corsFilter("https://frontend-eight-tau-65.vercel.app", "");
        MockHttpServletRequest request = request("GET", "https://frontend-eight-tau-65.vercel.app");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, new MockFilterChain());

        assertEquals(HttpServletResponse.SC_OK, response.getStatus());
        assertEquals("https://frontend-eight-tau-65.vercel.app", response.getHeader("Access-Control-Allow-Origin"));
    }

    @Test
    void permitsVercelOptionsPreflightAndGetMethod() throws Exception {
        CorsFilter filter = config.corsFilter("", "https://*.vercel.app");
        MockHttpServletRequest request = request("OPTIONS", "https://retail-ui.vercel.app");
        request.addHeader("Access-Control-Request-Method", "GET");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, new MockFilterChain());

        assertEquals(HttpServletResponse.SC_OK, response.getStatus());
        assertEquals("https://retail-ui.vercel.app", response.getHeader("Access-Control-Allow-Origin"));
        assertEquals("GET,POST,PUT,PATCH,DELETE,OPTIONS", response.getHeader("Access-Control-Allow-Methods"));
    }

    @Test
    void rejectsUnknownOrigin() throws Exception {
        CorsFilter filter = config.corsFilter("https://retail.example.vercel.app", "");
        MockHttpServletRequest request = request("GET", "https://untrusted.example");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, new MockFilterChain());

        assertEquals(HttpServletResponse.SC_FORBIDDEN, response.getStatus());
    }

    @Test
    void addsCorsHeadersWhenApplicationReturnsAnError() throws Exception {
        CorsFilter filter = config.corsFilter("https://frontend-eight-tau-65.vercel.app", "");
        MockHttpServletRequest request = request("GET", "https://frontend-eight-tau-65.vercel.app");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, (servletRequest, servletResponse) ->
                ((HttpServletResponse) servletResponse).sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR));

        assertEquals(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, response.getStatus());
        assertEquals("https://frontend-eight-tau-65.vercel.app", response.getHeader("Access-Control-Allow-Origin"));
    }

    private MockHttpServletRequest request(String method, String origin) {
        MockHttpServletRequest request = new MockHttpServletRequest(method, "/api/v1/system/status");
        request.addHeader("Origin", origin);
        return request;
    }
}
