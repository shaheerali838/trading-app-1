import app from './app.js';
app.listen(process.env.PORT, ()=>{
    console.log(`Server Is Running on Port ${process.env.PORT}`);
})