const kafka = require('./kafka');
const config = require('../../config');

class KafkaProducer {
  constructor() {
    this.producer = kafka.producer();
    this.isConnected = false;
  }

  async connect() {
    if (!this.isConnected) {
      await this.producer.connect();
      this.isConnected = true;
      console.log('Kafka Producer connected');
    }
  }

  async sendMessage(topic, message) {
    try {
      await this.connect();
      
      const result = await this.producer.send({
        topic: topic || config.kafka.topic,
        messages: [
          {
            key: message.userId,  
            value: JSON.stringify(message),
            timestamp: Date.now().toString()
          }
        ]
      });
      
      console.log('Message sent to Kafka:', result);
      return result;
    } catch (error) {
      console.error('Error sending message to Kafka:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await this.producer.disconnect();
      this.isConnected = false;
      console.log('Kafka Producer disconnected');
    }
  }
}

module.exports = new KafkaProducer();