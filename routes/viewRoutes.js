const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('overview', {
    category: [
      { name: 'Category 1', image: 'collection-1' },
      { name: 'Category 2', image: 'collection-2' },
      { name: 'Category 3', image: 'collection-3' },
      { name: 'Category 1', image: 'collection-1' },
      { name: 'Category 2', image: 'collection-2' },
      { name: 'Category 3', image: 'collection-3' },
    ],
  });
});

module.exports = router;
