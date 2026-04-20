/**
 * Utility functions for formatting error messages
 */

class MessageFormatter {
  constructor(options = {}) {
    this.options = {
      locale: 'en',
      templates: {},
      ...options
    };
    
    this.loadTemplates();
  }

  /**
   * Load message templates
   */
  loadTemplates() {
    this.templates = {
      en: {
        DUPLICATE_KEY_ERROR: '{field} already exists',
        VALIDATION_ERROR: 'Validation failed: {errors}',
        CAST_ERROR: 'Invalid {field} format',
        GENERIC_ERROR: 'An unexpected error occurred',
        DATABASE_ERROR: 'Database operation failed',
        NOT_FOUND: '{resource} not found',
        UNAUTHORIZED: 'Authentication required',
        FORBIDDEN: 'Access denied',
        ...this.options.templates
      }
    };
  }

  /**
   * Format message with variables
   */
  format(message, variables = {}) {
    let formatted = message;
    
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{${key}}`, 'g');
      formatted = formatted.replace(regex, value);
    }
    
    return formatted;
  }

  /**
   * Get template by type and locale
   */
  getTemplate(type, locale = this.options.locale) {
    const localeTemplates = this.templates[locale] || this.templates.en;
    return localeTemplates[type] || this.templates.en.GENERIC_ERROR;
  }

  /**
   * Format error message based on error type
   */
  formatError(error, variables = {}) {
    const template = this.getTemplate(error.type);
    return this.format(template, {
      field: error.details?.field,
      resource: error.details?.resource,
      errors: error.details ? Object.values(error.details).join(', ') : '',
      ...variables
    });
  }

  /**
   * Add custom templates
   */
  addTemplates(templates, locale = 'en') {
    if (!this.templates[locale]) {
      this.templates[locale] = {};
    }
    Object.assign(this.templates[locale], templates);
  }

  /**
   * Change locale
   */
  setLocale(locale) {
    if (this.templates[locale]) {
      this.options.locale = locale;
      return true;
    }
    return false;
  }

  /**
   * Sanitize error message (remove sensitive data)
   */
  sanitize(message) {
    const sensitivePatterns = [
      /password[=:]\s*\S+/gi,
      /token[=:]\s*\S+/gi,
      /secret[=:]\s*\S+/gi,
      /key[=:]\s*\S+/gi
    ];
    
    let sanitized = message;
    sensitivePatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });
    
    return sanitized;
  }
}

module.exports = MessageFormatter;