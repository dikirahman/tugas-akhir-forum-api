/* eslint-disable camelcase */

exports.up = (pgm) => {
  /* Table: replies
   * Columns: id, content, date, is_delete, owner, comment_id, thread_id
   * Constraint:
   *          - replies.owner -> users.id
   *          - replies.comment_id -> comments.id
   *          - replies.thread_id -> threads.id
   */
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
    is_delete: {
      type: 'BOOL',
      notNull: true,
      default: false,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  // owner constraint
  pgm.addConstraint(
    'replies',
    'fk_replies.owner__users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );

  // comment_id constraint
  pgm.addConstraint(
    'replies',
    'fk_replies.comment_id__comments.id',
    'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE'
  );

  // thread_id constraint
  pgm.addConstraint(
    'replies',
    'fk_replies.thread_id__threads.id',
    'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  // Remove table and foreign key constrains
  pgm.dropConstraint('replies', 'fk_replies.owner__users.id');
  pgm.dropConstraint('replies', 'fk_replies.comment_id__comments.id');
  pgm.dropConstraint('replies', 'fk_replies.thread_id__threads.id');
  pgm.dropTable('replies');
};
