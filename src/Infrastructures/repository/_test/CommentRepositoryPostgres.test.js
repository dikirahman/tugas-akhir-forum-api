const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });
  describe('addComment()', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({ content: 'Nice Thread!' });
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => 'xyz'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        newComment,
        'thread-123',
        'user-123'
      );

      // Assert
      const comment = await CommentsTableTestHelper.getCommentByCommentId(
        'comment-xyz'
      );
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-xyz',
          content: 'Nice Thread!',
          owner: 'user-123',
        })
      );
      expect(comment).toHaveLength(1);
      expect(comment[0].is_delete).toEqual(false);
    });
    it('should throw error when thread not found', async () => {
      // Arrange
      const newComment = new NewComment({ content: 'Nice Post' });
      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      await UsersTableTestHelper.addUser({ id: 'user-komeng' });

      // Action and Assert
      await expect(
        commentRepositoryPostgres.addComment(
          newComment,
          'thread-12',
          'user-komeng'
        )
      ).rejects.toThrowError(NotFoundError);
    });
  });
  describe('verifyCommentAccess()', () => {
    it('should throw NotFoundError when comment doesnt exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action and Assert
      await expect(
        commentRepositoryPostgres.verifyCommentAccess(
          'commment-dead',
          'user-xyz'
        )
      ).rejects.toThrowError(NotFoundError);
    });
    it('should throw AuthorizationError when credentials is not comment owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-owner' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-new',
        owner: 'user-owner',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'Nice Post',
        owner: 'user-owner',
        thread_id: 'thread-new',
      });
      // Action
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Assert
      await expect(
        commentRepositoryPostgres.verifyCommentAccess(
          'comment-123',
          'user-other'
        )
      ).rejects.toThrowError(AuthorizationError);
    });
    it('should delete comment by right access', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-xzy' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-xzy',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-xyz',
        owner: 'user-xzy',
        thread_id: 'thread-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action
      await expect(
        commentRepositoryPostgres.verifyCommentAccess('comment-xyz', 'user-xzy')
      ).resolves.not.toThrow(NotFoundError);
      await expect(
        commentRepositoryPostgres.verifyCommentAccess('comment-xyz', 'user-xzy')
      ).resolves.not.toThrow(AuthorizationError);
    });
  });
  describe('deleteCommentByCommentId()', () => {
    it('should throw notfounderror when comment not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action and Assert
      await expect(
        commentRepositoryPostgres.deleteCommentByCommentId('comment-213')
      ).rejects.toThrowError(NotFoundError);
    });
    it('should update is_delete=true comments column and return success', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-deleter' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-fresh',
        owner: 'user-deleter',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-xxx',
        owner: 'user-deleter',
        thread_id: 'thread-fresh',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action
      const result = await commentRepositoryPostgres.deleteCommentByCommentId(
        'comment-xxx'
      );
      const comment = await CommentsTableTestHelper.getCommentByCommentId(
        'comment-xxx'
      );
      // Assert
      expect(result.status).toEqual('success');
      expect(comment[0].id).toEqual('comment-xxx');
      expect(comment[0].is_delete).toEqual(true);
    });
  });
});
