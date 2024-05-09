const catchAsync = require('../utils/catchAsync');

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

    res.status(200).json({ status: 'updated!', data: { updatedDoc } });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const docId = req.params.id;

    await Model.destroy({
      where: {
        id: docId,
      },
    });
    res.status(204).json({ status: 'deleted!' });
  });

// Junction
exports.junctionGetOne = (Model, fk1, fk2) =>
  catchAsync(async (req, res, next) => {
    const { id1, id2 } = req.params;
    const doc = await Model.findOne({
      where: { [fk1]: id1, [fk2]: id2 },
      // include: [Model.associations[fk1].target, Model.associations[fk2].target]
    });
    res.status(200).json({ status: 'success!', data: { doc } });
  });

exports.junctionUpdateOne = (Model, fk1, fk2) =>
  catchAsync(async (req, res, next) => {
    const { id1, id2 } = req.params;
    const updates = req.body;
    console.log(updates);
    const [updatedRowsCount, updatedDoc] = await Model.update(updates, {
      where: { [fk1]: id1, [fk2]: id2 },
      returning: true,
    });

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
    await Model.destroy({
      where: { [fk1]: id1, [fk2]: id2 },
    });

    res.status(204).json({ status: 'deleted!' });
  });
