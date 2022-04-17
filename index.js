const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const session = require("express-session")
const connection = require("./database/database")

const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")
const usersController = require("./users/UsersController")

const Article = require("./articles/Article")
const Category = require("./categories/Category")
const User = require("./users/User")

// View engine
app.set("view engine","ejs")

// Sessions
app.use(session({
    secret: "dkslo@f12365DEE#",
    cookie: {maxAge: 1000 * 3600 / 2},
}))

// Static files
app.use(express.static('public'))
// body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// Database

connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso!")
    }).catch((error) => {
        console.log(error)
    })

app.get("/", (req,res) => {
    Article.findAll({
        order:[
            ['id','DESC']
        ],
        limit: 4
    }).then((articles) => {
        Category.findAll().then(categories => {
            res.render("index", {articles, categories})
        })        
    })    
})

app.get("/session", (req,res) => {
    req.session.treinamento = "Formação nodjs"
    req.session.ano = 2019
    req.session.email = "rodrigo@gmail.com"
    req.session.objeto = {novo: "qualquer coisa"}
    res.send("Sessão gerada")
})

app.get("/leitura", (req,res) => {
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        objeto: req.session.objeto
    })
})

app.get("/article/:slug", (req, res) => {
    let slug = req.params.slug
    Article.findOne({
        where: {
            slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article, categories})
            })   
        }else{
            res.redirect("/")
        }
    }).catch( err => {
        res.redirect("/")
    })
})

app.get("/category/:slug", (req,res) => {
    let slug = req.params.slug
    Category.findOne({
        where: {
            slug
        },
        include: {model: Article}
    }).then( (category) => {
        if(category != undefined){
            Category.findAll().then(categories => {
                console.log(category)
                res.render("index", {articles: category.articles, categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch( err => {
        res.redirect("/")
    })
})



app.use("/",categoriesController)
app.use("/",articlesController)
app.use("/",usersController)

app.listen(8080, () => {
    console.log("O servidor está rodando na porta 8080")
})

