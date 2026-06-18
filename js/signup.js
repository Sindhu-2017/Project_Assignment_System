const API="http://localhost:3000/employees";

$("#fullname").on("input",function(){
    let namePattern=/^[A-Za-z ]+$/;

    if(!namePattern.test($(this).val().trim())){
        $(this).addClass("is-invalid").removeClass("is-valid");
    }
    else{
        $(this).addClass("is-valid").removeClass("is-invalid");
    }
});

$("#empId").on("input", function () {
    if ($(this).val().trim() === "") {
        $(this).addClass("is-invalid").removeClass("is-valid");
    } else {
        $(this).addClass("is-valid").removeClass("is-invalid");
    }
});

$("#email").on("input",function(){
    let emailPattern=/^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-z]{3,}$/;

    if(!emailPattern.test($(this).val().trim())){
         $(this).addClass("is-invalid").removeClass("is-valid");
    }
    else{
        $(this).addClass("is-valid").removeClass("is-invalid");
    }
});


$("#phone").on("input",function(){
    let mobilePattern=/^\d{10}$/;

    if(!mobilePattern.test($(this).val().trim())){
         $(this).addClass("is-invalid").removeClass("is-valid");
    }
    else{
        $(this).addClass("is-valid").removeClass("is-invalid");
    }
});

$("#dept").on("change",function(){
    if($(this).val().trim() === ""){
        $(this).addClass("is-invalid").removeClass("is-valid");
    }
    else{
        $(this).addClass("is-valid").removeClass("is-invalid");
    }
});

$("#designation").on("input",function(){
    if($(this).val().trim() === ""){
        $(this).addClass("is-invalid").removeClass("is-valid");
    }
    else{
        $(this).addClass("is-valid").removeClass("is-invalid");
    }
});

let today=new Date();
let maxDate=new Date(today.getFullYear(),today.getMonth(),today.getDate());
$("#doj").attr("max",maxDate.toISOString().split("T")[0]);

$("#password").on("input",function(){
    let passPattern=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
    if(!passPattern.test($(this).val().trim())){
       $(this).addClass("is-invalid").removeClass("is-valid");
    }
    else{
        $(this).addClass("is-valid").removeClass("is-invalid");
    }
});

$("#confirmPass").on("input",function(){
    if(($(this).val().trim()) !==($("#password").val().trim()) ){
        $(this).addClass("is-invalid").removeClass("is-valid");
    }
    else{
        $(this).addClass("is-valid").removeClass("is-invalid");
    }
});

$("#signupForm").on("submit",async function(e){

    e.preventDefault();

    let isValid=true;

    if($("#empId").val().trim() === ""){
        $("#empId").addClass("is-invalid");
        isValid = false;
    }
   

    let namePattern=/^[A-Za-z ]+$/;

    if(!namePattern.test($("#fullname").val().trim())){
        $("#fullname").addClass("is-invalid");
        isValid=false;
    }

    let emailPattern=/^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-z]{3,}$/;

    if(!emailPattern.test($("#email").val().trim())){
        $("#email").addClass("is-invalid");
        isValid=false;
    }
    
    let mobilePattern=/^\d{10}$/;

    if(!mobilePattern.test($("#phone").val().trim())){
         $("#phone").addClass("is-invalid");
         isValid=false;
    }

    if($("#designation").val().trim() === ""){
        $("#designation").addClass("is-invalid");
        isValid=false;
    }
    if($("#dept").val().trim() === ""){
        $("#dept").addClass("is-invalid");
        isValid=false;
    }
   
    let passPattern=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
    if(!passPattern.test($("#password").val().trim())){
       $("#password").addClass("is-invalid");
       isValid=false;
    }


    if(!($("#confirmPass").val().trim() === $("#password").val().trim())){
        $("#confirmPass").addClass("is-invalid");
        isValid=false;
    }

    if(!isValid){
        return;
    }

    const employees = await $.get(API);

    let empExists = employees.find(emp =>
        emp.EmployeeID === $("#empId").val().trim()
    );

    if(empExists){
        Swal.fire({
            icon:"warning",
            title:"Value Exists",
            text:"Employee ID already exists"
        })
        return;
    }

    let emailExists = employees.find(emp =>
        emp.Email === $("#email").val().trim()
    );

    if(emailExists){
         Swal.fire({
            icon:"warning",
            title:"Value Exists",
            text:"Email already exists"
        })
        return;
    }

    let userData={
        EmployeeID:$("#empId").val(),
        Fullname : $("#fullname").val().trim().split(" ").map(word=> word.charAt(0).toUpperCase()+word.slice(1).toLowerCase()).join(" "),
        Email:$("#email").val(),
        Phone:$("#phone").val(),
        JoinedDate:$("#doj").val(),
        Department:$("#dept").val(),
        Designation:$("#designation").val(),
        Password:$("#password").val(),
        Role:"Employee"
    }

    try{
        await $.ajax({
            url:API,
            type:"POST",
            contentType:"application/json",
            data:JSON.stringify(userData)
        });

        await Swal.fire({
            title:"Registered!",
            icon:"success",
            text:"Registered Succesfully"
        });
        
        $("#signupForm")[0].reset();
        localStorage.removeItem("signupFormData");
        await Swal.fire({
            toast:true,
            title:"Redirecting",
            icon:"success",
            position:"top-end",
            showConfirmButton:false,
            timer:2000,
            timerProgressBar:true
        });

        window.location.href="../index.html";

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
        });
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

//storing in local storage
function saveFormData() {
    const formData = {
        empId: $("#empId").val(),
        fullname: $("#fullname").val(),
        email: $("#email").val(),
        phone: $("#phone").val(),
        doj: $("#doj").val(),
        dept: $("#dept").val(),
        designation: $("#designation").val(),
        password: $("#password").val(),
        confirmPass: $("#confirmPass").val()
    };

    localStorage.setItem("signupFormData", JSON.stringify(formData));
}

$("#signupForm input, #signupForm select").on("input change", saveFormData);

//load form data
function loadFormData() {
    const savedData = JSON.parse(
        localStorage.getItem("signupFormData")
    );

    if (!savedData) return;

    $("#empId").val(savedData.empId || "");
    $("#fullname").val(savedData.fullname || "");
    $("#email").val(savedData.email || "");
    $("#phone").val(savedData.phone || "");
    $("#doj").val(savedData.doj || "");
    $("#dept").val(savedData.dept || "");
    $("#designation").val(savedData.designation || "");
    $("#password").val(savedData.password || "");
    $("#confirmPass").val(savedData.confirmPass || "");
}

loadFormData();