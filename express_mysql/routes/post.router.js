const express = require("express")
const router = express.Router()

const postsController = require("../controller/posts.controller")




//-- POST 
router.post("/game", postsController.postgamename) /* Game 정보 입력하기 */
router.post("/user", postsController.postuser) /* 사용자 정보 입력하기 */
router.post("/score", postsController.postscore) /* Score 정보 입력하기 */


module.exports = router;

