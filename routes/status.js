const express = require('express');
const router = express.Router();
const { getIngestionStatus } = require('../store/memory');

router.get('/:ingestion_id', (req, res) => {
  const status = getIngestionStatus(req.params.ingestion_id);
  if (!status) return res.status(404).json({ error: 'Not found' });
  res.json(status);
});

module.exports = router;
