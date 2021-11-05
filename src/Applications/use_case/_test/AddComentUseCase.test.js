const AddCommentUseCase = require('../AddCommentUseCase');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123', // from url params
      content: 'Nice Thread!', // from request  payload
      owner: 'user-0', // from session
    };
    const expectedAddedComment = new AddedComment({
      id: 'comment-xyz',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    // Create deps
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));

    // initiate usecase object
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);
    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment({
        content: useCasePayload.content,
      }),
      useCasePayload.threadId,
      useCasePayload.owner
    );
  });
});
