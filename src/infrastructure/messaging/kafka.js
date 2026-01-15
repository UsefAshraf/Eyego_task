const { Kafka } = require('kafkajs');
const config = require('../../config');

const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: config.kafka.brokers,
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

module.exports = kafka;