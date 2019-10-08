const mysql = require('mysql');

const knex = require('knex') ({
  client: 'mysql',
  connection: {
    host    : process.env.NODE_CHATBOARD_DB_HOST,
    user    : process.env.NODE_CHATBOARD_DB_USER,
    password: process.env.NODE_CHATBOARD_DB_PASSWORD,
    database: process.env.NODE_CHATBOARD_DB_NAME,
    charset : 'utf8'
  }
});

const Bookshelf = require('bookshelf')(knex);
Bookshelf.plugin('pagination');
Bookshelf.plugin('registry');
Bookshelf.plugin(require('bookshelf-transaction-manager'));

module.exports.Bookshelf = Bookshelf;

const User = Bookshelf.Model.extend({
    tableName: 'users'
});

module.exports.User = User;

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
