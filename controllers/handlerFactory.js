const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findAll();

    res
      .status(200)
      .json({ status: 'success!', number: doc.length, data: { doc } });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByPk(id);

    if (!doc) {
      return next(new AppError('No document found with that id', 404));
    }

    res.status(200).json({ status: 'success!', data: { doc } });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = req.body;
    const doc = await Model.create(data);

    res.status(201).json({ status: 'success!', data: { doc } });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const updates = req.body;
    const docId = req.params.id;
    const [updatedRowsCount, updatedDoc] = await Model.update(updates, {
      where: { id: docId },
      returning: true,
    });

    if (!updatedRowsCount) {
      return next(new AppError('No document found with that id', 404));
    }

    res.status(200).json({ status: 'updated!', data: { updatedDoc } });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const docId = req.params.id;
    const doc = await Model.destroy({
      where: {
        id: docId,
      },
    });

    if (!doc) {
      return next(new AppError('No document found with that id', 404));
    }

    res.status(204).json({ status: 'deleted!' });
  });

exports.addOneLikeBasket = (Model) =>
  catchAsync(async (req, res, next) => {
    const UserAccountId = req.user.id;
    const ProductId = req.body.productId;
    if (!UserAccountId || !ProductId) {
      return next(new AppError('User ID or Product ID does not exist!', 401));
    }

    const isExist = await Model.findOne({
      where: { UserAccountId, ProductId },
    });

    if (isExist) {
      return res.status(200).json({ status: 'Already exist in your account!' });
    }

    const newDoc = await Model.create({ UserAccountId, ProductId });
    res.status(200).json({ status: 'success', data: newDoc });
  });

exports.deleteOneLikeBasket = (Model) =>
  catchAsync(async (req, res, next) => {
    const UserAccountId = req.user.id;
    const ProductId = req.body.productId;

    if (!UserAccountId || !ProductId) {
      return next(new AppError('User ID or Product ID does not exist!', 401));
    }

    await Model.destroy({
      where: { UserAccountId, ProductId },
    });

    res.status(200).json({ status: 'success' });
  });

// Junction
exports.junctionGetOne = (Model, fk1, fk2) =>
  catchAsync(async (req, res, next) => {
    const { vari, attr } = req.params;
    const doc = await Model.findOne({
      where: { [fk1]: vari, [fk2]: attr },
      // include: [Model.associations[fk1].target, Model.associations[fk2].target]
    });

    if (!doc) {
      return next(new AppError('No document found with that id', 404));
    }

    res.status(200).json({ status: 'success!', data: { doc } });
  });

exports.junctionUpdateOne = (Model, fk1, fk2) =>
  catchAsync(async (req, res, next) => {
    const { vari, attr } = req.params;
    const updates = req.body;
    console.log(updates);
    const [updatedRowsCount, updatedDoc] = await Model.update(updates, {
      where: { [fk1]: vari, [fk2]: attr },
      returning: true,
    });

    if (!updatedRowsCount) {
      return next(new AppError('No document found with that id', 404));
    }

    if (updatedRowsCount === 0) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Junction record not found' });
    }

    res.status(200).json({ status: 'updated!', data: { updatedDoc } });
  });

exports.junctionDeleteOne = (Model, fk1, fk2) =>
  catchAsync(async (req, res, next) => {
    const { id1, id2 } = req.params;
    const doc = await Model.destroy({
      where: { [fk1]: id1, [fk2]: id2 },
    });

    if (!doc) {
      return next(new AppError('No document found with that id', 404));
    }

    res.status(204).json({ status: 'deleted!' });
  });
