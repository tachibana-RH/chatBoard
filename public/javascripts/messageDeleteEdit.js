$(function(){

    $(document).on('click', '#iconDelete', function(){
        if (window.confirm('メッセージを削除しますか？')) {
            $.ajax({
                url:'./deleteMsg',
                type:'POST',
                dataType: 'json',
                data:{
                    'msgid': $(this).attr('data-msgid')
                }
            }).then((res) => {
                console.log(res);
                $('html, body').animate({scrollTop: $(document).scrollTop()+30},0);
                location.reload();
            }).catch((err) => {
                console.log(err);
            })
        }
    });

    //aタグ全体の正規表現
    //
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
            url:'./retouchMsg',
            type:'POST',
            dataType: 'json',
            data:{
                'msgid': $('#retouchMsg').attr('data-msgid'),
                'msgdata': $('#retouchMsg').val()
            }
        }).then((res) => {
            location.reload();
        }).catch((err) => {
            console.log(err);
        })
    });

    $(document).on('click', '.retouchCancel', function(){
        $('.drawer').drawer('close');
    });

});