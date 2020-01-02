module.exports = {
  PAGE_NOT_FOUND: {
    success: false,
    error_code: 404,
    message: 'Not found',
    data: {}
  },
  PERMISSION_DENIED: {
    success: false,
    error_code: 403,
    message: 'Permission denied',
    data: {}
  },
  INSUFFICIENT_PARAMS: {
    success: false,
    error_code: 400,
    message: 'Insufficient parameters',
    data: 'resData'
  },
  USER_EXISTS: {
    success: false,
    error_code: 400,
    message: 'User already exists',
    data: {}
  },
  INCORRECT_USERNAME: {
    success: false,
    error_code: 403,
    message: 'Incorrect username or password',
    data: {}
  },
  INTERNAL_SERVER_ERROR: {
    success: false,
    error_code: 500,
    message: 'Internal server error',
    data: {}
  },
  PATIENT_NOT_EXISTS: {
    success: false,
    error_code: 500,
    message: 'Patient does not exist',
    data: {}
  },
  ERM_FETCH_ERROR: {
    success: false,
    error_code: 500,
    message: 'examinations Role Mapping fetching failure',
    data: {}
  },
  ERM_CREATE_ERROR: {
    success: false,
    error_code: 500,
    message: 'examinations Role Mapping creation failure',
    data: {}
  },
  IRM_FETCH_ERROR: {
    success: false,
    error_code: 500,
    message: 'Investigations Role Mapping fetching failure',
    data: {}
  },
  IRM_CREATE_ERROR: {
    success: false,
    error_code: 500,
    message: 'Investigations Role Mapping create failure',
    data: {}
  },
  SRM_FETCH_ERROR: {
    success: false,
    message: 'Symptoms Role Mapping fetching failure',
    data: {}
  }
}