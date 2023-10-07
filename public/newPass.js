async function changePassword(e){
    e.preventDefault()
    try{
        let res = await axios.post(window.location.href,{password:e.target.newPass.value})
        document.body.innerHTML+='<h2>Success</h2><p>Redirecting to Login</p>'
        setTimeout(() => document.location.href='/', 1000);
    }
    catch(err){
        console.log(err)
        document.body.innerHTML+='Something Wrong'
    }
}