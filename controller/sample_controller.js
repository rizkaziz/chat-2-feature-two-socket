const express = require('express');

const methodGet = (req,res)=>{
    res.send('Contoh menggunakan GET');
}

const methodPost = (req,res)=>{
    res.send('Contoh menggunakan Post');
}

const methodPut = (req,res)=>{
    res.send('Contoh menggunakan Put');
}

const methodDelete = (req,res)=>{
    res.send('Contoh menggunakan Delete');
}



//dibuat agar bisa dikonsumsi file lain
module.exports = {
    methodGet, methodPost, methodPut, methodDelete
}


//untuk instansiasi mysql npm install mysql2 sequelize
//untuk menjalankan postman npm start