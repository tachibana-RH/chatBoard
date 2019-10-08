/**
 * アイコン画像のアップロード処理
 */
function fileupload(fileObj){
    //　FormDataオブジェクト生成
    const fd = new FormData();
    fd.append('uploadfile', fileObj);

    $.ajax({
        url: './image/upload',
        type: 'POST',
        processData : false,    //　これがないと動作しない
        contentType : false,    //　これがないと動作しない
        dataType : "text",
        data: fd
    })
    .done(function(result){
        console.log(result);
        location.reload();
    });
}

$(function(){
    $('#file_upload').on('change',function(image){
        
        //ファイルオブジェクトを取得する
        const file = image.target.files[0];

        //画像でない場合は処理終了
        if(file.type.indexOf("image") < 0){
            alert("画像ファイルを指定してください。");
            return false;
        }

        //　FormDataにブラウザが対応しているかチェック
        if (window.FormData){
            const fileObj = $('#file_upload')[0].files[0];
            if ( fileObj != null ){
                fileupload(fileObj);
            }
        }else{
            alert("このブラウザはFormDataに対応していません。");
            return false;
        }

    });
});