const form = document.getElementById("loginform")
    const login_email = document.getElementById("loginemail")
    const login_password = document.getElementById("loginpassword")

    form.addEventListener("submit", user_login)

    async function user_login(e) {
        try {
            e.preventDefault()
            let login_obj = {
                email: login_email.value,
                password: login_password.value
            }

            console.log(login_obj)
            let login_user = await axios.post("http://localhost:8000/user/login", login_obj)
            let listSize = 3
            console.log("login user data",login_user.data)
            localStorage.setItem('token',login_user.data.token)
            localStorage.setItem('listSizeToken',listSize)
            if (login_user.status == 200) {
                window.location.href = "http://localhost:8000/expense/addexpense"
            }
            else {
                throw new Error("FAILED TO LOGIN")

            }
        }
        catch (err) {
            console.log("USER LOGIN FAILED")
            document.body.innerHTML = document.body.innerHTML + `<div style="color:red">${err}</div>`
            document.body.innerHTML = document.body.innerHTML + `<div style="color:red">PLEASE CHECK UR CREDENTIALS</div>`
        }

    }