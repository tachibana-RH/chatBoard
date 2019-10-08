/**
 * ログアウト処理
 */
$(() =>  {
    $(document).on('click', '#logout', () => {
        $.ajax({
            url:'/main/logout',
            type:'POST'
        }).then(() => {
            window.location.href = '/users/login';
        }).catch((err) => {
            console.log(err);
        })
    });
})