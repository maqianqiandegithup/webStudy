const Excel = require('exceljs')
const excelfile = "./excel/t1.xlsx";  //这是要导入的.xlsx文件的路径
var workbook = new Excel.Workbook();

workbook.xlsx.readFile(excelfile).then(function () {
    var worksheet = workbook.getWorksheet(1); //获取第一个worksheet
    worksheet.eachRow(function (row, rowNumber) {
        console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
    });
});