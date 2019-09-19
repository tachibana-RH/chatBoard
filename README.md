# chatBoard
チャット式の掲示板アプリ

DBname: miniboard-db
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
        top - varchar(255)
        comment - varchar(255)
        icon - varchar(255)
    topics:
        id(praymary) - int
        name - varchar(255)
        user_id - int
        count - int
        created_at - datetime
        updated_at - datetime
