
function fileupload(fileObj){
    //　FormDataオブジェクト生成
    const fd = new FormData().append('uploadfile', fileObj);
    $.ajax({
        url: './upload',        //　ファイルを渡すサーバのurl
        type: 'POST',
        processData : false,    //　重要！これがないと動作しない
        contentType : false,    //　重要！これがないと動作しない
        dataType : "text",
        data: fd
    })
    .done(function(result){
        console.log(result);
        location.reload();
    });
}

$(function(){
    // Ajax button click
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
        // //ファイルオブジェクトを取得する
        // const file = image.target.files[0];

        // //画像でない場合は処理終了
        // if(file.type.indexOf("image") < 0){
        //     alert("画像ファイルを指定してください。");
        //     return false;
        // }
        // // const fileObj = $('#file_upload')[0].files[0];
        // // let fd = new FormData();          //FormDataオブジェクト生成
        // // fd.append('uploadfile', fileObj);    //フォームアイテム名でオブジェクトをfdに追加
        // console.log(file);
        // // POSTでアップロード
        // $.ajax({
        //     url  : "./upload",
        //     type : "POST",
        //     data : file,
        //     cache       : false,
        //     contentType : false,
        //     processData : false,
        //     dataType    : "text"
        // })
        // .done(function(data, textStatus, jqXHR){
        //     alert(data);
        // })
        // .fail(function(jqXHR, textStatus, errorThrown){
        //     alert("fail");
        // });
//     });
// });