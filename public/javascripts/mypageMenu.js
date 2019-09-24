$(function() {
    $(document).on('click', '.menu li', function(){
        console.log($(this).attr("value"));
        if ($(this).attr("value") != '') {
            window.location.href = $(this).attr("value");
        }
    });
})
