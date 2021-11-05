const NewComment = require('../NewComment');

describe('NewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};
    // Action
    const newComment = () => new NewComment(payload);
    // Assert
    expect(newComment).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload not string', () => {
    // Arrange
    const payload = { content: 123 };
    // Actoin
    const newComment = () => new NewComment(payload);
    // Assert
    expect(newComment).toThrowError(
      'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });
  it('should create newthread correctly', () => {
    // Arrange
    const payload = {
      content: 'Nice Thread!',
    };
    // Action
    const { content } = new NewComment(payload);
    // Assert
    expect(content).toEqual(payload.content);
  });
});
