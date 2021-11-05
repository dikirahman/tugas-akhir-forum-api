class AddedThread {
  constructor(payload) {
    this._verifyData(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.owner = payload.owner;
  }

  _verifyData({ id, title, owner }) {
    const noKey = !id || !title || !owner;
    const notString =
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof owner !== 'string';

    if (noKey) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (notString) {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
module.exports = AddedThread;
