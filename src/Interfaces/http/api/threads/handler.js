const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetDetailThreadUsecase = require('../../../../Applications/use_case/GetDetailThreadUsecase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const requestPayload = {
      title: request.payload.title,
      body: request.payload.body,
      owner: request.auth.credentials.id,
    };
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(requestPayload);

    const response = h.response({
      status: 'success',
      data: { addedThread },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const requestPayload = request.params.threadId;
    const getDetailThreadUsecase = this._container.getInstance(
      GetDetailThreadUsecase.name
    );
    const thread = await getDetailThreadUsecase.execute(requestPayload);
    const response = h.response({
      status: 'success',
      data: { thread },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
