const form = document.getElementById("myform")
const username = document.getElementById("name").value
const useremail = document.getElementById("email").value
const userpassword = document.getElementById("password").value

form.addEventListener("submit", save_in_database)

async function save_in_database(e) {
    try {
        e.preventDefault()
        myobj = {
            name: username,
            email: useremail,
            password: userpassword
        }
        console.log(myobj)
        let user_signup = await axios.post("http://localhost:8000/user/signup",myobj)
        console.log(user_signup)    
    
    }
    catch {
        console.log("UNABLE TO SAVE SIGNUP DETAILS ON DATABASE")
    }
}

