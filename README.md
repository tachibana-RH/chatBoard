# chatBoard
チャット式の掲示板アプリ<br>
<br>
DBの情報
<br>
host    : process.env.CHATBOARD_DB_HOST<br>
user    : process.env.CHATBOARD_DB_USER<br>
password: process.env.CHATBOARD_DB_PASSWORD<br>
database: process.env.CHATBOARD_DB_NAME<br>

windows
set CHATBOARD_DB_HOST=localhost
set CHATBOARD_DB_USER=root
set CHATBOARD_DB_PASSWORD=
set CHATBOARD_DB_NAME=chatboard-db

linux mac
export CHATBOARD_DB_HOST=localhost
export CHATBOARD_DB_USER=root
export CHATBOARD_DB_PASSWORD=root
export CHATBOARD_DB_NAME=chatboard-db

tables:<br>
    messages:<br>
        id(praymary) - int<br>
        user_id - int<br>
        topic_id - int<br>
        message - text<br>
        created_at - datetime<br>
        updated_at - datetime<br>
    users:<br>
        id(praymary) - int<br>
        name - varchar(255)<br>
        password - varchar(255)<br>
        comment - varchar(255)<br>
        icon - varchar(255)<br>
    topics:<br>
        id(praymary) - int<br>
        name - varchar(255)<br>
        user_id - int<br>
        count - int<br>
        created_at - datetime<br>
        updated_at - datetime<br>