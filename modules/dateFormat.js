const dateFormat = date => {
    const dateYear = date.getFullYear();
    const dateMonth = ((date.getMonth() + 1).toString().length == 1)?'0' + (date.getMonth() + 1):(date.getMonth() + 1);
    const dateDate = (date.getDate().toString().length == 1)?'0' + date.getDate():date.getDate();
    const dateHours = (date.getHours().toString().length == 1)?'0' + date.getHours():date.getHours();
    const dateMinutes = (date.getMinutes().toString().length == 1)?'0' + date.getMinutes():date.getMinutes();
    const dateSeconds = (date.getSeconds().toString().length == 1)?'0' + date.getSeconds():date.getSeconds(); 
    const dateStr = dateYear + '-' + dateMonth + '-' + dateDate + ' ' + dateHours + ':' + dateMinutes + ':' + dateSeconds;
    return dateStr;
}
module.exports.exec = dateFormat;