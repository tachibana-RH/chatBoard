/**
 * ゲストのログイン処理
 */
$(() =>  {
    $(document).on('click', '.guestlogin', () => {
        $.ajax({
            url:'./guestlogin',
            type:'POST',
            crossDomain: true,
            cache:false,
            xhrFields: {
                withCredentials: true
            }
        }).then(() => {
            window.location.href = '/main/1';
        }).catch((err) => {
            console.log(err);
        })
    });
})