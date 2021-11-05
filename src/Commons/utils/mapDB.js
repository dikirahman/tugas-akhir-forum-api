/* istanbul ignore file */
/* eslint-disable camelcase */

const mapDBToDetailThread = ({ id, title, body, date, username }) => ({
  id,
  title,
  body,
  date,
  username,
});

const mapDBToDetailComment = ({ id, username, date, content }) => ({
  // Remove is_delete payload
  id,
  username,
  date,
  content,
});

module.exports = { mapDBToDetailThread, mapDBToDetailComment };
