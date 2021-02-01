const {TodoList} = require('../models/index.js');
const { connect } = require('../routes/todo.js');

class Controller {
    
    static postTodo (req, res){
        let newTodo = {
            title : req.body.title,
            description : req.body.description,
            status : req.body.status,
            due_date : req.body.due_date
        }
        TodoList.create(newTodo)
        .then(todo => {
            res.status(201).json(todo)
        })
        .catch(err => {
            if(err.name === 'SequelizeValidationError'){
                res.status(400).json(err.errors[0].message)
            }else{
                console.log(err)
                res.status(500).json('Internal Server Error')
            }
        })
    }

    static getTodo (req, res) {
        
        TodoList.findAll()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static findById (req, res){
        let id = +req.params.id
        TodoList.findByPk(id)
        .then(data => {
            if(data === null){
                res.status(200).json('data not found')
            }else{
                res.status(200).json(data)
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static putTodo (req, res){
        const id = +req.params.id
        const { title, description, status, due_date } = req.body  
        TodoList.update({title, description, status, due_date}, {where : {id}, returning : true})
        .then(data => {
            if(data[1] < 1){
                res.status(404).json({"error" : "data not found"})
            }else{
                res.status(200).json(data[1][0])
            }
        })
        .catch(err => {
            if(err.name === 'SequelizeValidationError'){
                res.status(400).json(err)
            }else{
                res.status(500).json('error server')
            }
        })
    }

    static patchTodo (req, res) {
        const status = req.body.status
        TodoList.findByPk(+req.params.id)
        .then(data => {
            if(data === null){
                res.status(404).json({"error" : "data not found"})
            }else{
                let id = +req.params.id
                let flag 
                if(req.body.status === 'true'){
                    flag = true
                }else{
                    flag = false
                }
                data.dataValues.status = flag
                TodoList.update(data.dataValues, {where : {id : id}, returning : true})
                .then(todo =>{
                    res.status(200).json(todo[1][0])
                })
                .catch(err => {
                    res.status(500).json(err)
                })
            }
        })
        .catch(err => {
            if(err.name === 'SequelizeValidationError'){
                res.status(400).json(err)
            }else{
                res.status(500).json('error server')
            }
        })
    }

    static deleteTodo (req, res){
        let id = +req.params.id
        TodoList.destroy({where : {id}, returning : true})
        .then(todo => {
            if(todo < 1){
                res.status(404).json({"error" : "data not found"})
            }else{
                res.status(200).json('data deleted succesfully')
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

}

module.exports = Controller;