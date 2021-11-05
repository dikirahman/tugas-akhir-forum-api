const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUsecase');

describe('GetDetailThreadUsecase', () => {
  it('should orchestrating get detail thread correctly', async () => {
    // Arrange
    const useCasePayload = 'thread-Detail';

    const expectedDetailThread = new DetailThread({
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
        },
        {
          id: 'comment-yksuCoxM2s4MMrZJO-qVD',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus**',
        },
      ],
    });
    const expectedThreads = [
      {
        id: 'thread-h_2FkLZhtgBKY2kh4CC02',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
      },
    ];
    const expectedComments = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        is_delete: false,
      },
      {
        id: 'comment-yksuCoxM2s4MMrZJO-qVD',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'sebuah comment',
        is_delete: true,
      },
    ];

    // Creating deps
    const mockThreadRepository = new ThreadRepository();
    // Mocking functions
    mockThreadRepository.getThreadByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThreads));
    mockThreadRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedComments));

    // Create usecase instance
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadsRepository: mockThreadRepository,
    });
    // Action
    const detailThread = await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(detailThread).toEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadByThreadId).toBeCalledWith(
      useCasePayload
    );
    expect(mockThreadRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload
    );
  });
});
