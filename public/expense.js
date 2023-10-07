document.addEventListener('DOMContentLoaded',()=>{
    var page = 1;
    getRecords(page)
    checkPrime()
});
document.getElementById('list').addEventListener('click',deleteExpense);

axios.defaults.headers.common['auth'] = localStorage.getItem('token')

function getRecords(page){
    let itemsPerPage = localStorage.getItem('itemsPerPage');
    if(!itemsPerPage){
        itemsPerPage=5;
    }
    axios.get(`/expense/data?page=${page}&itemsPerPage=${itemsPerPage}`)
    .then(res=>{
        showOnScreen(res.data.items,res.data);
    }).catch(err=>console.log(err));
}

function showOnScreen(data,otherData){
    let list = document.getElementById('list');
    list.innerHTML=''
    let headline = document.createElement('h3');
    headline.innerHTML='Your Expenses';
    document.getElementById('list').appendChild(headline)
    let itemPerPage = document.createElement('input');
    itemPerPage.type='number';
    itemPerPage.id='itemsPerPage';
    let label = document.createElement('label');
    label.for='itemsPerPage';
    label.innerHTML='Select Itmes Per Page';
    let savedValue = localStorage.getItem('itemsPerPage');
    if(!savedValue){
        itemPerPage.value=5;
    }else{
        itemPerPage.value=savedValue;
    }
    let setBtn = document.createElement('button');
    setBtn.innerHTML='Set';
    setBtn.setAttribute('onclick',`setItemsPerPage()`);
    let paginationDiv = document.createElement('div');
    paginationDiv.appendChild(label);
    paginationDiv.appendChild(itemPerPage);
    paginationDiv.appendChild(setBtn);
    list.appendChild(paginationDiv);
    for(item of data){
        let li = document.createElement('li');
        li.id=item._id;
        let span = document.createElement('span');
        span.innerHTML=`${item.amount} - ${item.description} - ${item.category} `
        li.appendChild(span);
        let delbtn = document.createElement('button');
        delbtn.innerHTML='Delete';
        delbtn.className="delete";
        li.appendChild(delbtn)
        document.getElementById('list').appendChild(li)
    }
    if(otherData.hasPreviousPage){
        let prevBtn = document.createElement('button');
        prevBtn.innerHTML=otherData.previousPage;
        prevBtn.setAttribute('onclick',`getRecords(${otherData.previousPage})`);
        list.appendChild(prevBtn);
    }
    let currentBtn = document.createElement('button');
    currentBtn.innerHTML=otherData.currentPage;
    currentBtn.style="color:blue"
    list.appendChild(currentBtn)
    if(otherData.hasNextPage){
        let nextBtn = document.createElement('button');
        nextBtn.innerHTML=otherData.nextPage;
        nextBtn.setAttribute('onclick',`getRecords(${otherData.nextPage})`);
        list.appendChild(nextBtn);
    }
    if(otherData.lastPage>otherData.currentPage+1){
        let lastBtn = document.createElement('button');
        lastBtn.innerHTML = 'last'+otherData.lastPage;
        lastBtn.setAttribute('onclick',`getRecords(${otherData.lastPage})`);
        list.appendChild(lastBtn);
    }
}

function setItemsPerPage(){
    localStorage.setItem('itemsPerPage',document.getElementById('itemsPerPage').value);
    getRecords(1);
}

async function addExpense(e){
    e.preventDefault();
    let obj={
        amount:e.target.amount.value,
        description:e.target.description.value,
        category:e.target.category.value
    }
    try{
        let res = await axios.post('/expense/data',obj)
        getRecords(1);
        let msg = document.getElementById('msg');
        msg.style='color:green';
        msg.innerHTML=res.data.message;
        setTimeout(() =>msg.innerHTML='' ,2000);
        e.target.amount.value='';
        e.target.description.value='';
        e.target.category.value='';
    }catch(err){
        console.log(err)
        let msg = document.getElementById('msg');
        msg.style='color:red';
        msg.innerHTML=err.response.data.message;
        setTimeout(() =>msg.innerHTML='' ,2000);
    }
}

