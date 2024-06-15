const createUserValidationschema = {
  firstName: {
    notEmpty: {
      errorMessage: 'Firstname is required',
    },
  },
  lastName: {
    notEmpty: {
      errorMessage: 'Lastname is required',
    },
  },
  emailAddress: {
    isEmail: {
      errorMessage: 'Invalid email address',
    },
    notEmpty: {
      errorMessage: 'Email address is required',
    },
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password must be at least 8 characters long',
    },
    notEmpty: {
      errorMessage: 'Password is required',
    },
  },
  passwordConfirm: {
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      },
    },
  },
};

module.exports = createUserValidationschema;
