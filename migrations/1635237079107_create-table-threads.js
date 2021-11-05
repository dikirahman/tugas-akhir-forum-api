/* eslint-disable camelcase */

exports.up = (pgm) => {
  /* Table: threads
   * Columns: id, title, body, date, owner
   * Constraint: threads.owner -> users.id
   */
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'TEXT',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'threads',
    'fk_threads.owner__users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  // Remove table and foreign key constrains
  pgm.dropConstraint('threads', 'fk_threads.owner__users.id');
  pgm.dropTable('threads');
};
