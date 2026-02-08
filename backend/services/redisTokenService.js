import redis from '../config/redis.config.js';

/**
 * Redis Token Service
 * Manages access and refresh tokens in Redis for authentication
 */

class RedisTokenService {
  /**
   * Store access token in Redis
   * @param {string} userId - User ID
   * @param {string} token - Access token
   * @param {number} expiresIn - Expiration time in seconds (default: 15 minutes)
   */
  async storeAccessToken(userId, token, expiresIn = 15 * 60) {
    try {
      const key = `access_token:${userId}:${token}`;
      await redis.setex(key, expiresIn, JSON.stringify({ userId, token, type: 'access' }));
      return true;
    } catch (error) {
      console.error('Error storing access token in Redis:', error);
      throw error;
    }
  }

  /**
   * Store refresh token in Redis
   * @param {string} userId - User ID
   * @param {string} token - Refresh token
   * @param {number} expiresIn - Expiration time in seconds (default: 7 days)
   */
  async storeRefreshToken(userId, token, expiresIn = 7 * 24 * 60 * 60) {
    try {
      const key = `refresh_token:${userId}:${token}`;
      await redis.setex(key, expiresIn, JSON.stringify({ userId, token, type: 'refresh' }));
      return true;
    } catch (error) {
      console.error('Error storing refresh token in Redis:', error);
      throw error;
    }
  }

  /**
   * Verify if access token exists and is valid in Redis
   * @param {string} userId - User ID
   * @param {string} token - Access token to verify
   * @returns {boolean} - True if token is valid
   */
  async verifyAccessToken(userId, token) {
    try {
      const key = `access_token:${userId}:${token}`;
      const data = await redis.get(key);
      return data !== null;
    } catch (error) {
      console.error('Error verifying access token in Redis:', error);
      return false;
    }
  }

  /**
   * Verify if refresh token exists and is valid in Redis
   * @param {string} userId - User ID
   * @param {string} token - Refresh token to verify
   * @returns {boolean} - True if token is valid
   */
  async verifyRefreshToken(userId, token) {
    try {
      const key = `refresh_token:${userId}:${token}`;
      const data = await redis.get(key);
      return data !== null;
    } catch (error) {
      console.error('Error verifying refresh token in Redis:', error);
      return false;
    }
  }

  /**
   * Invalidate a specific access token (for logout)
   * @param {string} userId - User ID
   * @param {string} token - Access token to invalidate
   */
  async invalidateAccessToken(userId, token) {
    try {
      const key = `access_token:${userId}:${token}`;
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Error invalidating access token in Redis:', error);
      throw error;
    }
  }

  /**
   * Invalidate a specific refresh token
   * @param {string} userId - User ID
   * @param {string} token - Refresh token to invalidate
   */
  async invalidateRefreshToken(userId, token) {
    try {
      const key = `refresh_token:${userId}:${token}`;
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Error invalidating refresh token in Redis:', error);
      throw error;
    }
  }

  /**
   * Invalidate all tokens for a user (for logout all devices)
   * @param {string} userId - User ID
   */
  async invalidateAllUserTokens(userId) {
    try {
      // Get all keys for this user
      const accessKeys = await redis.keys(`access_token:${userId}:*`);
      const refreshKeys = await redis.keys(`refresh_token:${userId}:*`);
      
      const allKeys = [...accessKeys, ...refreshKeys];
      
      if (allKeys.length > 0) {
        await redis.del(...allKeys);
      }
      
      return true;
    } catch (error) {
      console.error('Error invalidating all user tokens in Redis:', error);
      throw error;
    }
  }

  /**
   * Store user session data
   * @param {string} userId - User ID
   * @param {object} sessionData - Session data to store
   * @param {number} expiresIn - Expiration time in seconds
   */
  async storeUserSession(userId, sessionData, expiresIn = 7 * 24 * 60 * 60) {
    try {
      const key = `session:${userId}`;
      await redis.setex(key, expiresIn, JSON.stringify(sessionData));
      return true;
    } catch (error) {
      console.error('Error storing user session in Redis:', error);
      throw error;
    }
  }

  /**
   * Get user session data
   * @param {string} userId - User ID
   * @returns {object|null} - Session data or null
   */
  async getUserSession(userId) {
    try {
      const key = `session:${userId}`;
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user session from Redis:', error);
      return null;
    }
  }

  /**
   * Delete user session
   * @param {string} userId - User ID
   */
  async deleteUserSession(userId) {
    try {
      const key = `session:${userId}`;
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Error deleting user session from Redis:', error);
      throw error;
    }
  }

  /**
   * Track failed login attempts
   * @param {string} identifier - Email or username
   * @param {number} expiresIn - Expiration time in seconds (default: 15 minutes)
   */
  async incrementFailedAttempts(identifier, expiresIn = 15 * 60) {
    try {
      const key = `failed_attempts:${identifier}`;
      const count = await redis.incr(key);
      
      // Set expiration on first attempt
      if (count === 1) {
        await redis.expire(key, expiresIn);
      }
      
      return count;
    } catch (error) {
      console.error('Error incrementing failed attempts in Redis:', error);
      throw error;
    }
  }

  /**
   * Get failed login attempts count
   * @param {string} identifier - Email or username
   * @returns {number} - Number of failed attempts
   */
  async getFailedAttempts(identifier) {
    try {
      const key = `failed_attempts:${identifier}`;
      const count = await redis.get(key);
      return count ? parseInt(count) : 0;
    } catch (error) {
      console.error('Error getting failed attempts from Redis:', error);
      return 0;
    }
  }

  /**
   * Reset failed login attempts
   * @param {string} identifier - Email or username
   */
  async resetFailedAttempts(identifier) {
    try {
      const key = `failed_attempts:${identifier}`;
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Error resetting failed attempts in Redis:', error);
      throw error;
    }
  }

  /**
   * Blacklist a token (for immediate invalidation)
   * @param {string} token - Token to blacklist
   * @param {number} expiresIn - Expiration time in seconds
   */
  async blacklistToken(token, expiresIn = 15 * 60) {
    try {
      const key = `blacklist:${token}`;
      await redis.setex(key, expiresIn, 'true');
      return true;
    } catch (error) {
      console.error('Error blacklisting token in Redis:', error);
      throw error;
    }
  }

  /**
   * Check if token is blacklisted
   * @param {string} token - Token to check
   * @returns {boolean} - True if token is blacklisted
   */
  async isTokenBlacklisted(token) {
    try {
      const key = `blacklist:${token}`;
      const data = await redis.get(key);
      return data !== null;
    } catch (error) {
      console.error('Error checking token blacklist in Redis:', error);
      return false;
    }
  }
}

export default new RedisTokenService();
