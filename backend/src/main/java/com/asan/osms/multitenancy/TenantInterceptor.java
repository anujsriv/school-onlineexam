package com.asan.osms.multitenancy;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

@Component
public class TenantInterceptor extends HandlerInterceptorAdapter {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
    	String requestURI = request.getRequestURI();
    	String tenantID = null;
    	String videoAppId = null;
    	
    	if (requestURI.contains("/api")) {
    		tenantID = request.getHeader("X-TenantID");
    		videoAppId = request.getHeader("X-VideoAppID");
            
            if (requestURI.equalsIgnoreCase("/api/schools/")) {
            	tenantID = "osms_common";
            }
            
            if (tenantID == null) {
                response.getWriter().write("X-TenantID not present in the Request Header");
                response.setStatus(400);
                return false;
            }
            
            TenantContext.setCurrentTenant(tenantID);
            TenantContext.setCurrentVideoApp(videoAppId);
    	}
        
        return true;
    }

    @Override
    public void postHandle(
            HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView)
            throws Exception {
        TenantContext.clear();
    }
}
