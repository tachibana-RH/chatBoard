$(function() {
    $(document).on('click', '#logout', function(){
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