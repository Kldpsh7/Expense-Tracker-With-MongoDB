const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const csp = require('helmet-csp');
const cors = require('cors');
const ngrok = require('ngrok');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
const indexRoutes = require('./routes');
const errorController = require('./controllers/error');
const expenseRoutes = require('./routes/expense');
const paymentRoutes = require('./routes/payment');
const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password');

const app = express();

const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags:'a'}
)

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(helmet({contentSecurityPolicy: false}));
app.use(morgan('combined',{stream:accessLogStream}));
app.use(cors({origin:'*'}));

app.use('/user',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/payment',paymentRoutes);
app.use('/premium',premiumRoutes);
app.use('/password',passwordRoutes);
app.use('/',indexRoutes);
app.use(errorController.error);

// (async ()=>{
//     let url = await ngrok.connect({addr:3000,authtoken:process.env.NGROKAUTHTOKEN});
//     console.log(url)
// })()

mongoose.connect(`mongodb+srv://kldpsh7:${process.env.MONGOPASS}@shop.iqmcj0i.mongodb.net/Expenses?retryWrites=true&w=majority`)
.then(()=>{
    app.listen(3000,()=>console.log('listening on port 3000'))
})
.catch(err=>console.log(err))
