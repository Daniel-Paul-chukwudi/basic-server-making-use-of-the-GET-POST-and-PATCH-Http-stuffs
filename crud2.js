
// const { log } = require('console');
const studentDb = require('./db/database.json');  // calling the database then assigning it to the constant studenteDb
const http=require('http') // calling http like in line 3
const PORT=8080 // creating the variable PORT and assigning the value if the port to it
const fs=require("fs") // calling fs like in line 3
const uuid=require('uuid').v4()

const server= http.createServer((req,res)=>{ // creating a server then asigning it to the constant server
    const {url,method}=req // array distructuring to allow for ease of access to the items needed

    if(url==='/create-student' && method==='POST'){ // an if statement to act as a check to know what to do
        let body=''  // creating a varible to store the value  
        console.log('i am the first body',body); // log check
        
        req.on('data',(chunks)=>{  // this is to read what is on the page 
            body += chunks
            // console.log('first result',body);
            const data= JSON.parse(body)  // converting the read value to a readable format and assigning it to var data
            // console.log(data);
            
            const student ={ //creating a particular format for the items we would be uploading to the database
                id:uuid, // adding a unique id for items in the database based on the length of the database
                name:data.name, // getting the name value of the data then assigning it to the name key 
                gender:data.gender, // same as line 23 but for gender
                age:data.age //same as line 23 but for age
            }
            // console.log(student); // log check to see value before next stage
            studentDb.push(student); // pushing the value of student to the studentDb that we called in the beginning 
            // in this module alone
            // console.log(studentDb); // log check to confirm
            
            fs.writeFile('./db/database.json',JSON.stringify(studentDb,null,2),'utf-8',(err,data)=>{ // attempting to 
                // update the new value of studentDb from this module to the main database
                if(err){ //error check with a corresponding response if an error is encountered
                    res.writeHead(400,{"content-type":"application/json"})
                    res.end('bad request') // the response as well as an end to the program

                }else {
                    res.writeHead(201,{"content-type":"application/json"})// if no errors this runs
                    res.end(JSON.stringify({ //the response if successful
                        message: "Student created successfully",
                        data: student
                }))
                    
                }
            })             
        });
        // req.on('end',()=>{ // im not sure of this part
        //     // console.log('i am the second body',body);
        // })
        // res.writeHead(201,{"content-type":"text/plain"})// if the original if check passes , this runs to show its succesful
        // res.end('successful post')// the response
        
    }else if( url.startsWith('/students') && method === 'GET'){
        if(studentDb.length < 1){
            res.writeHead(404,{"content-type":"text/plain"})
            res.end('No student found')
        }else{
            res.writeHead(404,{"content-type":"application/json"})
            res.end(JSON.stringify({
                message:'All students below',
                total: studentDb.length,
                data: studentDb

            }))
        }

    }else if(url.startsWith('/student') && method==='GET'){
        const id =url.split('/')[2]
        const student =studentDb.find((x) => x.id === id)
        if (!student){
            res.writeHead(404,{"content-type":"text/plain"})
            res.end('student not found')
        }else{
            res.writeHead(200,{"content-type":"application/json"})
            res.end(JSON.stringify({
                message: 'Student below',
                data: student
            }))
        }

    }// now for updating values in the database
     else if(url.startsWith('/update-student') && method==='PATCH'){
        let body = '';
        req.on('data',(chunks)=>{
            body += chunks

        })

        req.on('end',()=>{
            const update= JSON.parse(body)
            const id = url.split('/')[2]
            const student = studentDb.find((x)=>x.id===id)
            console.log(student);
            //objsect.assign is used to assign data to an object and overides it if it already exists
            // it take two arguments 1 the previous object 2 the new object
            Object.assign(student,update)
            console.log(student);
            const index =studentDb.findIndex((e)=> x.id === student.id)
            
            if (index !== -1){
                studentDb[index] = student

            };// the 2 after the null means the number of indentations
            fs.writeFile('./db/database.json',JSON.stringify(studentDb,null,2),'utf-8',(err,data)=>{
                if (err){
                    res.writeHead(500,{"content-type":"type/plain"})
                    res.end("Error updating student")
                }else{
                    res.writeHead(200,{"content-type":"apllication/json"})
                    res.end(JSON.stringify({
                        message:"Student updated successfully",
                        data: student
                    }))
                }
            })
            
        })

    }
})

server.listen(PORT,()=>{ //this is used to check is your server is live 
    console.log(`server is running on port: ${PORT}`); // log check to show is your server is live
    
})