import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
// import { notFound } from './middleware/notFound';
import factoryRoutes from './routes/factory.routes';
import bayRoutes from './routes/bay.routes';
import machineTypeRoutes from './routes/machineType.routes';
import inventoryRoutes from './routes/inventory.routes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/v1/factories', factoryRoutes);
app.use('/api/v1', bayRoutes);
app.use('/api/v1', machineTypeRoutes); 
app.use('/api/v1', inventoryRoutes); 

// Error handling
// app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});