const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-xyz',
      credentialId: 'user-commenter',
    };
    
    const expectedDeletedComment = {
      status: 'success',
    };

    // Create deps
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.verifyCommentAccess = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.deleteCommentByCommentId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedDeletedComment));

    mockThreadRepository.getThreadByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentsRepository: mockCommentRepository,
      threadsRepository: mockThreadRepository,
    });

    // Action
    const deletedComment = await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.verifyCommentAccess).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.credentialId
    );
    expect(mockCommentRepository.deleteCommentByCommentId).toBeCalledWith(
      useCasePayload.commentId
    );
    expect(mockThreadRepository.getThreadByThreadId).toBeCalledWith(
      useCasePayload.threadId
    );
  });
});
