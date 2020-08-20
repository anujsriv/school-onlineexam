package com.asan.osms.multitenancy;

public class TenantContext {
	private static ThreadLocal<String> currentTenant = new InheritableThreadLocal<>();
	private static ThreadLocal<String> currentVideoApp = new InheritableThreadLocal<>();

    public static void setCurrentTenant(String tenant) {
        currentTenant.set(tenant);
    }

    public static String getCurrentTenant() {
        return currentTenant.get();
    }

	public static String getCurrentVideoApp() {
		return currentVideoApp.get();
	}

	public static void setCurrentVideoApp(String videoApp) {
		currentVideoApp.set(videoApp);
	}
	
	public static void clear() {
        currentTenant.set(null);
        currentVideoApp.set(null);
    }
}