async function deleteExpense(e){
    if(e.target.className=='delete'){
        try{
            let result = await axios.delete(`/expense/delete?id=${e.target.parentElement.id}`)
            getRecords(1);
            let msg = document.getElementById('msg');
            msg.style='color:green';
            msg.innerHTML=result.data.message;
            setTimeout(() =>msg.innerHTML='' ,2000);
        }catch(err){
            console.log(err)
            let msg = document.getElementById('msg');
            msg.style='color:green';
            msg.innerHTML=err.response.data.message;
            setTimeout(() =>msg.innerHTML='' ,2000);
        }
    }
}

document.getElementById('buy-premium-btn').onclick = async (e)=>{
    let response = await axios.get('/payment/buypremium')
    let options = {
        "key":response.data.key_id,
        "order_id":response.data.order.id,
        "handler":async (response)=>{
            try{
                let res = await axios.post('/payment/paid',{
                    order_id:options.order_id,
                    payment_id:response.razorpay_payment_id
                })
                alert('You Are a Premium User Now')
                localStorage.setItem('token',res.data.token)
                checkPrime()
            }catch(err){
                console.log(err)
            }
        }
    }
    let rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed',res=>{
        console.log(res.error.metadata.order_id)
        alert('Something Went Wrong')
        axios.post('/payment/failed',{order_id:res.error.metadata.order_id})
        .then(()=>console.log('status set to failed'))
        .catch(e=>console.log(e))
    })
}
function checkPrime(){
    const token=localStorage.getItem('token');
    const decodedToekn = parseJwt(token);
    if(decodedToekn.prime==true){
        document.getElementById('buy-premium-div').innerHTML='';
        const pageHeading = document.getElementById('page-heading');
        pageHeading.innerHTML += `<h3 class="welcomeNote">Welcome ${decodedToekn.name}</h3>`;
        pageHeading.innerHTML += 'You are a premium member<hr><br>';
        let leaderboardbtn = document.createElement('button');
        leaderboardbtn.id='leaderboardBtn'
        leaderboardbtn.innerHTML='Show Leaderboard';
        let reportBtn = document.createElement('button');
        reportBtn.id='reportBtn';
        reportBtn.innerHTML='Download Report'
        pageHeading.appendChild(leaderboardbtn);
        pageHeading.appendChild(reportBtn);
        document.getElementById('leaderboardBtn').onclick = showLeaderboard;
        document.getElementById('reportBtn').onclick = generateReport;
    }
}

async function showLeaderboard(){
    try{
        let res = await axios.get('/premium/leaderboard')
        console.log(res.data)
        let LBlist = document.getElementById('LB-list');
        LBlist.hidden='';
        LBlist.innerHTML='';
        let lbheading = document.createElement('h3');
        lbheading.className='lbheading'
        lbheading.innerHTML='Leaderboard';
        LBlist.appendChild(lbheading);
        for(entry of res.data){
            let LBlist = document.getElementById('LB-list');
            let li = document.createElement('li');
            li.className = 'LB-entry';
            li.innerHTML = entry.name+' --> '+entry.totalExpenses;
            LBlist.appendChild(li)
        }
    }
    catch(err){
        console.log(err)
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function generateReport(){
    try{
        let response = await axios.get('/expense/report');
        console.log(response.data);
        let a = document.createElement('a');
        a.href=response.data.fileUrl;
        a.setAttribute('download','Expense.csv')
        a.click();
        showPastReports(response.data.pastReports)
    }
    catch(err){
        console.log(err)
    }
}

function showPastReports(data){
    let reportDiv = document.getElementById('report-div');
    reportDiv.hidden=''
    const list = document.getElementById('past-reports');
    list.innerHTML='';
    let pastreportheaidng = document.createElement('h3');
    pastreportheaidng.className='pastreportheading';
    pastreportheaidng.innerHTML='Past reports';
    list.appendChild(pastreportheaidng);
    for(let item of data){
        let li = document.createElement('li');
        li.innerHTML=JSON.stringify(new Date(item.generatedOn)).slice(1,11);
        let downloadBtn = document.createElement('button');
        downloadBtn.className='pastReportDwnldBtn'
        downloadBtn.innerHTML='Donwload';
        downloadBtn.setAttribute('onclick',`window.location.href='${item.fileLink}'`);
        li.appendChild(downloadBtn);
        list.appendChild(li);
    }
}