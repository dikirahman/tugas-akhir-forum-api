class NewComment {
  constructor(payload) {
    this._verifyData(payload);

    this.content = payload.content;
  }

  _verifyData({ content }) {
    const noKey = !content;
    const notString = typeof content !== 'string';
    if (noKey) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (notString) {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewComment;
