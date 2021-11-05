/* eslint-disable camelcase */

exports.up = (pgm) => {
  /* Table: comments
   * Columns: id, content, owner, date, is_delete, thread_id
   * Constraint:
   *          - comments.owner -> users.id
   *          - comments.thread_id -> threads.id
   */
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
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
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  // owner constraint
  pgm.addConstraint(
    'comments',
    'fk_comments.owner__users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );

  // thread_id constraint
  pgm.addConstraint(
    'comments',
    'fk_comments.thread_id__threads.id',
    'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  // Remove table and foreign key constrains
  pgm.dropConstraint('comments', 'fk_comments.owner__users.id');
  pgm.dropConstraint('comments', 'fk_comments.thread_id__threads.id');
  pgm.dropTable('comments');
};
