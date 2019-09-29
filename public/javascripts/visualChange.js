
function focusA( $this ) {
    $("#msg").removeClass('msg');
    $("#msg").addClass('msgFocus');
    $("#page").addClass('disable');
}
function blurA( $this ) {
    $("#msg").removeClass('msgFocus');
    $("#msg").addClass('msg');
    $("#page").removeClass('disable');
}

$(function(){
    if($(window).scrollTop() > 60) {
        $('#titleDummy').removeClass('disable');
        $('#titleDummy').addClass('dummyOn');
        $('#title').addClass('fixed');
    }
    $(window).scroll(function () {
        if ($(this).scrollTop() > 60) {
            $('#titleDummy').removeClass('disable');
            $('#titleDummy').addClass('dummyOn');
            $('#title').addClass('fixed');
        } else {
            $('#titleDummy').removeClass('dummyOn');
            $('#titleDummy').addClass('disable');
            $('#title').removeClass('fixed');
        };
    });
});