passwordform = document.getElementById('passwordform')
        email = document.getElementById('email')

        passwordform.addEventListener('submit', forgotpassword)

        async function forgotpassword(e) {
            try {
                e.preventDefault()
                myobj = {
                    email: email.value
                }
                console.log("password form")
                let response = await axios.post("http://localhost:8000/password/forgotpassword", myobj)
                console.log(response)

                if(response){
                    document.getElementById('message').innerHTML= "A RESET LINK HAS BEEN SENT TO YOUR EMAIL"
                }

                email.value =""
            }
            catch (err) {

            }
        }