const express = require('express');
const router = express.Router();
const { enqueueIngestion } = require('../services/processor');

router.post('/', (req, res) => {
  const { ids, priority } = req.body;

  if (!Array.isArray(ids) || !priority) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const ingestionId = enqueueIngestion(ids, priority.toUpperCase());
  return res.status(200).json({ ingestion_id: ingestionId });
});

module.exports = router;
