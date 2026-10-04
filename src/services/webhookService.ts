/**
 * Service to send complaint data to n8n webhook after successful Firebase save.
 */

export interface N8nWebhookPayload {
  complaintId: string;
  issueType: string;
  description: string;
  location: string;
  priority: string;
  status: string;
}

export const N8N_WEBHOOK_URL = 'https://vinnie1919.app.n8n.cloud/webhook-test/jalrakshak-complaint';

/**
 * Sends complaint data to n8n webhook via HTTP POST with JSON body.
 * Logs whether the request succeeded or failed.
 * Does not throw or interfere with Firebase complaint persistence.
 */
export async function sendComplaintToN8nWebhook(payload: N8nWebhookPayload): Promise<void> {
  const bodyData = {
    complaintId: payload.complaintId,
    issueType: payload.issueType,
    description: payload.description,
    location: payload.location,
    priority: payload.priority,
    status: payload.status,
  };

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    if (response.ok) {
      console.log('[n8n Webhook] Request succeeded:', response.status);
    } else {
      console.log(`[n8n Webhook] Request failed with HTTP status: ${response.status} (${response.statusText})`);
    }
  } catch (error: any) {
    console.log('[n8n Webhook] Direct request failed with network error:', error?.message || error);
    // Fallback to server proxy to bypass any browser CORS restrictions
    try {
      const proxyUrl = typeof window !== 'undefined' ? '/api/n8n-webhook' : 'http://localhost:3000/api/n8n-webhook';
      const proxyResponse = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      if (proxyResponse.ok) {
        console.log('[n8n Webhook] Request succeeded via proxy:', proxyResponse.status);
      } else {
        console.log(`[n8n Webhook] Request failed via proxy with HTTP status: ${proxyResponse.status}`);
      }
    } catch (proxyError: any) {
      console.log('[n8n Webhook] Request failed (both direct and proxy):', proxyError?.message || proxyError);
    }
  }
}
