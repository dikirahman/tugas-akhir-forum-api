const AddedComment = require('../AddedComment');

describe('AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'user-0',
    };
    // Action
    const addedComment = () => new AddedComment(payload);
    // Assert
    expect(addedComment).toThrowError(
      'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });
  it('should throw error when payload not string', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'Nice Thread Bro!',
      owner: 'user-0',
    };
    // Action
    const addedComment = () => new AddedComment(payload);

    // Assert
    expect(addedComment).toThrowError(
      'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });
  it('should create addedcomment correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-xyz',
      content: 'Nice Thread Bro!',
      owner: 'user-0',
    };
    // Action
    const { id, content, owner } = new AddedComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
