# chatBoard
チャット式の掲示板アプリ<br>
<br>
DBの情報<br>
<br>
<pre>
host    : process.env.CHATBOARD_DB_HOST
user    : process.env.CHATBOARD_DB_USER
password: process.env.CHATBOARD_DB_PASSWORD
database: process.env.CHATBOARD_DB_NAME

windows
set CHATBOARD_DB_HOST=localhost
set CHATBOARD_DB_USER=root
set CHATBOARD_DB_PASSWORD=root
set CHATBOARD_DB_NAME=chatboard-db

linux mac
export CHATBOARD_DB_HOST=localhost
export CHATBOARD_DB_USER=root
export CHATBOARD_DB_PASSWORD=root
export CHATBOARD_DB_NAME=chatboard-db

tables:
    messages:
        id(praymary) - int
        user_id - int
        topic_id - int
        message - text
        created_at - datetime
        updated_at - datetime
    users:
        id(praymary) - int
        name - varchar(255)
        password - varchar(255)
        comment - varchar(255)
        icon - varchar(255)
    topics:
        id(praymary) - int
        name - varchar(255)
        user_id - int
        count - int
        created_at - datetime
        updated_at - datetime
</pre>