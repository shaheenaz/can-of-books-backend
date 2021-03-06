'use strict'
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const server = express()
server.use(cors())
server.use(express.json());
const PORT = process.env.PORT
server.get('/',homePage)
server.get("/books",serverFunction)
server.post("/addBook",addBookFunction)
server.delete('/deleteBook/:index',deltedBook);
server.put('/updateBook/:index',updatedBook);
function homePage(req,res){
    res.send('home')
}
const mongoose = require('mongoose');
mongoose.connect(process.env.mongodb, {useNewUrlParser: true, useUnifiedTopology: true});
const BooksSchema = new mongoose.Schema({
    name: String,
    description: String,
    img : String,
    status:String,
  });
  const UserSchema = new mongoose.Schema({
    email: String,
    books: [BooksSchema]
  });
  const BooksModal = mongoose.model('Books', BooksSchema);
  const UserModal = mongoose.model('User', UserSchema);
  function seedingBooks(){
      const Milkman = new BooksModal({
          name : "milkman",
          description: "In an unnamed city, middle sister stands out for the wrong reasons. She reads while walking, for one. And she has been taking French night classes downtown.",
          img: "https://images-na.ssl-images-amazon.com/images/I/41eOX0cBT8L._SX331_BO1,204,203,200_.jpg",
          status:'',
      })
      const TheLastSeptember = new BooksModal({
          name : "The Last September",
          description:"In 1920, at their country home in County Cork, Sir Richard Naylor and his wife, Lady Myra, and their friends maintain a skeptical attitude toward the events going on around them, but behind the facade of tennis parties and army camp dances, ",
          img :"https://images-na.ssl-images-amazon.com/images/I/51tWwvTlckL._SX318_BO1,204,203,200_.jpg",
          status:'',
      })
      const TheHeatoftheDay = new BooksModal({
          name: "The Heat of the Day",
          description: "Many people have fled the city, and those who stayed behind find themselves thrown together in an odd intimacy born of crisis. Stella Rodney is one of those who chose to stay. But for her, the sense of impending catastrophe becomes acutely personal when she discovers that her lover, Robert, is suspected of selling secrets to the enemy",
          img : "https://images-na.ssl-images-amazon.com/images/I/51ArVM9kzDL._SX321_BO1,204,203,200_.jpg",
          status:'',
      })
      Milkman.save();
      TheLastSeptember.save();
      TheHeatoftheDay.save();
  } 
  seedingBooks()
  function seedUser(){
      const userEmail = new UserModal({
          email : "asailik1993@gmail.com",
          books : [
              {
            name: "The Heat of the Day",
            description: "Many people have fled the city, and those who stayed behind find themselves thrown together in an odd intimacy born of crisis. Stella Rodney is one of those who chose to stay. But for her, the sense of impending catastrophe becomes acutely personal when she discovers that her lover, Robert, is suspected of selling secrets to the enemy",
            img : "https://images-na.ssl-images-amazon.com/images/I/51ArVM9kzDL._SX321_BO1,204,203,200_.jpg",
            status:'',
                },
            {
                name : "The Last September",
                description:"In 1920, at their country home in County Cork, Sir Richard Naylor and his wife, Lady Myra, and their friends maintain a skeptical attitude toward the events going on around them, but behind the facade of tennis parties and army camp dances, ",
                img :"https://images-na.ssl-images-amazon.com/images/I/51tWwvTlckL._SX318_BO1,204,203,200_.jpg",
                status:'',
            },
            {
                name : "milkman",
                description: "In an unnamed city, middle sister stands out for the wrong reasons. She reads while walking, for one. And she has been taking French night classes downtown.",
                img: "https://images-na.ssl-images-amazon.com/images/I/41eOX0cBT8L._SX331_BO1,204,203,200_.jpg",
                status:'',
            }
          ]
      })
      userEmail.save()
  }
  seedUser()
  function serverFunction(req,res){
    // let userEmail = req.query.email;
    // console.log(req.query.email);
    // UserModal.find({email:userEmail},function(err,userData){
     UserModal.find({email:"asailik1993@gmail.com"},function(err,userData){
        if(err){
            console.log('error');
        }
        else
        {
            res.send(userData[1].books);
        }
    })
  }
  function addBookFunction(req,res){
      const {email,name,description,status}=req.body;
      UserModal.find({email:email},function(err,userData){
        if(err){
            console.log('error');
        }
        else
        { 
            userData[1].books.push({
                   name:name,
                   description:description,
                   status:status,
               }) 
            userData[1].save();
            res.send(userData[1].books)
        }
    })
  }
  function deltedBook(req,res){
     const email=req.query;
     const index=Number(req.params.index);
     UserModal.find({email:"asailik1993@gmail.com"},function(err,userData){
         if(err){
             res.send('error')
         }else{
             const newData=userData[1].books.filter((book,idx)=>{
                 if(idx !== index){
                    return book;
                 }
             })
             userData[1].books=newData;
             userData[1].save();
             res.send(userData[1].books)
         }
     })
  }
  function updatedBook(req,res){
    const{name,description,status,email} = req.body
    const index =Number(req.params.index)
    console.log(index)
    UserModal.find({email:"asailik1993@gmail.com"},(err,userData)=>{
        userData[1].books.splice(index,1,{
            name:name,
            description: description,
            status:status,
        })
        userData[1].save()
        res.send(userData[1].books)
    })
}
  server.listen(PORT,()=>{
    console.log('TEST CONSOLE')
})