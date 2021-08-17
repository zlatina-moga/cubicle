const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const userService = require('../services/user');
const { TOKEN_SECRET , COOKIE_NAME} = require('../config');

module.exports = () => (req, res, next) => {
    readToken(req)
    req.auth = {
        register,
        login,
        logout
    }
    if (readToken(req)){
        next()
    }
    
    async function register({username, password, repeatPassword}){
        if (username == '' || password == '' || repeatPassword == ''){
            throw new Error('All fields are required!')
        } else if (password != repeatPassword){
            throw new Error('Passwords don\'t match!')
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await userService.createUser(username, hashedPassword)
        req.user = createToken(user)
    }

    async function login({username, password}) {
        const user = await userService.getUserByUsername(username)
    
        if (!user){
            throw new Error('Wrong username or password!')
        } else {
            const isMatch = await bcrypt.compare(password, user.hashedPassword)
            if (!isMatch){
                throw new Error('Wrong username or password!')
            } else {
                req.user = createToken(user)
            }
        }
    }

    async function logout(){
        res.clearCookie(COOKIE_NAME)
    }

    function createToken(user){
        const userViewModel = {_id: user._id, username: user.username};//creating the model
        const token = jwt.sign(userViewModel, TOKEN_SECRET) //signing the token
        res.cookie(COOKIE_NAME, token, { httpOnly: true}); //sending it in the cookie

        return userViewModel;
    }

    function readToken(req){
        const token = req.cookies[COOKIE_NAME];
        if(token){
            try {
                const userData = jwt.verify(token, TOKEN_SECRET)
                req.user = userData;
                res.locals.user = userData;
                console.log('Known user ',userData.username)
            } catch(err){
                res.clearCookie(COOKIE_NAME)
                res.redirect('/auth/login')
                return false;
            }
        }
        return true;
    }
}
