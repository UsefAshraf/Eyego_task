const kafka = require('./kafka');
const config = require('../../config');

class KafkaConsumer {
  constructor(activityService) {
    this.consumer = kafka.consumer({ groupId: config.kafka.groupId });
    this.activityService = activityService;
    this.isConnected = false;
  }

  async connect() {
    if (!this.isConnected) {
      await this.consumer.connect();
      this.isConnected = true;
      console.log('Kafka Consumer connected');
    }
  }

  async subscribe() {
    await this.connect();
    await this.consumer.subscribe({
      topic: config.kafka.topic,
      fromBeginning: true 
    });
    console.log(`Subscribed to topic: ${config.kafka.topic}`);
  }

  async startConsuming() {
    await this.subscribe();

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const activityData = JSON.parse(message.value.toString());
          
          console.log(`Received message:`, {
            topic,
            partition,
            offset: message.offset,
            data: activityData
          });

          await this.activityService.processActivity(activityData);
          
          console.log('Activity processed and stored');
        } catch (error) {
          console.error('Error processing message:', error);
        }
      }
    });
  }

  async disconnect() {
    if (this.isConnected) {
      await this.consumer.disconnect();
      this.isConnected = false;
      console.log('Kafka Consumer disconnected');
    }
  }
}

module.exports = KafkaConsumer;