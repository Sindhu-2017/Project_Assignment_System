
const API="http://localhost:3000/employees";

$("#loginForm").on("submit",async function(e){
    e.preventDefault();

    let isValid=true;

    let email=$("#email").val();
    let password=$("#password").val();
    let role=$("#role").val();

    if(email === ""){
        $("#email").addClass("is-invalid").removeClass("is-valid");
        isValid=false;
    }
    else{
        $("#email").addClass("is-valid").removeClass("is-invalid");
    }


    if(password === ""){
        $("#password").addClass("is-invalid").removeClass("is-valid");
        isValid=false;
    }
    else{
        $("#password").addClass("is-valid").removeClass("is-invalid");
    }


    if(!isValid){
        console.log("Invalid");
        return 0;
    }

    try{
        const response=await $.ajax({
            url:API,
            type:"GET"
        });
        let validUser = response.find(user=>
            user.Email === email && user.Password === password
        );

        if(validUser){

            localStorage.setItem("loggedInUser",JSON.stringify(validUser))

            const result= await Swal.fire({
                title:"login",
                text:"Are you sure you want to login?",
                icon:"question",
                showCancelButton:true,
                cancelButtonColor:"#d33",
                confirmButtonColor:"#3085d6",
                confirmButtonText:"Yes,login"
            });
            if(result.isConfirmed){
                Swal.fire({
                    toast:true,
                    position:"top-end",
                    icon:"success",
                    title:"Redirecting",
                    showConfirmButton:false,
                    timer:2000,
                    timerProgressBar:true
                });
                setTimeout(()=>{
                    if(validUser.Role === "Admin"){
                        window.location.href="admin_dashboard.html"; 
                    }
                    else if(validUser.Role === "Employee"){
                        window.location.href="employee_dashboard.html";
                    }
                },2000);

            }
        }
        else{
            $("#email").val("");
            $("#password").val("");
            $("#email").addClass("is-invalid").removeClass("is-valid");
            $("#password").addClass("is-invalid").removeClass("is-valid");

            await Swal.fire({
                toast:true,
                title:"Invalid User(Wrong username or Password)",
                icon:"error",
                position:"top-end",
                showConfirmButton:false,
                timer:5000,
                timerProgressBar:true
            });
            $("#email").removeClass("is-invalid");
            $("#password").removeClass("is-invalid");
        }
    }
    catch(error){
        await Swal.fire({
            toast:true,
            title:"server error",
            icon:"error",
            position:"top-end",
            showConfirmButton:false,
            timer:2000,
            timerProgressBar:true
        })            
    }        
});

// Theme

const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark"){
    document.body.classList.add("dark-mode");
    themeToggle.innerHTML ='<i class="bi bi-sun-fill"></i>';
}
else{
    themeToggle.innerHTML ='<i class="bi bi-moon-stars-fill"></i>';
}


themeToggle.addEventListener("click",()=>{

    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem("theme",  isDark ? "dark" : "light" );

    themeToggle.innerHTML = isDark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';

});

