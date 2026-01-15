// Entity: Pure business object
class UserActivity {
  constructor({ userId, action, timestamp, metadata, ipAddress }) {
    this.userId = userId;
    this.action = action;
    this.timestamp = timestamp || new Date();
    this.metadata = metadata || {};
    this.ipAddress = ipAddress;
  }

  isRecentActivity() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return this.timestamp > fiveMinutesAgo;
  }

  validate() {
    if (!this.userId) throw new Error('UserId is required');
    if (!this.action) throw new Error('Action is required');
    return true;
  }
}

module.exports = UserActivity;