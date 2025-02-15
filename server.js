const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12874882',
    database: 'countriesquiz'
});

// Test connection
connection.connect(error => {
    if (error) {
        console.error('Error connecting to MySQL database:', error);
        return;
    }
    console.log('Successfully connected to MySQL database');
});

// app.post('/post', (req, res) => {
//     const id = req.body.id;
//     const name = req.body.id;

//     con.query('insert into employees values(?,?)', [id, name], (error, result) => {
//         if (error) {
//             console.log(err);
//         } else {
//             res.send('POSTED');
//         }
//     }
//     )
// });


app.get('/getAllScores', (req, res) => {
    connection.query('select * from topscores order by score desc',function(error,result){
        if(error){
            console.log(error);
        }else{
            var oScores = {
                aScoresEurope: [],
                aScoresAsia: [],
                aScoresAfrica: []
            }
            result.forEach(oRecord => {
                if(oRecord.regionId === 1){
                    oScores.aScoresEurope.push(oRecord);
                }else if(oRecord.regionId === 2){
                    oScores.aScoresAsia.push(oRecord);
                }else if(oRecord.regionId === 3){
                    oScores.aScoresAfrica.push(oRecord);
                }
            });
            res.send(oScores);
        }
    })
})



const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});