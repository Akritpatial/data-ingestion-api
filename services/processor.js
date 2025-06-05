const { v4: uuidv4 } = require('uuid');
const {
  addToQueue,
  getNextBatch,
  updateBatchStatus,
} = require('../store/memory');

function enqueueIngestion(ids, priority) {
  const ingestionId = uuidv4();
  addToQueue(ingestionId, ids, priority);
  return ingestionId;
}

// Simulated External API
function simulateFetch(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id, data: 'processed' }), 1000);
  });
}

// Background Processor with 5-sec rate limit
setInterval(async () => {
  const batch = getNextBatch();
  if (!batch) return;

  updateBatchStatus(batch, 'triggered');
  for (const id of batch.ids) {
    await simulateFetch(id);
  }
  updateBatchStatus(batch, 'completed');
}, 5000); // One batch every 5 seconds

module.exports = { enqueueIngestion };
