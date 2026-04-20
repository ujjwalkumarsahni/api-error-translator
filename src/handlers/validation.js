/**
 * Validation error handler for request validation (Joi, express-validator, etc.)
 */

class ValidationErrorHandler {
  constructor(options = {}) {
    this.options = {
      stripUnknownFields: true,
      flattenErrors: true,
      ...options
    };
  }

  /**
   * Check if error is a validation error
   */
  canHandle(error) {
    return error.name === 'ValidationError' ||
           error.isJoi === true ||
           error.type === 'validation' ||
           (error.details && Array.isArray(error.details));
  }

  /**
   * Translate validation error to standardized format
   */
  translate(error) {
    // Handle Joi validation errors
    if (error.isJoi) {
      return this.handleJoiError(error);
    }
    
    // Handle express-validator errors
    if (error.array && typeof error.array === 'function') {
      return this.handleExpressValidatorError(error);
    }
    
    // Handle generic validation errors
    return this.handleGenericValidationError(error);
  }

  /**
   * Handle Joi validation errors
   */
  handleJoiError(error) {
    const errors = this.options.flattenErrors ? 
      this.flattenJoiErrors(error.details) : 
      this.groupJoiErrors(error.details);

    return {
      type: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      statusCode: 422,
      details: errors
    };
  }

  /**
   * Flatten Joi error details
   */
  flattenJoiErrors(details) {
    const errors = {};
    details.forEach(detail => {
      const path = detail.path.join('.');
      errors[path] = detail.message;
    });
    return errors;
  }

  /**
   * Group Joi errors by field
   */
  groupJoiErrors(details) {
    const grouped = {};
    details.forEach(detail => {
      const path = detail.path.join('.');
      if (!grouped[path]) {
        grouped[path] = [];
      }
      grouped[path].push(detail.message);
    });
    return grouped;
  }

  /**
   * Handle express-validator errors
   */
  handleExpressValidatorError(error) {
    const errors = {};
    const errorArray = error.array();
    
    errorArray.forEach(err => {
      if (!errors[err.path]) {
        errors[err.path] = [];
      }
      errors[err.path].push(err.msg);
    });

    return {
      type: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      statusCode: 422,
      details: this.options.flattenErrors ? 
        Object.fromEntries(
          Object.entries(errors).map(([k, v]) => [k, v.join(', ')])
        ) : errors
    };
  }

  /**
   * Handle generic validation errors
   */
  handleGenericValidationError(error) {
    return {
      type: 'VALIDATION_ERROR',
      message: error.message || 'Validation failed',
      statusCode: 400,
      details: error.details || undefined
    };
  }
}

module.exports = ValidationErrorHandler;