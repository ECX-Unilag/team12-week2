import React, { useEffect, useState } from 'react';
import { Link, Redirect } from "react-router-dom";

const Profile = (props) => {
    const [ redirect, setRedirect ] = useState(null);
    useEffect(() => {
        const toggleBtn = document.querySelector(".toggle-btn");
        const toggleBar1 = document.querySelector(".toggle-bar-1");
        const toggleBar2 = document.querySelector(".toggle-bar-2");
        const toggleBar3 = document.querySelector(".toggle-bar-3");
        const accountForm = document.querySelector("#account-settings");
        const passwordForm = document.querySelector("#password-change");
        const budgetForm = document.querySelector("#new-budget");
        const mainNav=document.querySelector(".main-nav");
        const create_Budget_Btn=document.querySelector(".Create-Budget");
        const cancel_Btn= document.querySelector("#cancel");
        const backdrop=document.querySelector(".backdrop");
        const success = document.getElementById("success");
        const failed = document.getElementById("failed");
        const loading = document.getElementById("loading");
        const new_Budget_form=document.querySelector(".new-budget-container");
        const cancel_toggle_bar=document.querySelector(".cancel-btn");
        let click = 0;//counter for the toggle btn
        toggleBtn.addEventListener('click',function(){//this controls what happens when the button is clicked
            if(click%2 === 0){
                mainNav.style.left="0";
                toggleBar1.style.opacity="0";
                toggleBar2.style.transform="rotateZ(45deg) translateX(6px)";
                toggleBar3.style.transform="rotateZ(-45deg) translateX(4px) translateY(2px)";
            }
            else{
                mainNav.style.left="-300px";
                toggleBar1.style.opacity="1";
                toggleBar2.style.transform="rotateZ(0) translateX(0)";
                toggleBar3.style.transform="rotateZ(0) translateX(0) translateY(0)";
            }
            click++
        })
        mainNav.addEventListener('click',function(e){
            for(let i=0;i<mainNav.children.length;i++){
                if(e.target.textContent===mainNav.children[i].textContent){
                    click++;
                    mainNav.style.left="-300px";
                    toggleBar1.style.opacity="1";
                    toggleBar2.style.transform="rotateZ(0) translateX(0)";
                    toggleBar3.style.transform="rotateZ(0) translateX(0) translateY(0)";
                };
            };
        });

        if (props.user === null){setRedirect("/login")};
        cancel_Btn.onclick = () => {
            accountForm.reset();
            passwordForm.reset();
        };
        create_Budget_Btn.addEventListener('click',() =>{
            new_Budget_form.style.display="block";
            backdrop.style.display="block";
            budgetForm.reset();
        });
        cancel_toggle_bar.addEventListener('click',() => {
            new_Budget_form.style.display = "none";
            backdrop.style.display = "none";
        });
        console.log(props.user);
        const saveNewBudget = (e) => {
            e.preventDefault();
            const formData = new FormData(budgetForm);
			const gross = formData.get("gross");
            const title = formData.get("title");
            const budget = formData.get("budget");
            loading.style.display = "flex";
            success.style.display = "none";
            failed.style.display = "none";

			const Params = {
				headers: {
					"Content-type": "application/JSON",
				},
				body: JSON.stringify({
                    gross: gross,
                    title: title,
                    budget: budget,
                    user: props.user
				}),
                method: "POST",
                user: props.user
			};
            console.log(Params);
			async function saved() {
				const res = await fetch(
					"https://budgetify20.herokuapp.com/api/new",
					Params
				);
				const data = await res.json();
                console.log(data);
                budgetForm.reset();
                success.style.display = "flex";
                loading.style.display = "none";
                failed.style.display = "none";
                success.innerHTML = data.error ? data.error + " Please try again" : data.message;
                }
			saved().catch(err => {
                failed.style.display = "flex";
                loading.style.display = "none";
                failed.innerHTML = err;
            });
        };
        budgetForm.onsubmit = saveNewBudget;


        const updateSettings = (e) => {
            e.preventDefault();
            const formData1 = new FormData(accountForm);
            const formData2 = new FormData(passwordForm);
			const username = formData1.get("username");
            const fullName = formData1.get("fullName");
            const email = formData1.get("email");
            const oldPassword = formData2.get("oldPassword");
            const newPassword = formData2.get("newPassword");
            loading.style.display = "flex";
            success.style.display = "none";
            failed.style.display = "none";

			const Params = {
				headers: {
					"Content-type": "application/JSON",
				},
				body: JSON.stringify({
                    username,
                    fullName,
                    email,
                    oldPassword,
                    newPassword,
                    user: props.user
				}),
                method: "POST",
                user: props.user,
			};

			async function saved() {
				const res = await fetch(
					"https://budgetify20.herokuapp.com/api/new",
					Params
				);
				const data = await res.json();
                console.log(data);
                budgetForm.reset();
                success.style.display = "flex";
                loading.style.display = "none";
                failed.style.display = "none";
                success.innerHTML = data.error ? data.error + " Please try again" : data.message;
                }
			saved().catch(err => {
                failed.style.display = "flex";
                loading.style.display = "none";
                failed.innerHTML = err;
            });
        };
        passwordForm.onsubmit = updateSettings;


    }, [props.user]);

    if (redirect === null){
    return (
    <div id="profile">
    <header>
    <div className="toggle-btn">
        <div className="toggle-bar-1 box"></div>
        <div className="toggle-bar-2 box"></div>
        <div className="toggle-bar-3 box"></div>
    </div>
    <div className="logo">Budg<span>etify</span></div>
</header>
<nav className="main-nav">
    <ul>
        <li><Link to="">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/">Log Out</Link></li>
        <li><Link to="#">About Us</Link></li>
        <li><Link to="#">Contact Us</Link></li>
        <li><Link to="#">Privacy Policy</Link></li>
    </ul>
</nav>
<div className="backdrop"></div>
<section>
    <div className="container">
        <div className="box-1">
            <h4>Account Settings</h4>
            <form id="account-settings">
                <label htmlFor="account">Username</label><br/>
                <input type="text" name="user-name" id="user-name" /><br/>
                <label htmlFor="fullname">Full Name</label><br/>
                <input type="text" name="Full-name" id="full-name" /><br/>
                <label htmlFor="e-mail">E-mail</label><br/>
                <input type="email" name="text" id="e-mail" /><br/>
                <div className="Create-Budget">Create Budget</div>
                <div className="View-Budget"><Link to="/budget">View Budget</Link></div>
            </form>
        </div>
        <div className="box-2">
            <h4>Change Password</h4>
            <form id="password-change">
                <div className="password-details News">
                <i className="fa fa-lock" aria-hidden="true"></i>
                <input type="password" name="pasword" id="password1" placeholder="Old Password" /><br/>
                </div>
                <div className="password-details">
                <i className="fa fa-lock" aria-hidden="true"></i>
                <input type="password" name="password" id="password2" placeholder="New Password" /><br/>
                </div>
                <div className="password-details">
                <i className="fa fa-lock" aria-hidden="true"></i>
                <input type="password" name="password" id="password3" placeholder="Confirm Password" /><br/>
                </div>
            <div className="control-btn">
                <button id="cancel">CANCEL</button>
                <button id="save" type="submit">SAVE</button>
                </div>
            </form>
        </div>
    </div>
</section>
<div className="new-budget-container">
    <form id="new-budget">
    <div className="cancel-btn">
        <div className="btn-1"></div>
        <div className="btn-2"></div>
    </div>
    <div className="child-2">
        <label htmlFor="gross">Gross Income(#)</label>
        <input type="number" name="gross" id="Expenditure" required/>
    </div>
    <div className="child-1">
    <label htmlFor="title">Expected Budget Title</label>
    <input type="name" name="title" id="Gross-Budget" required/>
    </div>
    <div className="child-3">
        <label htmlFor="Budget">Expected Budget Amount(#)</label>
        <input type="number" name="budget" id="Budget" required/>
    </div>
    <div className="save-budget"><button id="save-budget" type="submit">SAVE</button></div>
    <div className="Successful-login" id="success">Save Successful!</div>
    <div className="Unsuccessful-login" id="failed">Save not successful, try again</div>
    <div id="loading"><h6>Loading...</h6></div>

</form>
</div>
</div>
    );
    } else return <Redirect to={redirect}/>
};
export default Profile;
