package com.asan.osms.bo;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.HmacUtils;
import org.springframework.stereotype.Component;

@Component
public class GenerateVidyoIOTokenBO {
	
	public static final String PROVISION_TOKEN = "provision";
    private static final long EPOCH_SECONDS = 62167219200l;
    private static final String DELIM = "\0";


    public String generateProvisionToken(String key, String jid, String expires, String vcard) throws NumberFormatException {
        String payload = String.join(DELIM, PROVISION_TOKEN, jid, calculateExpiry(expires), vcard);
        return new String(Base64.encodeBase64(
                (String.join(DELIM, payload, HmacUtils.hmacSha384Hex(key, payload))).getBytes()
        ));
    }

    public String calculateExpiry(String expires) throws NumberFormatException {
        long expiresLong = 0l;
        long currentUnixTimestamp = System.currentTimeMillis() / 1000;
        expiresLong = Long.parseLong(expires);
        return ""+(EPOCH_SECONDS + currentUnixTimestamp + expiresLong);
    }
}
