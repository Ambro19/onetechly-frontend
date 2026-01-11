// ========================================
// USER DISPLAY UTILITIES
// ========================================
// File: frontend/src/utils/userDisplay.js
// Purpose: Helper functions for displaying user information
// Created: January 2026

/**
 * Get display name for user
 * Prioritizes: first_name > username > "User"
 * 
 * @param {Object} user - User object from auth context
 * @returns {string} Display name
 */
export function getDisplayName(user) {
  if (!user) return 'User';
  
  // Try first name
  if (user.first_name && user.first_name.trim()) {
    return user.first_name.trim();
  }
  
  // Try full name
  if (user.name && user.name.trim()) {
    return user.name.trim();
  }
  
  // Try username
  if (user.username && user.username.trim()) {
    return user.username.trim();
  }
  
  // Fallback
  return 'User';
}

/**
 * Get display email for user
 * Returns email or "No email" if not available
 * 
 * @param {Object} user - User object from auth context
 * @returns {string} Display email
 */
export function getDisplayEmail(user) {
  if (!user) return 'No email';
  
  if (user.email && user.email.trim()) {
    return user.email.trim();
  }
  
  return 'No email';
}

/**
 * Get user initials for avatar
 * Uses first letter of first_name and last_name, or username
 * 
 * @param {Object} user - User object from auth context
 * @returns {string} User initials (max 2 characters)
 */
export function getUserInitials(user) {
  if (!user) return 'U';
  
  // Try first and last name
  if (user.first_name && user.last_name) {
    return (user.first_name[0] + user.last_name[0]).toUpperCase();
  }
  
  // Try full name (split by space)
  if (user.name && user.name.includes(' ')) {
    const parts = user.name.split(' ');
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  
  // Try username (first 2 letters)
  if (user.username && user.username.length >= 2) {
    return user.username.substring(0, 2).toUpperCase();
  }
  
  // Fallback to first letter of username or email
  if (user.username) {
    return user.username[0].toUpperCase();
  }
  
  if (user.email) {
    return user.email[0].toUpperCase();
  }
  
  return 'U';
}

/**
 * Get full name (first + last)
 * 
 * @param {Object} user - User object from auth context
 * @returns {string} Full name
 */
export function getFullName(user) {
  if (!user) return 'User';
  
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`.trim();
  }
  
  if (user.name) {
    return user.name.trim();
  }
  
  return getDisplayName(user);
}

/**
 * Format user for display in header/profile
 * Returns object with formatted user data
 * 
 * @param {Object} user - User object from auth context
 * @returns {Object} Formatted user data
 */
export function formatUserForDisplay(user) {
  return {
    name: getDisplayName(user),
    email: getDisplayEmail(user),
    initials: getUserInitials(user),
    fullName: getFullName(user),
  };
}