class DeleteCommentUseCase {
  constructor({ commentsRepository, threadsRepository }) {
    this._commentsRepository = commentsRepository;
    this._threadsRepository = threadsRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, credentialId } = useCasePayload;
    await this._threadsRepository.getThreadByThreadId(threadId);
    await this._commentsRepository.verifyCommentAccess(commentId, credentialId);
    return this._commentsRepository.deleteCommentByCommentId(commentId);
  }
}

module.exports = DeleteCommentUseCase;
