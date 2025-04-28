export const META_API_TOKEN = process.env.WHATSAPP_API_TOKEN || 'YOUR_PERMANENT_ACCESS_TOKEN_HERE';

// The Phone Number ID associated with the number sending messages
export const SENDER_PHONE_NUMBER_ID = process.env.WHATSAPP_SENDER_ID || 'YOUR_SENDER_PHONE_NUMBER_ID_HERE';

// The Meta Graph API version to use (check for latest stable version)
export const META_API_VERSION = process.env.WHATSAPP_API_VERSION || 'v19.0';

// Your secret token used to verify webhook requests from Meta
export const WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'YOUR_SECRET_WEBHOOK_VERIFY_TOKEN_HERE';

// The keyword that triggers saving incoming messages (case-insensitive check)
export const INCOMING_KEYWORD = process.env.WHATSAPP_KEYWORD || '#feedback';


// --- Validation (Optional but Recommended) ---
// Basic check to warn if critical secrets are using default placeholders
if (META_API_TOKEN === 'YOUR_PERMANENT_ACCESS_TOKEN_HERE' ||
    SENDER_PHONE_NUMBER_ID === 'YOUR_SENDER_PHONE_NUMBER_ID_HERE' ||
    WEBHOOK_VERIFY_TOKEN === 'YOUR_SECRET_WEBHOOK_VERIFY_TOKEN_HERE') {
    console.warn('--- WARNING: One or more critical WhatsApp API credentials are using default placeholder values. Ensure they are set correctly via environment variables. ---');
}
