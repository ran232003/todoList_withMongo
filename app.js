//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
mongoose = require("mongoose");
//mongoose.connect('mongodb://localhost:27017/notesDB', {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connect('mongodb+srv://ran:ran232003@cluster0.d2yn9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



const items = ["Buy Food", "Cook Food", "Eat Food"];
//const workItems = [];
const noteSchema = mongoose.Schema({
  note:{
    type:String,
    maxlength:20,
    require:true
  }
});
const listSchema = mongoose.Schema({
  listName:String,
  items:[noteSchema]
})
const Note = mongoose.model("notes",noteSchema);
const item = new Note({note:"example"});
const List = mongoose.model("Lists",listSchema);
const defaultItem = new Note({note:"Start Working!"})
const defaultItems = [defaultItem];

Note.find(function(err,notes){
  if(err){
    console.log("error");
  }else{
    notes.forEach(function(note){
      console.log(note.note);
      items.push(note.note);

    })
  }
})

app.get("/", function(req, res) {

// const day = date.getDate();
  const title = "Today";
  List.findOne({listName:title},function(err,result){
    if(!err){
      if(!result){
        list = new List({listName:title,items:defaultItems})
        list.save();
        res.render("list", {listTitle: list.listName, newListItems: list.items});
      }else{
        res.render("list",{listTitle:result.listName,newListItems:result.items});
      }
    }
  })

});

app.post("/", function(req, res){
  console.log(req.body);
  const title = req.body.buttonlist;
  const newNote = req.body.newItem;
  if(title !== "Today"){

    note = new Note({note:newNote});
    //note.save();
    List.findOne({listName:title},function(err,result){
      if(result){
        console.log(note);
        console.log(title);
        console.log(result);
        result.items.push(note);
        console.log(result);
        result.save();
      res.redirect("/"+title);
}else{
  console.log("else");
  console.log(result);
  console.log(title);
}
    })

  // if(req.body.btnRow){
  //   console.log("hi");
  //   const note = items[req.body.btnRow];
  //   Note.deleteOne({note:note},function(err){
  //     console.log(err);
  //   })
  //   items.splice(req.body.btnRow,1);
  //   const title = date.getDate();
  //   res.render("list", {listTitle: title, newListItems: items});
  //
  // }
}
  else{

    const item = req.body.newItem;
    const itemDB = new Note({note:item});
    List.findOne({listName:title},function(err,result){
      if(!err){
        result.items.push(itemDB);
        result.save();
        res.redirect("/");

      }

    })


}
});

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });
app.get("/:listName",function(req,res){
  console.log(req.params.listName);

  const title = req.params.listName;
  List.findOne({listName:title},function(err,result){
//if no error
    if(!err){
        if(!result){
          //if list dosent exsist so we will create one
          const list = new List({
            listName:title,
            items:defaultItems
          })
          list.save();
          res.redirect("/"+title);
        }
        else{
          //list exsist so we show it
          res.render("List",{listTitle:title,newListItems:result.items})


        }
    }
  })


})
app.post("/:listName",function(req,res){
  console.log(req.body);
  const title = req.params.listName;
  console.log(title);
  const id = req.body.btnRow;
  console.log(id);
  if(title === "Today"){
  List.findOneAndUpdate({listName:title},{$pull:{items:{_id:id}}},function(err,list){
    if(!err){
      res.redirect("/");

    }
  })
}
else{
  List.findOneAndUpdate({listName:title},{$pull:{items:{_id:id}}},function(err,list){
    if(!err){
      res.redirect("/"+title);

    }
  })

}
  // List.findOne({listName:title},function(err,result){
  //   if(result){
  //   result.items.forEach(function(item){
  //     console.log(item);
  //   });
  //
  //   }
  //   })
  //List.deleteOne({"listName":title,"items._id":id},function(err,result){});

  console.log("in post listName");
})
app.post("/delete",function(req,res){
  console.log("in delete");
  console.log(req.body);
})


app.get("/about", function(req, res){
  res.render("about");
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
//app.listen(port);

app.listen(port, function() {
  console.log("Server started on port 3000");
});
