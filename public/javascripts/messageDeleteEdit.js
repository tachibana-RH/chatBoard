$(function(){

    $(document).on('click', '#iconDelete', function(){
        if (window.confirm('メッセージを削除しますか？')) {
            $.ajax({
                url:'./msg',
                type:'DELETE',
                dataType: 'json',
                data:{
                    'msgid': $(this).attr('data-msgid')
                }
            }).then(() => {
                $('html, body').animate({scrollTop: $(document).scrollTop()+30},0);
                location.reload();
            }).catch((err) => {
                console.log(err);
            })
        }
    });

    $(document).on('click', '#iconEdit', function(){
        $.ajax({
            url:'./editMsg',
            type:'POST',
            dataType: 'json',
            data:{
                'msgid': $(this).attr('data-msgid')
            }
        }).then((res) => {
            $('#retouchMsg').attr('data-msgid', res.id);
            $('#retouchMsg').val(res.message);
            $('.drawer').drawer('open');
        }).catch((err) => {
            console.log(err);
        })
    });

    $(document).on('click', '.retouchSubmit', function(){
        $.ajax({
            url:'./msg',
            type:'PUT',
            dataType: 'json',
            data:{
                'msgid': $('#retouchMsg').attr('data-msgid'),
                'msgdata': $('#retouchMsg').val()
            }
        }).then(() => {
            location.reload();
        }).catch((err) => {
            console.log(err);
        })
    });

    $(document).on('click', '.retouchCancel', function(){
        $('.drawer').drawer('close');
    });

});