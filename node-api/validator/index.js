exports.createPostValidator = (req, res, next) => {
  // title
  req.check('title', 'Write a title').notEmpty();
  req.check('title', 'Title must be between 4 to 150 characters')
    .isLength({ min: 4, max: 150 });

  // body
  req.check('body', 'Write a body').notEmpty();
  req.check('body', 'Body must be between 4 to 2000 characters')
    .isLength({ min: 4, max: 2000 });

  // check for errors
  const errors = req.validationErrors();

  // if error show the first one as the happen
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({
      error: firstError
    })
  }

  // proceed to next middleware
  next();
};

exports.userSignupValidator = (req, res, next) => {
  // name: not null and between 4 to 50 characters
  req.check('name', 'Name is required.').notEmpty();
  req.check('name', 'Name must be between 3 to 100 characters')
    .isLength({ min: 3, max: 100 });

  // email: not null, valid and normalized
  req.check('email', 'Email is required.').notEmpty();
  req.check('email')
    .isLength({ min: 3, max: 200 }).withMessage('Email must be between 4 to 200 characters')
    .matches(/.+\@.+\..+/).withMessage('Invalid email format')

  // password
  req.check('password', 'Password is required.').notEmpty();
  req.check('password')
    .isLength({ min: 6 }).withMessage('Password must contain at least 6 characters.')
    .matches(/\d+/).withMessage('Password must contain at least one number.');

  // check for errors
  const errors = req.validationErrors();

  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({
      error: firstError,
    })
  }

  next();
};