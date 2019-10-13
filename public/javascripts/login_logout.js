$(() =>  {
    /**
    * ログアウト処理
    */
    $(document).on('click', '#logout', () => {
        $.ajax({
            url:'/main/logout',
            type:'POST'
        }).then(() => {
            window.location.href = '/main/1';
        }).catch((err) => {
            console.log(err);
        })
    });

    /**
     * ログイン処理
     */
    $(document).on('click', '#login', () => {
        window.location.href = '/users/login';
    });

    /**
     * フォーム表示処理
     */
    $(document).ready( () => {
        if ($('#username').text() === 'ゲスト') {
            $('#logout-form').addClass('disable');
            $('#login-form').removeClass('disable');
        } else {
            $('#login-form').addClass('disable');
            $('#logout-form').removeClass('disable');
        }
    });
})
