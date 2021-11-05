const createServer = require('../createServer');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const TokenSessionTestHelper = require('../../../../tests/TokenSessionTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/threads HTTP endpoint', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await TokenSessionTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });
  describe('POST handler', () => {
    it('should response 201 and return right data format', async () => {
      // Arrange
      const requestPayload = {
        title: 'sebuah thread',
        body: 'hello world',
      };
      const accessTokenKey = await TokenSessionTestHelper.getAccesToken({
        id: 'user-0',
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenKey}`,
        },
      });

      // Assert
      const jsonReponse = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(jsonReponse.status).toEqual('success');
      expect(jsonReponse.data.addedThread).toBeDefined();
      expect(jsonReponse.data.addedThread.owner).toEqual('user-0');
    });
    it('should response 400 when payload not meet specs', async () => {
      // Arrange
      const requestPayload = {
        title: 'sebuah thread',
      };
      const accessTokenKey = await TokenSessionTestHelper.getAccesToken({
        id: 'user-0',
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenKey}`,
        },
      });

      // Assert
      const jsonReponse = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(jsonReponse.status).toEqual('fail');
      expect(jsonReponse.message).toBeDefined();
    });
    it('should response 401 when request not contain token', async () => {
      // Arrange
      const requestPayload = {
        title: 'sebuah thread',
        body: 'hello world',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const jsonReponse = JSON.parse(response.payload);
      expect(jsonReponse.statusCode).toEqual(401);
      expect(jsonReponse.error).toEqual('Unauthorized');
      expect(jsonReponse.message).toBeDefined();
    });
  });
  describe('GET handler', () => {
    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-error',
      });

      // Assert
      const jsonReponse = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(jsonReponse.status).toEqual('fail');
      expect(jsonReponse.message).toBeDefined();
    });
    it('should response 200 when thread exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-ganteng',
        username: 'dicoding',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-john',
        username: 'johndoe',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-h_2FkLZhtgBKY2kh4CC02',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-ganteng',
      });
      // Valid comment
      await CommentsTableTestHelper.addComment({
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        content: 'sebuah comment',
        owner: 'user-john',
        thread_id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      });
      // Deleted Comment
      await CommentsTableTestHelper.addComment({
        id: 'comment-yksuCoxM2s4MMrZJO-qVD',
        content: 'Bad Thread!',
        owner: 'user-ganteng',
        thread_id: 'thread-h_2FkLZhtgBKY2kh4CC02',
        is_delete: true,
      });

      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-h_2FkLZhtgBKY2kh4CC02',
      });

      // Assert
      const jsonReponse = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(jsonReponse.status).toEqual('success');
      expect(jsonReponse.data.thread).toBeDefined();
    });
  });
});
