const express = require('express');
const http = require("http"); 
const {Server} = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const CodeBlock = require('./models/CodeBlock')
const codeBlocksRoutes = require("./src/api/codeBlocksRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app); 

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
})

const mentorInstance = {
  socket: null,
  isLogged: false,
  roomId: null,
}

let updatedCode = null;

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('checkMentor', async (blockId) => {

    console.log(mentorInstance.isLogged);
    if(!mentorInstance.isLogged)
    {
      mentorInstance.isLogged = true;
      mentorInstance.roomId = blockId;
      mentorInstance.socket = socket;
      
      // Get code from DB and save it in server.
      const getCode = await CodeBlock.findById(blockId).exec();
      updatedCode = getCode.code;

      socket.emit('mentorConfirmed');
    }
    else
    {
      if(blockId == mentorInstance.roomId)
      {
      socket.emit('studentInit', {validEntry: true, currentCode: updatedCode});
      }else{
        socket.emit('studentInit', {validEntry: false});
      }
    }
  });

  // Handle code changes
  socket.on('codeChange', (data) => {
    if (mentorInstance.isLogged) {
      console.log("codeChange");
      updatedCode= data.newCode;
      socket.broadcast.emit('updateCode', {sender: socket.id, code: updatedCode});
    }
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('User disconnected');
    if (socket == mentorInstance.socket) {
      
      // Update DB data with last written code on socket close. - not sure if needed!!!!
       
      // CodeBlock.findByIdAndUpdate(
      //   mentorInstance.roomId,
      //   { code: updatedCode },
      //   { new: true, useFindAndModify: false }
      // )
      //   .then(updatedCodeBlock => {
      //     if (!updatedCodeBlock) {
      //       console.log('Document not found');
      //     } else {
      //       console.log('Document updated successfully:', updatedCodeBlock);
      //     }
      //   })
      //   .catch(err => {
      //     console.error('Error updating document:', err);
      //   });

      mentorInstance.isLogged = false;
      mentorInstance.socket = null;
      mentorInstance.roomId = null;

      socket.broadcast.emit('exitPage');
    }
  });
});

// Connect to DB
try{
    mongoose.connect('mongodb://mongo:c32EgdD6cC3dGeC16aG-2Ee3F5dcFEB2@viaduct.proxy.rlwy.net:31452', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "moveo_task_db",
    });
    console.log('Connected to moveo_task_db database');

  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

app.use('/', codeBlocksRoutes);

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`server is runnimg, listen port ${port}`);
})