import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        // Prefer server-only anon key; fall back to NEXT_PUBLIC for backward compatibility
        process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}

/**
 * Admin client that uses service role key to bypass RLS.
 * Only use this server-side for operations that need full access.
 * NEVER expose the service role key to the client.
 */
export function createAdminClient() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )
}

// Cache for service account access token (in-memory, resets on server restart)
let serviceAccountToken: { access_token: string; expires_at: number } | null = null;

/**
 * Creates an authenticated client using a service account.
 * This automatically signs in as a service account user server-side,
 * so RLS policies still apply but the request is authenticated.
 * 
 * The service account email should be set in SUPABASE_SERVICE_ACCOUNT_EMAIL
 * and SUPABASE_SERVICE_ACCOUNT_PASSWORD environment variables.
 * 
 * Uses token caching to avoid creating a new session on every request.
 */
export async function createAuthenticatedServiceClient() {
    const adminClient = createAdminClient();

    // Get or create service account user
    const serviceEmail = process.env.SUPABASE_SERVICE_ACCOUNT_EMAIL || 'service@photos.rashodkorala.com';
    const servicePassword = process.env.SUPABASE_SERVICE_ACCOUNT_PASSWORD!;

    if (!servicePassword) {
        throw new Error('SUPABASE_SERVICE_ACCOUNT_PASSWORD environment variable is required');
    }

    // Check if we have a valid cached token (refresh if expires in less than 5 minutes)
    const now = Math.floor(Date.now() / 1000);
    if (serviceAccountToken && serviceAccountToken.expires_at > now + 300) {
        // Use cached token - create client with the token directly
        return createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${serviceAccountToken.access_token}`,
                    },
                },
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );
    }

    // Try to sign in as service account
    let signInData;
    let signInError;

    try {
        const result = await adminClient.auth.signInWithPassword({
            email: serviceEmail,
            password: servicePassword,
        });
        signInData = result.data;
        signInError = result.error;
    } catch (error) {
        signInError = error as Error;
    }

    // If sign in fails, create the service account user
    if (signInError || !signInData?.user) {
        const { error: createError } = await adminClient.auth.admin.createUser({
            email: serviceEmail,
            password: servicePassword,
            email_confirm: true,
            user_metadata: {
                name: 'Service Account',
                role: 'service_account'
            }
        });

        if (createError) {
            console.error('Error creating service account:', createError);
            throw createError;
        }

        // Sign in with the newly created user
        const { data: newSignInData, error: newSignInError } = await adminClient.auth.signInWithPassword({
            email: serviceEmail,
            password: servicePassword,
        });

        if (newSignInError || !newSignInData.session) {
            console.error('Error signing in with service account:', newSignInError);
            throw newSignInError || new Error('Failed to create session');
        }

        signInData = newSignInData;
    }

    if (!signInData.session) {
        throw new Error('Failed to obtain service account session');
    }

    // Cache the token (decode JWT to get expiration, or use 1 hour default)
    try {
        const tokenParts = signInData.session.access_token.split('.');
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        serviceAccountToken = {
            access_token: signInData.session.access_token,
            expires_at: payload.exp || Math.floor(Date.now() / 1000) + 3600,
        };
    } catch {
        // Fallback: cache for 1 hour if we can't decode
        serviceAccountToken = {
            access_token: signInData.session.access_token,
            expires_at: Math.floor(Date.now() / 1000) + 3600,
        };
    }

    // Create client with the token
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${serviceAccountToken.access_token}`,
                },
            },
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}