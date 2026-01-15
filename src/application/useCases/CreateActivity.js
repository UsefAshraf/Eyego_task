// Use case: Create and publish activity
class CreateActivity {
  constructor(kafkaProducer) {
    this.kafkaProducer = kafkaProducer;
  }

  async execute(activityData) {
    if (!activityData.userId || !activityData.action) {
      throw new Error('Missing required fields: userId and action');
    }
    await this.kafkaProducer.sendMessage(null, activityData);
    return {
      success: true,
      message: 'Activity sent for processing'
    };
  }
}

module.exports = CreateActivity;