// const sql = require("../config/vacCenterDB");
// const VacCenter = function(vacCenter){
//     this.id = vacCenter.id;
//     this.name = vacCenter.name;
//     this.tel = vacCenter.tel;
// };

// VacCenter.getAll = results => {
//     sql.query("SELECT * FROM vacCenters", (err,res) => {
//         if(err) {
//             console.log("error",err);
//             results(null,err);
//             return;
//         }
//         console.log("vacCenters: ",res);
//         results(null,res);
//     });
// };

// module.exports = VacCenter;