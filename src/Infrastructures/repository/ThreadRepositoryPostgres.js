const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(payload, owner) {
    const id = `thread-${this._idGenerator()}`;
    const { title, body } = payload;
    const date = new Date().toISOString();

    const sqlQuery = {
      text: 'INSERT INTO threads VALUES($1, $2, $3 ,$4,$5) RETURNING id, title, owner',
      values: [id, title, body, date, owner],
    };

    const result = await this._pool.query(sqlQuery);
    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadByThreadId(id) {
    const threadSqlQuery = {
      text: `
      SELECT  threads.*, 
              users.username 
      FROM threads 
      LEFT  JOIN users 
            ON users.id = threads.owner
      WHERE threads.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(threadSqlQuery);
    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    return result.rows;
  }

  async getCommentsByThreadId(id) {
    const commentsSqlQuery = {
      text: `
          SELECT comments.*, users.username 
              FROM comments 
          LEFT JOIN users
              ON users.id = comments.owner
          WHERE comments.thread_id = $1 
              ORDER BY date ASC`,
      values: [id],
    };
    const comments = await this._pool.query(commentsSqlQuery);
    return comments.rows;
  }
}
module.exports = ThreadRepositoryPostgres;
