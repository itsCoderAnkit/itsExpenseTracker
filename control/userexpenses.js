expense_form = document.getElementById("expenseform")
            expense_amount = document.getElementById("amount")
            expense_description = document.getElementById("description")
            expense_category = document.getElementById("category")
            total_cost = document.getElementById('total')
            premiumMembership = document.getElementById("rzp-button1")
            pagination = document.getElementById('pagination')
            listsizeform = document.getElementById('listsize')

            listsizeform.addEventListener("submit",save_in_local_storage)

            async function save_in_local_storage(e){
                localStorage.setItem('listSizeToken', document.getElementById('size').value)
            }

            expense_form.addEventListener("submit", save_on_db)

            async function save_on_db(e) {
                try {
                    e.preventDefault()

                    myobj = {
                        amount: expense_amount.value,
                        description: expense_description.value,
                        category: expense_category.value,

                    }
                    
                    console.log(myobj)
                    const token = localStorage.getItem('token')
                    console.log("save_on_db>>>>>>>", token)
                    let posted = await axios.post("http://13.233.19.134:8000/expense/addexpense", myobj, { headers: { "Authorisation": token } })
                    console.log("posted data ",posted.data.expenses)

                    //show_on_screen(posted.data.expenses)
                }
                catch {
                    console.log("UNABLE TO POST ON DATABASE")
                }

            }

            async function show_on_screen(res) {

                try {
                    document.getElementById("allexpenses").innerHTML = ''
                    console.log(res)
                    for (let i = 0; i < res.length; i++) {
                        const parent_node_expense1 = document.getElementById("allexpenses")
                        const childhtml = `<li id=${res[i].id}> ${res[i].amount} - ${res[i].description} -${res[i].category}
                    <button onclick=deleteProduct('${res[i].id}')> Delete Product </button>

            </li>`
                        parent_node_expense1.innerHTML = parent_node_expense1.innerHTML + childhtml;

                        //deletePrice(res[i].amount)

                        expense_amount.value = ""
                        expense_description.value = ""
                    }


                }

                catch {
                    console.log("UNABLE TO PRINT ON SCREEN")
                }
            }

            async function deleteProduct(id) {
                try {
                    to_be_deleted = document.getElementById(id)

                    to_be_deleted.remove()
                    console.log(to_be_deleted)
                    const token = localStorage.getItem('token')
                    let deleted = await axios.delete(`http://13.233.19.134:8000/deleteExpense/${id}`, { headers: { "Authorisation": token } })
                    console.log(deleted.data.deleted)
                    deletePrice(-(deleted.data.deleted[0].amount))
                }
                catch {
                    console.log("UNABLE TO DELETE")
                }

            }

            const parseJwt = function decodeToken(token) {
                try {
                    return JSON.parse(atob(token.split('.')[1]));
                } catch (e) {
                    return null;
                }
            }



            window.addEventListener("DOMContentLoaded", Reloaded)

            async function Reloaded(e) {
                try {
                    let page = 1

                    e.preventDefault()
                    console.log("DOM CONTENT LOADED")
                    const token = localStorage.getItem('token')
                    console.log('dom token>>>>>>>>', token)
                    const listSizeToken= localStorage.getItem('listSizeToken')
                    console.log('dom list size>>>>>>>>', listSizeToken)
                    console.log("parsed jwt", parseJwt(token))
                    let loading = await axios.get(`http://13.233.19.134:8000/getAllExpenses?page=${page}`, { headers: { "Authorisation": token ,"listSize":listSizeToken} })
                    console.log("DOM ALL DATA", loading.data)

                    const parsedtoken = parseJwt(token)
                    if (parsedtoken.isPremiumUser) {
                        document.getElementById('rzp-button1').style.visibility = "hidden"
                        document.getElementById('message').innerHTML = "You Are a Premium User"
                        document.getElementById('leaderboard').style.visibility = "visible"
                        document.getElementById('div_leaderboard').style.visibility = "visible"
                    }


                    show_on_screen(loading.data.expenses)
                    showPagination(loading)


                }
                catch {
                    console.log("DOM CONTENT LOADED FAILED")
                }
            }

            function showPagination(loading) {

                pagination.innerHTML = ' '
                console.log(loading.data)

                currentPage = loading.data.currentPage,
                    hasNextPage = loading.data.hasNextPage,
                    nextPage = loading.data.nextPage,
                    hasPreviousPage = loading.data.hasPreviousPage,
                    previousPage = loading.data.previousPage,
                    lastPage = loading.data.lastPage



                console.log(hasPreviousPage, hasNextPage)
                if (hasPreviousPage) {

                    const btn2 = document.createElement('button')
                    btn2.innerHTML = previousPage
                    btn2.addEventListener('click', () => getProducts(previousPage))
                    pagination.appendChild(btn2)
                }

                const btn1 = document.createElement('button')
                btn1.innerHTML = `<h3>${currentPage}</h3>`
                btn1.addEventListener('click', () => getProducts(currentPage))
                pagination.appendChild(btn1)


                if (hasNextPage) {

                    const btn3 = document.createElement('button')
                    btn3.innerHTML = nextPage
                    btn3.addEventListener('click', () => getProducts(nextPage))
                    pagination.appendChild(btn3)
                }
            }

            async function getProducts(page) {
                const token = localStorage.getItem('token')
                const listSizeToken = localStorage.getItem('listSizeToken')
                let loading = await axios.get(`http://13.233.19.134:8000/getAllExpenses?page=${page}`, { headers: { "Authorisation": token , "listSize":listSizeToken} })
                console.log("DOM ALL DATA", loading.data)
                for (let i = 0; i < loading.data.expenses.length; i++) {
                    show_on_screen(loading.data.expenses)
                }
                showPagination(loading)

            }

            let total_price = 0
            async function deletePrice(res) {
                try {

                    const parent_node_table2 = document.getElementById("total")

                    let b = parseInt(res)

                    total_price = total_price + b
                    console.log(total_price)
                    const newchildhtml = `<li id=${res.id}> ${total_price} </li>`
                    parent_node_table2.innerHTML = newchildhtml;
                    return total_price

                }
                catch {
                    console.log("DELETE PRICE FROM TOTAL FAILED")
                }
            }


            // premiumMembership.addEventListener('click', buypremium)


            document.getElementById('rzp-button1').onclick = async function (e) {
                e.preventDefault()
                const token = localStorage.getItem('token')
                console.log("premium html token >>>>>", token)
                const response = await axios.get('http://13.233.19.134:8000/premiumMembership', { headers: { "Authorisation": token } })
                console.log(response)

                var options =
                {
                    "key": response.data.key_id,
                    "orderid": response.data.order.id,
                    "handler": async function (response) {
                        const updateTransaction = await axios.post("http://13.233.19.134:8000/updateTransactionStatus", {

                            order_id: options.orderid,
                            payment_id: response.razorpay_payment_id
                        }, {
                            headers: {
                                "Authorisation": token
                            }
                        })

                        console.log("updateTransaction >>>> ", updateTransaction.data)
                        localStorage.setItem('token', updateTransaction.data.token)
                        alert("YOU ARE PREMIUM USER NOW")
                        document.getElementById('rzp-button1').style.visibility = "hidden"
                        document.getElementById('message').innerHTML = "You Are a Premium User"
                    }
                }

                const rzp1 = new Razorpay(options)
                rzp1.open()
                e.preventDefault()

                rzp1.on("payment.failed", async function (response) {
                    await axios.post("http://13.233.19.134:8000/updateFailedTransactionStatus", {

                        order_id: options.orderid,
                        payment_id: response.razorpay_payment_id
                    }, {
                        headers: {
                            "Authorisation": token
                        }
                    })

                    console.log("FAILED RESPONSE", response)

                    alert("SOMETHING WENT WRONG")
                })

            }


            document.getElementById('leaderboard').onclick = async function () {
                const token = localStorage.getItem('token')
                console.log("leaderboard>>>>", token)
                const response = await axios.get('http://13.233.19.134:8000/premium/showLeaderBoard', { headers: { "Authorisation": token } })
                console.log(response.data.userLeaderBoardDetails)
                for (let i = 0; i < response.data.userLeaderBoardDetails.length; i++) {
                    show_on_leaderboard(response.data.userLeaderBoardDetails[i])
                }
            }

            async function show_on_leaderboard(res) {

                try {
                    console.log(res)
                    const parent_node_expense1 = document.getElementById("div_leaderboard")
                    const childhtml = `<li > ${res.name} - ${res.totalExpenses}
    </li>`
                    parent_node_expense1.innerHTML = parent_node_expense1.innerHTML + childhtml;

                }
                catch {
                    console.log("UNABLE TO PRINT LEADERBOARD ON SCREEN")
                }
            }

            document.getElementById('download').onclick = async function download(e) {
                try {
                    e.preventDefault()
                    const token = localStorage.getItem('token')
                    const downloadresponse = await axios.get('http://13.233.19.134:8000/user/download', { headers: { "Authorisation": token } })

                    if (downloadresponse.status === 200) {
                        console.log("downloaded>>", downloadresponse.data.allURL)
                        var a = document.createElement("a")
                        a.href = downloadresponse.data.fileURL
                        a.download = 'myexpense.csv'
                        a.click()

                        for (let i = 0; i < downloadresponse.data.allURL.length; i++) {
                            show_URL(downloadresponse.data.allURL[i])
                        }

                        // show_URL(downloadresponse.data.allURL)
                    }
                    else {
                        throw new Error(downloadresponse.data.message)
                    }
                }
                catch (err) {
                    console.log(err)
                }

            }

            async function show_URL(res) {

                try {
                    console.log(res.id)
                    const parent_node_expense1 = document.getElementById("allfiles")
                    // const childhtml = `<li id=${res.id}> ${res.URL} </li>`

                    const childhtml = ` <a href="${res.URL}" title="DOWNLOAD FILE ${res.id}"> DOWNLOAD FILE CREATED AT ${res.createdAt}</a> <br>`

                    parent_node_expense1.innerHTML = parent_node_expense1.innerHTML + childhtml;




                }
                catch {
                    console.log("UNABLE TO URL PRINT ON SCREEN")
                }
            }