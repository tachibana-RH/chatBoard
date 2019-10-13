/**
 * ヘッダーとメッセージ入力フォームの変化処理
 */
$(() => {
    if($(window).scrollTop() > 60) {
        $('#titleDummy').removeClass('disable');
        $('#titleDummy').addClass('dummyOn');
        $('#title').addClass('fixed');
    }
    $(window).scroll(() => {
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

const focusA = $this => {
    $("#msg").removeClass('msg');
    $("#msg").addClass('msgFocus');
    $("#page").addClass('disable');
}
const blurA = $this => {
    $("#msg").removeClass('msgFocus');
    $("#msg").addClass('msg');
    $("#page").removeClass('disable');
}