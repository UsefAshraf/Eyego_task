const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./src/config');
const { connectDB } = require('./src/infrastructure/database/mongodb');
const errorHandler = require('./src/interfaces/middleware/errorHandler');

const ActivityRepository = require('./src/infrastructure/database/repositories/ActivityRepository');
const kafkaProducer = require('./src/infrastructure/messaging/producer');
const KafkaConsumer = require('./src/infrastructure/messaging/consumer');

const ActivityService = require('./src/domain/services/ActivityService');

const CreateActivity = require('./src/application/useCases/CreateActivity');
const GetActivities = require('./src/application/useCases/GetActivities');

const ActivityController = require('./src/interfaces/http/controllers/ActivityController');
const createActivityRoutes = require('./src/interfaces/http/routes/activityRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const activityRepository = new ActivityRepository();
const activityService = new ActivityService(activityRepository);
const createActivityUseCase = new CreateActivity(kafkaProducer);
const getActivitiesUseCase = new GetActivities(activityService);
const activityController = new ActivityController(createActivityUseCase, getActivitiesUseCase);

app.use('/api/activities', createActivityRoutes(activityController));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

async function startServer() {
  try {
    await connectDB();

    const kafkaConsumer = new KafkaConsumer(activityService);
    await kafkaConsumer.startConsuming();

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });

    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully');
      await kafkaProducer.disconnect();
      await kafkaConsumer.disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();