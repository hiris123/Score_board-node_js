const pool = require('../database/index')
const dataprocess = require("../DataProcess/data.process")


const postsController = {

    // POST ------------------------------------------------------------------------------------------------------

    postgamename: async (req, res) => {
        try {
            const { game_name } = req.body
            //console.log(game_name)

            let { rows, fields } = "";

            let [game,] = await pool.query("select id from Game where game_name = ?", [game_name])

            const sql = "insert into scoreboard.Game (game_name) values (?)"
            //console.log(game[0])
            /* game table에 해당 정보가 없을 경우*/
            if (!(game[0])) {

                [rows, fields] = await pool.query(sql, [game_name])
                res.json({
                    data: rows
                })

            } else {
                res.json({
                    status: `해당 게임 테이블에 ${game_name}은 이미 등록되어 있습니다.`
                })
            }



        } catch (error) {
            console.log(error)
            res.json({
                status: "error"
            })
        }
    },

    postuser: async (req, res) => {
        try {
            const { name, age, sex, game_name } = req.body

            let [game_id,] = await pool.query("select id from Game where game_name = ? ", [game_name])

            let user1 = await pool.query("select * from User where name = ? and  game_id = ? ", [name, game_id[0]["id"]])


            let rows = "";

            /* User1 table에 해당 정보가 없을 경우 등록*/
            if (dataprocess.isEmptyArr(user1[0])) {

                // console.log(name, age, sex, game_id);
                const sql = "insert into scoreboard.User (name, age, sex, game_id) values (?, ?, ?, ?)"
                rows = await pool.query(sql, [name, age, sex, game_id[0]["id"]])

            } else {
                rows += `사용자 테이블에 ${name}는 이미 등록되어 있습니다.`
            }


            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error);
            res.json({
                status: "error"
            })
        }
    },


    postscore: async (req, res) => {
        try {


            let { game_name, user1_name, user2_name, user1_score, user2_score, date } = req.body

            let [game_id,] = await pool.query("select id from Game where game_name = ? ", [game_name])
            console.log(game_id)

            let user1 = await pool.query("select * from User where name = ? and  game_id = ? ", [user1_name, game_id[0]["id"]])
            let user2 = await pool.query("select * from User where name = ? and  game_id = ? ", [user2_name, game_id[0]["id"]])

            /* User1 table에 해당 정보가 없을 경우*/
            if (dataprocess.isEmptyArr(user1[0])) {

                user1 = await dataprocess.InsertandSelectUser(user1_name, game_id[0]["id"]);

            }

            /* User2 table에 해당 정보가 없을 경우*/
            if (dataprocess.isEmptyArr(user2[0])) {

                user2 = await dataprocess.InsertandSelectUser(user2_name, game_id[0]["id"]);

            }

            const sql = "insert into scoreboard.Score (game_ID, user_ID1, user_ID2, score1, score2, date) values (?, ?, ?, ?, ?, ?)"

            /* win, lose, sumdata를 User table에 업데이트 하기 */
            dataprocess.UpdateWinorLose(user1[0], user2[0], user1_score, user2_score)

            const [rows, fields] = await pool.query(sql, [game_id[0]["id"], user1[0][0]["id"], user2[0][0]["id"], user1_score, user2_score, date])

            res.json({
                data: rows
            })


        } catch (error) {
            console.log(error);
            res.json({
                status: "error"
            })
        }
    },


}


module.exports = postsController;
