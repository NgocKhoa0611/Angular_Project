var db = require('./database');
const exp = require("express");
const app = exp();
const port = 3000;
var cors = require("cors");
app.use(cors());
app.use(exp.json());

app.get("/", (req, res) => {
    res.json("{'message': 'API NodeJS Assignment'}");
});

//other path
app.get('/du_an', function (req, res, next) {
    let sql = `SELECT id, ten_du_an, ngay_start, tien, leader, thanh_vien FROM du_an ORDER BY ngay_start desc`;
    db.query(sql, function(err, data){
        if (err) res.json({'message':err});
        else res.json(data);
    });
});
app.get('/du_an/:id', function (req, res, next) {
    let id = req.params.id;
    if (isNaN(id)==true) return res.json({'message':'Dự án không tồn tại'});
    
    let sql = `SELECT id, ten_du_an, ngay_start, tien, leader, thanh_vien FROM du_an WHERE id=? ORDER BY ngay_start desc`;
    db.query(sql, id, function(err, data){
        if (err) res.json({'message':err});
        else if (data.length==0)res.json({'message':'Dự án không có'});
        else res.json(data[0]);
    });
});
app.get('/nhan_vien', function(req, res, next) {
    let sql = `SELECT id, ho, ten, ngay_sinh, phai, khu_vuc FROM nhan_vien`;
    db.query(sql, function(err, data) {
        if (err) res.json({'message':err});
        else res.json(data);
    });
});
app.get('/nhan_vien/:id', function(req, res, next) {
    let id = req.params.id;
    if (isNaN(id)==true) return res.json({'message':'Nhân viên không tồn tại'});
    let sql = `SELECT id, ho, ten, ngay_sinh, phai, khu_vuc FROM nhan_vien WHERE id=?`;
    db.query(sql, id, function(err, data) {
        if (err) res.json({'message':err});
        else if (data.length==0) res.json({'message':'Nhân viên không có'});
        return res.json(data[0]);
    });
});
app.get('/task', function(req, res, next) {
    let sql = `SELECT id, ten_task, du_an_id, nhan_vien_id, mo_ta, status, priority FROM task`;
    db.query(sql, function(err, data) {
        if (err) res.json({'message':err});
        else res.json(data);
    });
});
app.get('/task/:id', function(req, res, next){
    let id = req.params.id;
    if (isNaN(id)==true) return res.json({'message':'Task không tồn tại'});
    let sql = `SELECT id, ten_task, du_an_id, nhan_vien_id, mo_ta, status, priority FROM task WHERE id=?`;
    db.query(sql, id, function(err, data) {
        if (err) res.json({'message':err});
        else if (data.length==0) res.json({'message':'Task không có'});
        return res.json(data[0]);
    });
});

//dự án
app.post('/du_an', function(req, res){
    let { ten_du_an, ngay_start, tien, leader, thanh_vien } = req.body;
    console.log(req.body, thanh_vien.join(','));
    let sql = "INSERT INTO du_an SET ten_du_an=?, ngay_start=?, tien=?, leader=?, thanh_vien=?";
    db.query(sql, [ ten_du_an, ngay_start, tien, leader, thanh_vien .join(',') ], (err, d) => {
        if(err) res.json({'thongbao': 'Lỗi khi chèn dự án: ' + err});
        else res.json({"thongbao": "Đã chèn xong dự án"});
    });
});
app.put('/du_an/:id', function (req, res){
    let data = req.body;
    let id = req.params.id;
    let { ten_du_an, ngay_start, tien, leader, thanh_vien } = req.body;
    let sql = 'UPDATE du_an SET ten_du_an=?, ngay_start=?, tien=?, leader=?, thanh_vien=? WHERE id=?';
    db.query(sql, [ ten_du_an, ngay_start, tien, leader, thanh_vien .join(','), id ], (err, d) => {
        if(err) res.json({'thongbao': 'Lỗi khi cập nhật dự án: ' + err});
        else res.json({"thongbao": "Đã cập nhật dự án"});
    });
});
app.delete('/du_an/:id', function(req, res){
    let id = req.params.id;
    let sql = 'DELETE FROM du_an WHERE id=?';
    db.query(sql, id, (err, d) => {
        if(err) res.json({'thongbao': 'Lỗi khi xóa dự án: ' + err});
        else res.json({"thongbao": "Đã xóa dự án"});
    }); 
});

//nhân viên
app.post('/nhan_vien', function(req, res){
    let { ho, ten, ngay_sinh, phai, khu_vuc } = req.body;
    let sql = "INSERT INTO nhan_vien SET ho=?, ten=?, ngay_sinh=?, phai=?, khu_vuc=?";
    db.query(sql, [ ho, ten, ngay_sinh, phai, khu_vuc ], (err, d) => {
        if(err) res.json({'thongbao': 'Lỗi khi chèn nhân viên: ' + err});
        else res.json({"thongbao": "Đã chèn xong nhân viên"});
    });
});
app.put('/nhan_vien/:id', function(req, res){
    let data = req.body;
    let id = req.params.id;
    let { ho, ten, ngay_sinh, phai, khu_vuc } = req.body;
    let sql = 'UPDATE nhan_vien SET ho=?, ten=?, ngay_sinh=?, phai=?, khu_vuc=? WHERE id=?';
    db.query(sql, [ ho, ten, ngay_sinh, phai, khu_vuc, id ], (err, d) => {
        if(err) res.json({'thongbao': 'Lỗi khi cập nhật nhân viên: ' + err});
        else res.json({"thongbao": "Đã cập nhật nhân viên"});
    });
});
app.delete('/nhan_vien/:id', function(req, res){
    let id = req.params.id;
    let sql = 'DELETE FROM nhan_vien WHERE id=?';
    db.query(sql, id, (err, d) => {
        if(err) res.json({'thongbao': 'Lỗi khi xóa nhân viên: ' + err});
        else res.json({"thongbao": "Đã xóa nhân viên"});
    });
});

//task
app.post('/task', function(req, res){
    let { ten_task, du_an_id, nhan_vien_id, mo_ta, status, priority } = req.body;
    let sql = "INSERT INTO task SET ten_task=?, du_an_id=?, nhan_vien_id=?, mo_ta=?, status=?, priority=?";
    db.query(sql, [ ten_task, du_an_id, nhan_vien_id, mo_ta, status, priority ], (err, d) => {
        if(err) res.json({'thongbao': 'Lỗi khi chèn task: ' + err});
        else res.json({"thongbao": "Đã chèn xong task"});
    });
});
app.put('/task/:id', function(req, res){
    let data = req.body;
    let id = req.params.id;
    let { ten_task, du_an_id, nhan_vien_id, mo_ta, status, priority } = req.body;
    let sql = 'UPDATE task SET ten_task=?, du_an_id=?, nhan_vien_id=?, mo_ta=?, status=?, priority=? WHERE id=?';
    db.query(sql, [ ten_task, du_an_id, nhan_vien_id, mo_ta, status, priority, id ], (err, d) => {
        if(err) res.json({'thongbao': 'Lỗi khi cập nhật task: ' + err});
        else res.json({"thongbao": "Đã cập nhật task"});
    });
});
app.delete('/task/:id', function(req, res){
    let id = req.params.id;
    let sql = 'DELETE FROM task WHERE id=?';
    db.query(sql, id, (err, d) => {
        if(err) res.json({'thongbao': 'Lỗi khi xóa task: ' + err});
        else res.json({"thongbao": "Đã xóa task"});
    });
});

app.listen(port, () => {
    console.log(`Ứng dụng đang chạy với port ${port}`);
});
