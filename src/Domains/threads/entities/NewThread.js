class NewThread {
  constructor(payload) {
    this._verifyData(payload);

    this.title = payload.title;
    this.body = payload.body;
  }

  _verifyData({ title, body }) {
    const noKey = !title || !body;
    const payloadNotString =
      typeof title !== 'string' || typeof body !== 'string';

    if (noKey) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (payloadNotString) {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
module.exports = NewThread;
