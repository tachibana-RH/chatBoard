
const socket = io.connect('http://localhost:3000');

socket.on('news',function(data){
    displayMessage(data);
});

const displayMessage = (data) => {
    if($('header').data('topicid') == data.topic_id) {
        const messagesArray = data.message.split(/\r?\n/g);
        let messages = '';
        for (let index in messagesArray) {
            console.log(index + ':' + messages);
            if (messagesArray[index] === '') {
                messages += '<br>\n';
            } else { 
                if (messagesArray[index].substr(0,4) == 'http') {
                    messages += '<p>\n' + 
                    '<a style="color: white;" href="' + messagesArray[index] + '" target="_blank">\n' +
                    messagesArray[index] + '</a>\n</p>\n';
                } else {
                    messages += '<p>\n' + messagesArray[index] + '\n' + '</p>\n';
                };
            };
            console.log(index + ':' + messages);
        };

        if ($('#msgParent').children().length == 10) {
            $('#msgParent div:first-child').remove();
        };

        if($('header').data('userid') == data.user_id) {
            const child = getSelfMessage(data,messages);
            $('#msgParent').append(child);
            $('html, body').animate({scrollTop: $(document).height()},0);
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
                        '<td class="messageLeft">\n' +
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
            url:'./sendMsg',
            type:'POST',
            dataType: 'json',
            data:{
                'msg': $('#msg').val()
            }
        }).then((res) => {
            console.log('ajax success');
            $('#msg').val('');
            socket.emit('message', res);
        }).catch((err) => {
            console.log(err);
        })
    });

    $(window).scroll(function () {
        if ($(this).scrollTop() > 99) {
            $('#title').addClass('fixed');
        } else {
            $('#title').removeClass('fixed');
        };
    });

});

function focusA( $this ) {
    $("#msg").removeClass('msg');
    $("#msg").addClass('msgFocus');
    $("#page").addClass('disable');
}
function blurA( $this ) {
    $("#msg").removeClass('msgFocus');
    $("#msg").addClass('msg');
    $("#page").removeClass('disable');
}