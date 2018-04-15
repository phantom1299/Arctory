export const required = text => value => (value ? undefined : text || 'Required');

export const maxLength = (max, text) => value =>
  (value && value.length > max ? text || `Must be ${max} characters or less` : undefined);

export const minLength = (min, text) => value =>
  (value && value.length < min ? text || `Must be ${min} characters or more` : undefined);

export const number = text => value =>
  (value && isNaN(Number(value)) ? text || 'Must be a number' : undefined);

export const minValue = (min, text) => value =>
  (value && value < min ? text || `Must be at least ${min}` : undefined);

export const validEmail = text => value =>
  (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? text || 'Invalid email address'
    : undefined);

const tooOld = text => value =>
  (value && value > 65 ? text || 'You might be too old for this' : undefined);

const aol = text => value =>
  (value && /.+@aol\.com/.test(value)
    ? text || 'Really? You still use AOL for your email?'
    : undefined);

export const alphaNumeric = text => value =>
  (value && /[^a-zA-Z0-9 ]/i.test(value) ? text || 'Only alphanumeric characters' : undefined);

export const phoneNumber = text => value =>
  (value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? text || 'Invalid phone number, must be 10 digits'
    : undefined);
