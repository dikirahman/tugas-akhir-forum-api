const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'hello world',
    };

    // Action
    const newThread = () => new NewThread(payload);

    // Assert
    expect(newThread).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload not string', () => {
    // Arrange
    const payload = {
      title: 'first thread',
      body: 123,
    };

    // Action
    const newThread = () => new NewThread(payload);

    // Assert
    expect(newThread).toThrowError(
      'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });
  it('should create newthread object correctly', () => {
    // Arrange
    const payload = {
      title: 'first thread',
      body: 'hello world',
    };

    // Action
    const { title, body } = new NewThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
