$(function() {
    $(document).on('click', '.menu li', function(){
        if ($(this).attr("value") != '') {
            window.location.href = $(this).attr("value");
        }
    });
})
