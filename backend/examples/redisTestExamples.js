/**
 * Redis Integration Test Examples
 * 
 * This file demonstrates how to test the Redis-integrated authentication system
 */

// Example 1: Register a new user (tokens stored in Redis)
const registerExample = {
  method: 'POST',
  url: 'http://localhost:8080/api/auth/register',
  headers: {
    'Content-Type': 'application/json'
  },
  body: {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Test123!',
    firstName: 'Test',
    lastName: 'User'
  }
};

// Example 2: Login (stores tokens in Redis, tracks failed attempts)
const loginExample = {
  method: 'POST',
  url: 'http://localhost:8080/api/auth/login',
  headers: {
    'Content-Type': 'application/json'
  },
  body: {
    email: 'test@example.com',
    password: 'Test123!'
  }
};

// Example 3: Access protected route (validates token against Redis)
const getMeExample = {
  method: 'GET',
  url: 'http://localhost:8080/api/auth/me',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN_HERE'
  }
};

// Example 4: Logout (invalidates token in Redis)
const logoutExample = {
  method: 'POST',
  url: 'http://localhost:8080/api/auth/logout',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN_HERE'
  }
};

// Example 5: Logout from all devices (invalidates ALL tokens in Redis)
const logoutAllExample = {
  method: 'POST',
  url: 'http://localhost:8080/api/auth/logout-all',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN_HERE'
  }
};

// Example 6: Refresh token (validates and rotates tokens in Redis)
const refreshTokenExample = {
  method: 'POST',
  url: 'http://localhost:8080/api/auth/refresh',
  headers: {
    'Content-Type': 'application/json'
  },
  body: {
    refreshToken: 'YOUR_REFRESH_TOKEN_HERE'
  }
};

// Example 7: Change password (invalidates all tokens in Redis)
const changePasswordExample = {
  method: 'PUT',
  url: 'http://localhost:8080/api/auth/change-password',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN_HERE',
    'Content-Type': 'application/json'
  },
  body: {
    currentPassword: 'Test123!',
    newPassword: 'NewTest123!'
  }
};

/**
 * What happens in Redis during authentication:
 * 
 * 1. REGISTER/LOGIN:
 *    - access_token:{userId}:{token} → stored with 15min expiration
 *    - refresh_token:{userId}:{token} → stored with 7day expiration
 *    - session:{userId} → user session data
 * 
 * 2. PROTECTED ROUTE ACCESS:
 *    - Check if token exists in blacklist:{token}
 *    - Verify token exists in access_token:{userId}:{token}
 *    - If valid, allow access
 * 
 * 3. LOGOUT:
 *    - Delete access_token:{userId}:{token}
 *    - Delete refresh_token:{userId}:{token}
 *    - Delete session:{userId}
 * 
 * 4. LOGOUT ALL:
 *    - Delete all access_token:{userId}:*
 *    - Delete all refresh_token:{userId}:*
 *    - Delete session:{userId}
 * 
 * 5. CHANGE PASSWORD:
 *    - Same as LOGOUT ALL (security measure)
 * 
 * 6. FAILED LOGIN:
 *    - Increment failed_attempts:{email}
 *    - Expires after 15 minutes
 */

/**
 * Testing Flow:
 * 
 * 1. Start the server: npm run dev
 * 2. Register a new user (use Postman or curl)
 * 3. Check Redis - you should see:
 *    - access_token:{userId}:{token}
 *    - refresh_token:{userId}:{token}
 *    - session:{userId}
 * 
 * 4. Try accessing /api/auth/me with the token
 * 5. Logout - tokens should be removed from Redis
 * 6. Try accessing /api/auth/me again - should fail
 * 
 * 7. Login again and try logout-all
 * 8. All tokens for the user should be removed
 */

/**
 * Using with Postman:
 * 
 * 1. Import the postman_collection.json file
 * 2. All requests are already configured
 * 3. After login, tokens are automatically saved
 * 4. Test the various endpoints to see Redis in action
 */

/**
 * Monitoring Redis:
 * 
 * If you have access to Upstash dashboard:
 * 1. Go to https://console.upstash.com/
 * 2. Select your Redis database
 * 3. Use the Data Browser to see keys
 * 4. Use the CLI to run Redis commands
 * 
 * Example Redis commands to try:
 * - KEYS access_token:*       (list all access tokens)
 * - KEYS refresh_token:*      (list all refresh tokens)
 * - KEYS session:*            (list all sessions)
 * - GET session:{userId}      (view specific session)
 * - TTL access_token:{userId}:{token}  (check expiration)
 */

export {
  registerExample,
  loginExample,
  getMeExample,
  logoutExample,
  logoutAllExample,
  refreshTokenExample,
  changePasswordExample
};
