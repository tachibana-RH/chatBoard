/**
 * マイページのメニューリスト選択処理
 */
$(() => {
    $(document).on('click', '.menu li', function(){
        if ($(this).attr("value") != '') {
            window.location.href = $(this).attr("value");
        }
    });
})
