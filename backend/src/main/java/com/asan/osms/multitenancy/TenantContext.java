package com.asan.osms.multitenancy;

public class TenantContext {
	private static ThreadLocal<String> currentTenant = new InheritableThreadLocal<>();

    public static void setCurrentTenant(String tenant) {
        currentTenant.set(tenant);
    }

    public static String getCurrentTenant() {
        return currentTenant.get();
    }

    public static void clear() {
        currentTenant.set(null);
    }
}
