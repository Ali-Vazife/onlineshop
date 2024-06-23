const multer = require('multer');
const sharp = require('sharp');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { UserAccount } = require('../sequelize/db');

const multerStorage = multer.memoryStorage();

const multerfilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerfilter,
});

module.exports.uploadUserPhoto = upload.single('photo');

module.exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/users/${req.file.filename}`);

  const updatedUserPhoto = await UserAccount.update(
    { image: req.file.filename },
    { where: { id: req.user.id } },
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUserPhoto,
    },
  });
});
