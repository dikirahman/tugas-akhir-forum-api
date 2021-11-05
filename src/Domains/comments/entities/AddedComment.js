class AddedComment {
  constructor(payload) {
    this._verifyData(payload);

    this.id = payload.id;
    this.content = payload.content;
    this.owner = payload.owner;
  }

  _verifyData({ id, content, owner }) {
    const noKey = !id || !content || !owner;
    const notString =
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof owner !== 'string';
    if (noKey) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (notString) {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedComment;
