const mysql = require('mysql');
if (process.env.NODE_ENV.trim() === 'development') {
  require('dotenv').config();
}

const opts = {
    host    : process.env.NODE_CHATBOARD_DB_HOST,
    user    : process.env.NODE_CHATBOARD_DB_USER,
    password: process.env.NODE_CHATBOARD_DB_PASSWORD,
    database: process.env.NODE_CHATBOARD_DB_NAME,
    charset : 'utf8'
};

const knex = require('knex') ({
  client: 'mysql',
  connection: opts
});

const Bookshelf = require('bookshelf')(knex);
Bookshelf.plugin('pagination');
Bookshelf.plugin('registry');
Bookshelf.plugin('bookshelf-transaction-manager');

const User = Bookshelf.Model.extend({
  tableName: 'users'
});

module.exports.opts = opts;

module.exports.Bookshelf = Bookshelf;

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
