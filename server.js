const express = require('express');
const app = express();
const ingestRoutes = require('./routes/ingest');
const statusRoutes = require('./routes/status');

app.use(express.json());
app.use('/ingest', ingestRoutes);
app.use('/status', statusRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
