const { v4: uuidv4 } = require('uuid');

const PRIORITY_LEVELS = { HIGH: 1, MEDIUM: 2, LOW: 3 };
let ingestionStore = {}; // { ingestionId: { status, batches } }
let batchQueue = []; // [{ ingestionId, batchId, ids, priority, createdAt, status }]

function saveIngestion(ingestionId, batches, priority) {
  ingestionStore[ingestionId] = {
    ingestion_id: ingestionId,
    status: 'yet_to_start',
    priority,
    batches,
  };
}

function getIngestionStatus(ingestionId) {
  const record = ingestionStore[ingestionId];
  if (!record) return null;

  let batchStatuses = record.batches.map(b => b.status);
  let overall = 'yet_to_start';
  if (batchStatuses.every(s => s === 'completed')) overall = 'completed';
  else if (batchStatuses.some(s => s === 'triggered')) overall = 'triggered';

  return {
    ingestion_id: ingestionId,
    status: overall,
    batches: record.batches.map(({ batch_id, ids, status }) => ({ batch_id, ids, status })),
  };
}

function addToQueue(ingestionId, ids, priority) {
  const batches = [];
  for (let i = 0; i < ids.length; i += 3) {
    const batch = {
      ingestionId,
      batch_id: uuidv4(),
      ids: ids.slice(i, i + 3),
      status: 'yet_to_start',
      createdAt: Date.now(),
      priority,
    };
    batches.push(batch);
    batchQueue.push(batch);
  }
  saveIngestion(ingestionId, batches, priority);
}

function getNextBatch() {
  if (!batchQueue.length) return null;

  batchQueue.sort((a, b) => {
    if (a.priority === b.priority) return a.createdAt - b.createdAt;
    return PRIORITY_LEVELS[a.priority] - PRIORITY_LEVELS[b.priority];
  });

  const next = batchQueue.shift();
  return next;
}

function updateBatchStatus(batch, status) {
  batch.status = status;
  ingestionStore[batch.ingestionId].batches = ingestionStore[batch.ingestionId].batches.map(b =>
    b.batch_id === batch.batch_id ? { ...b, status } : b
  );
}

module.exports = {
  addToQueue,
  getIngestionStatus,
  getNextBatch,
  updateBatchStatus,
};
