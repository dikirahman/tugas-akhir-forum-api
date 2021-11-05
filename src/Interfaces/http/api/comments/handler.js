const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentThreadHandler = this.postCommentThreadHandler.bind(this);
    this.deleteCommentInThreadHandler =
      this.deleteCommentInThreadHandler.bind(this);
  }

  async postCommentThreadHandler(request, h) {
    const requestPayload = {
      content: request.payload.content,
      threadId: request.params.threadId,
      owner: request.auth.credentials.id,
    };

    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const addedComment = await addCommentUseCase.execute(requestPayload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentInThreadHandler(request, h) {
    const requestPayload = {
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      credentialId: request.auth.credentials.id,
    };
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    const deletedComment = await deleteCommentUseCase.execute(requestPayload);
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
