const DetailThread = require('../../Domains/threads/entities/DetailThread');
const {
  mapDBToDetailComment,
  mapDBToDetailThread,
} = require('../../Commons/utils/mapDB');

class GetDetailThreadUsecase {
  constructor({ threadsRepository }) {
    this._threadsRepository = threadsRepository;
  }

  async execute(useCasePayload) {
    // thread metadata
    const threadHead = await this._threadsRepository.getThreadByThreadId(
      useCasePayload
    );
    // thread comments info
    const threadBodyComments =
      await this._threadsRepository.getCommentsByThreadId(useCasePayload);

    // Mapping to model
    const comments = threadBodyComments
      .map((comment) => ({
        ...comment,
        // Overriding default comment.content value if comments is deleted
        content:
          comment.is_delete === true
            ? '**komentar telah dihapus**'
            : comment.content,
      }))
      .map(mapDBToDetailComment); // remove is_delete payload

    const threads = threadHead.map(mapDBToDetailThread).map((thread) => ({
      ...thread,
      comments,
    }))[0]; // [0] -> show each comment

    return new DetailThread({ ...threads });
  }
}

module.exports = GetDetailThreadUsecase;
