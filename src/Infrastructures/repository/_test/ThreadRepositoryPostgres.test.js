const pool = require('../../database/postgres/pool');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres implementation', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });
  describe('addThread()', () => {
    it('should persist newthread and return addedthread', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'first post',
        body: 'lorem ipsum',
      });
      const expectedAddedThread = new AddedThread({
        id: 'thread-xyz',
        title: newThread.title,
        owner: 'user-0',
      });

      await UsersTableTestHelper.addUser({ id: 'user-0' });
      const fakeIdGenerator = () => 'xyz'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedthread = await threadRepositoryPostgres.addThread(
        newThread,
        'user-0'
      );

      // Assert
      const thread = await ThreadsTableTestHelper.getThreadByThreadId(
        'thread-xyz'
      );
      expect(addedthread).toStrictEqual(expectedAddedThread);
      expect(thread).toHaveLength(1);
    });
  });
  describe('getThreadByThreadId()', () => {
    it('should throw notfounderror when thread doesnt exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      // Action and Assert
      await expect(
        threadRepositoryPostgres.getThreadByThreadId('thread-xyz')
      ).rejects.toThrowError(NotFoundError);
    });
    it('should return valid thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-notfound',
        username: 'ngeselin',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-notfound',
        owner: 'user-notfound',
      });

      // Action
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const result = await threadRepositoryPostgres.getThreadByThreadId(
        'thread-notfound'
      );
      const comments = await threadRepositoryPostgres.getCommentsByThreadId(
        'thread-notfound'
      );
      // Assert
      const { id, title, body, date, owner, username } = result[0];

      expect(result).toHaveLength(1);

      expect(id).toEqual('thread-notfound');
      expect(title).toEqual('first thread');
      expect(body).toEqual('hello world');
      expect(owner).toEqual('user-notfound');
      expect(username).toEqual('ngeselin');
      expect(date).toBeDefined();
      expect(comments).toHaveLength(0); // no comment
    });
  });
  describe('getCommentsByThreadId()', () => {
    it('should return array of comments in valid threads', async () => {
      // Arrange
      // Create user for thread owner
      await UsersTableTestHelper.addUser({
        id: 'user-posting',
        username: 'posting',
      });

      // Create user x for thread commenter
      await UsersTableTestHelper.addUser({
        id: 'user-commenter-first',
        username: 'x',
      });

      // Create user y for thread commenter
      await UsersTableTestHelper.addUser({
        id: 'user-commenter-second',
        username: 'y',
      });

      // Inserting new thread
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-posting',
      });

      // Insert comment
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        owner: 'user-commenter-first',
        content: 'first gan',
        thread_id: 'thread-123',
      });

      // Insert deleted comment
      await CommentsTableTestHelper.addComment({
        id: 'comment-2',
        owner: 'user-commenter-second',
        content: 'nomer dua dapet apa nih',
        thread_id: 'thread-123',
        is_delete: true,
      });

      // creating repository deps
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const threads = await threadRepositoryPostgres.getThreadByThreadId(
        'thread-123'
      );
      const comments = await threadRepositoryPostgres.getCommentsByThreadId(
        'thread-123'
      );

      // Assert
      await expect(threads).toHaveLength(1);

      const { id, title, body, date, owner, username } = threads[0];

      // Check Thread
      expect(id).toEqual('thread-123');
      expect(owner).toEqual('user-posting');
      expect(username).toEqual('posting');
      expect(title).toBeDefined();
      expect(body).toBeDefined();
      expect(date).toBeDefined();
      
      // Check Comment
      await expect(comments).toHaveLength(2);

      await expect(comments[0].id).toEqual('comment-1');
      await expect(comments[0].is_delete).toEqual(false);
      await expect(comments[0].owner).toEqual('user-commenter-first');
      await expect(comments[0].username).toEqual('x');
      await expect(comments[0].content).toEqual('first gan');
      await expect(comments[0].thread_id).toEqual('thread-123');
      await expect(comments[0].date).toBeDefined();

      await expect(comments[1].id).toEqual('comment-2');
      await expect(comments[1].owner).toEqual('user-commenter-second');
      await expect(comments[1].content).toEqual('nomer dua dapet apa nih');
      await expect(comments[1].username).toEqual('y');
      await expect(comments[1].thread_id).toEqual('thread-123');
      await expect(comments[1].is_delete).toEqual(true);
      await expect(comments[1].date).toBeDefined();
    });
  });
});
