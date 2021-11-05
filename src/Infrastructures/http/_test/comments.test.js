const createServer = require('../createServer');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const TokenSessionTestHelper = require('../../../../tests/TokenSessionTestHelper');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await TokenSessionTestHelper.cleanTable();
  });
  describe('POST handler', () => {
    it('should response 201 and persisted addedComment', async () => {
      // Arrange
      const requestPayload = {
        content: 'very helpful,Nice Thread!',
      };

      const accesToken = await TokenSessionTestHelper.getAccesToken({
        id: 'user-commenter',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-thread-owner',
        username: 'dicoding-owner',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'SHIB to the moon!',
        body: 'Some description',
        owner: 'user-thread-owner',
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accesToken}`,
        },
      });

      // Assert
      const jsonResponse = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(jsonResponse.status).toEqual('success');
      expect(jsonResponse.data.addedComment).toBeDefined();
      expect(jsonResponse.data.addedComment.owner).toEqual('user-commenter');
    });
    it('should response 401 when user doesnt have login session', async () => {
      // Arrange
      const requestPayload = {
        content: 'Nice bro! SHIB to the moon..',
      };
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
      });

      expect(response.statusCode).toEqual(401);
    });
    it('should response 404 When thread notfound', async () => {
      // Arrange
      const requestPayload = {
        content: 'very helpful,Nice Thread!',
      };

      const accesToken = await TokenSessionTestHelper.getAccesToken({
        id: 'user-commenter',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-thread-owner',
        username: 'dicoding-owner',
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accesToken}`,
        },
      });

      // Assert
      const jsonResponse = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(jsonResponse.status).toEqual('fail');
      expect(jsonResponse.message).toBeDefined();
    });
  });
  describe('DELETE handler', () => {
    it('should throw 404 when comment doesnt exist', async () => {
      // Arrange
      const accessToken = await TokenSessionTestHelper.getAccesToken({
        id: 'user-badactor',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-rightaccess',
        username: 'john',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-rightaccess',
      });
      const server = await createServer(container);
      // Action and Assert
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/xxx',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Assert
      const jsonResponse = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(jsonResponse.status).toEqual('fail');
      expect(jsonResponse.message).toBeDefined();
    });
    it('should throw 403 when not comments owner', async () => {
      // Arrange
      const accesToken = await TokenSessionTestHelper.getAccesToken({
        id: 'user-bad',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-good',
        username: 'alice',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-1',
        owner: 'user-good',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-good',
        thread_id: 'thread-1',
      });
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accesToken}`,
        },
      });
      // Assert
      const jsonResponse = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(jsonResponse.status).toEqual('fail');
    });
    it('should delete comment correctly and response 200 OK', async () => {
      // Arrange
      const accesToken = await TokenSessionTestHelper.getAccesToken({
        id: 'user-owner',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-exist',
        title: 'hello world',
        body: 'lorem',
        owner: 'user-owner',
      });
      await CommentsTableTestHelper.addComment({
        thread_id: 'thread-exist',
        id: 'comment-1',
        owner: 'user-owner',
      });

      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-exist/comments/comment-1',
        headers: {
          Authorization: `Bearer ${accesToken}`,
        },
      });
      // console.log(response);
      // Assert
      const jsonResponse = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(jsonResponse.status).toEqual('success');
    });
  });
});
