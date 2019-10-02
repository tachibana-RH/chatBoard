
const socket = io.connect('http://chatsboard.com:49160');

socket.on('news',function(data){
    displayMessage(data);
});

const displayMessage = (data) => {
    if($('#title').data('topicid') == data.topic_id) {
        const messagesArray = data.message.split(/\r?\n/g);
        let messages = '';
        for (let index in messagesArray) {
            if (messagesArray[index] === '') {
                messages += '<br>\n';
            } else { 
                if (messagesArray[index].substr(0,4) == 'http') {
                    messages += '<p>\n' + 
                    '<a style="color: rgb(219, 255, 222);" href="' + messagesArray[index] + '" target="_blank">\n' +
                    messagesArray[index] + '</a>\n</p>\n';
                } else {
                    messages += '<p>\n' + messagesArray[index] + '\n' + '</p>\n';
                };
            };
        };

        if ($('#msgParent').children().length == 10) {
            $('#msgParent div:first-child').remove();
        };

        if($('#title').data('userid') == data.user_id) {
            const child = getSelfMessage(data,messages);
            $('#msgParent').append(child);
            $('html, body').animate({scrollTop: $(document).height()},0);
            location.reload();
        } else {
            const child = getOtherMessage(data,messages);
            $('#msgParent').append(child);
        };

    };
}

const getSelfMessage = (data,messages) => {
    const currentTime = Date();
    const user_icon = data.user_icon || "icon_default.jpeg";
    const child = '<div class="message">\n' +
                '<table>\n' + 
                    '<tr>\n' +
                        '<td class="messageDummy"></td>\n' +
                        '<td class="messageRight">\n' +
                        messages +
                        '</td>\n' +
                        '<th>\n' +
                        '<a class="home" href="/home/' + data.user_id + '/1">\n' +
                        '<img src="/images/' + user_icon + '" width="30px" height="30px">\n' +
                        '<figcaption>\n' + data.user_name + '\n' + '</figcaption>\n' +
                        '</a>\n' +
                        '</th>\n' +
                    '</tr>\n' +
                    '<tr>\n' +
                        '<th></th>\n' +
                        '<td style = "color: gray; text-align: right;">\n' +
                        '<span>\n' +
                        '<i class="fa fa-clock-o"></i>\n' +
                        currentTime + '\n' +
                        '</span>\n' +
                        '</td>\n' +
                    '</tr>\n' +
                '</table>\n' +
            '</div>';
    return child;
}

const getOtherMessage = (data,messages) => {
    const currentTime = Date();
    const user_icon = data.user_icon || "icon_default.jpeg";
    const child = '<div class="message">\n' +
                '<table>\n' +
                    '<tr>\n' +
                        '<th>\n' +
                        '<a class="home" href="/home/' + data.user_id + '/1">\n' +
                        '<img src="/images/' + user_icon + '" width="30px" height="30px">\n' +
                        '<figcaption>\n' + data.user_name + '\n' + '</figcaption>\n' +
                        '</a>\n' +
                        '</th>\n' +
                        '<td class="messageLeft" id="' + data.messege_id + '">\n' +
                        messages +
                        '</td>\n' +
                        '<td class="messageDummy"></td>\n' +
                    '</tr>\n' +
                    '<tr>\n' +
                        '<th></th>\n' +
                        '<td style = "color: gray;">\n' +
                        '<span>\n' +
                        '<i class="fa fa-clock-o"></i>\n' +
                        currentTime + '\n' +
                        '</span>\n' +
                        '</td>\n' +
                    '</tr>\n' +
                '</table>\n' +
            '</div>';
    return child;
}

$(function(){
    // Ajax button click
    $('#submit').on('click',function(){
        $.ajax({
            url:'./msg',
            type:'POST',
            dataType: 'json',
            data:{
                'msg': $('#msg').val()
            }
        }).then((res) => {
            $('#msg').val('');
            socket.emit('message', res);
        }).catch((err) => {
            console.log(err);
        })
    });

});
