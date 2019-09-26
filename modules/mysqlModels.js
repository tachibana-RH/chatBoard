const mysql = require('mysql');

const knex = require('knex') ({
  client: 'mysql',
  connection: {
    host    : process.env.CHATBOARD_DB_HOST,
    user    : process.env.CHATBOARD_DB_USER,
    password: process.env.CHATBOARD_DB_PASSWORD,
    database: process.env.CHATBOARD_DB_NAME,
    charset : 'utf8'
  }
});

const Bookshelf = require('bookshelf')(knex);
Bookshelf.plugin('pagination');

const User = Bookshelf.Model.extend({
    tableName: 'users'
});

module.exports.User = Bookshelf.Model.extend({
    tableName: 'users'
});

module.exports.Topic = Bookshelf.Model.extend({
    tableName: 'topics',
    hasTimestamps: true,
    user: function() {
      return this.belongsTo(User);
    }
});

module.exports.Message = Bookshelf.Model.extend({
    tableName: 'messages',
    hasTimestamps: true,
    user: function() {
        return this.belongsTo(User);
    }
});
