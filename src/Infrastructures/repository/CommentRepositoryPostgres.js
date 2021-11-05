const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment, threadId, owner) {
    const id = `comment-${this._idGenerator()}`;
    const { content } = newComment;
    const date = new Date().toISOString();
    const isDelete = false;

    const sqlQuery = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    // Thread Check
    const threadResult = await this._pool.query(sqlQuery);
    if (!threadResult.rowCount) {
      throw new NotFoundError(
        'tidak dapat menambahkan komentar: thread, tidak ditemukan'
      );
    }
    const addingCommentSqlQuery = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, date, isDelete, threadId],
    };
    const result = await this._pool.query(addingCommentSqlQuery);
    return new AddedComment({ ...result.rows[0] });
  }

  async verifyCommentAccess(commentId, credentialId) {
    const commentSqlQuery = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(commentSqlQuery);
    const comments = result.rows[0];
    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
    if (comments.owner !== credentialId) {
      throw new AuthorizationError(
        'tidak dapat menghapus komentar, akses ditolak'
      );
    }
  }

  async deleteCommentByCommentId(id) {
    const deleteSqlQuery = {
      text: 'UPDATE comments SET is_delete=true WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(deleteSqlQuery);
    if (!result.rowCount) {
      throw new NotFoundError(
        'Komentar gagal dihapus, komentar tidak ditemukan'
      );
    }
    return { status: 'success' };
  }
}

module.exports = CommentRepositoryPostgres;
