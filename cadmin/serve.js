const port = process.env.PORT || 8080

const express = require('express') 
const app = express() 
app.use(express.static('dist'))

app.post('/Beacon',(req,res)=>{
    res.send({result:true})
})
app.listen(port, () => console.log(`Listening on port ${port}`))