/**
 * トピック削除処理
 */
$(() =>  {
    $(document).on('click', '#deleteBtn', function() {
        if (window.confirm('トピックを削除しますか？')) {
            url = '/main/' + $(this).attr('data-topicid');
            $.ajax({
                url: url,
                type:'DELETE'
            }).then(() => {
                location.reload();
            }).catch((err) => {
                console.log(err);
            })
        }
    });
})