function signup(e){
    e.preventDefault();
    let obj={
        Name:e.target.Name.value,
        Email:e.target.Email.value,
        Password:e.target.Password.value
    }
    axios.post('/user/signup',obj)
    .then(res=>{
        console.log(res)
        let showMsg = document.getElementById('status');
        showMsg.style="color:green"
        showMsg.innerHTML=res.data.message;
        setTimeout(() => window.location.href='/user/login', 1000);
    }).catch(err=>{
        console.log(err)
        let showMsg = document.getElementById('status');
        showMsg.style="color:red"
        showMsg.innerHTML=err.response.data.message;
        setTimeout(() => showMsg.innerHTML='', 3000);
    })
}