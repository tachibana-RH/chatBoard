$(function() {
    $(document).on('click', '#deleteBtn', function(){
        if (window.confirm('トピックを削除しますか？')) {
            url = '/main' + '/delete/' + $(this).attr('data-topicid');
            $.ajax({
                url: url,
                type:'POST'
            }).then((res) => {
                console.log(res);
                location.reload();
            }).catch((err) => {
                console.log(err);
            })
        }
    });
})