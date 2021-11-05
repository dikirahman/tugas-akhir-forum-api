/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const TokenSessionTestHelper = {
  async getAccesToken({ id = 'user-0' }) {
    await UsersTableTestHelper.addUser({ id });
    const accesToken = Jwt.token.generate({ id }, process.env.ACCESS_TOKEN_KEY);
    const refreshToken = Jwt.token.generate(
      { id },
      process.env.REFRESH_TOKEN_KEY
    );

    const grantAccessSQLQuery = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [refreshToken],
    };
    await pool.query(grantAccessSQLQuery);

    return accesToken;
  },
  async cleanTable() {
    await UsersTableTestHelper.cleanTable();
    await pool.query('DELETE FROM authentications WHERE 1=1');
  },
};
module.exports = TokenSessionTestHelper;
