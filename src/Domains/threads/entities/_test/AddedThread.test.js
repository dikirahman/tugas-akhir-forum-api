const AddedThread = require('../AddedThread');

describe('AddedThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'hello world',
    };

    // Action
    const addedthread = () => new AddedThread(payload);

    // Assert
    expect(addedthread).toThrowError(
      'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });
  it('should throw error when payload not string', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'hello world',
      owner: 123,
    };

    // Action
    const addedthread = () => new AddedThread(payload);
    // Assert
    expect(addedthread).toThrowError(
      'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });
  it('should create addedthread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'hello world',
      owner: 'user-123',
    };

    // Action
    const { id, title, owner } = new AddedThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
