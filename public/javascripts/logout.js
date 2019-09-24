$(function() {
    $(document).on('click', '#logout', function(){
        $.ajax({
            url:'./logout',
            type:'POST'
        }).then((res) => {
            window.location.href = '/users/login';
        }).catch((err) => {
            console.log(err);
        })
    });
})