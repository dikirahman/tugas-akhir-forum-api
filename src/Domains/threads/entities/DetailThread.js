class DetailThread {
  constructor(payload) {
    this._verifyData(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.date = payload.date;
    this.username = payload.username;
    this.comments = payload.comments;
  }

  _verifyData({ id, title, body, date, username, comments }) {
    const noKey = !id || !title || !body || !date || !username || !comments;
    const notString =
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof date !== 'string' ||
      typeof username !== 'string';

    const commentsIsNotObject = typeof comments !== 'object';
    if (noKey) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (notString || commentsIsNotObject) {
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailThread;
