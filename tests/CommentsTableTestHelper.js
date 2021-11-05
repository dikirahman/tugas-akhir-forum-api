/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'Nice Thread!',
    owner = 'user-123',
    date = new Date().toISOString(),
    is_delete = false,
    thread_id = 'thread-123',
  }) {
    const sqlQuery = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, owner, date, is_delete, thread_id],
    };
    await pool.query(sqlQuery);
  },
  async getCommentByCommentId(id) {
    const sqlQuery = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(sqlQuery);
    return result.rows;
  },
  async deleteCommentByCommentId(id) {
    const sqlQuery = {
      text: 'UPDATE FROM comments SET is_delete=true WHERE id = $1',
      values: [id],
    };
    await pool.query(sqlQuery);
  },
  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
