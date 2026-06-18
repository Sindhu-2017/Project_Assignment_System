document.getElementById("logoutBtn").addEventListener("click",async ()=>{
    const result=await Swal.fire({
        title:"Logout?",
        text:"Are you sure you want to logout?",
        icon:"question",
        showCancelButton:true,
        cancelButtonColor:"#d33",
        confirmButtonColor:"#3085d6",
        confirmButtonText:"Yes,Logout"
    });

    if(result.isConfirmed){
        localStorage.removeItem("loggedInUser");
        window.location.href="login.html";
    }
});


const loggedInUser=JSON.parse(localStorage.getItem("loggedInUser"))

if(loggedInUser){
    document.getElementById("fullname").textContent =loggedInUser.Fullname;
    document.getElementById("email").textContent =loggedInUser.Email;
    document.getElementById("doj").textContent =loggedInUser.JoinedDate;
    document.getElementById("departmentAdmin").textContent =loggedInUser.Department;
    document.getElementById("designation").textContent =loggedInUser.Designation;
}
else{
    window.location.href="login.html";
}

//theme
const savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark"){
    document.body.classList.add("dark-mode");
}

const themeBtn = document.getElementById("themeToggle");

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark-mode");

    const isDark =
    document.body.classList.contains("dark-mode");

    localStorage.setItem(
        "theme",
        isDark ? "dark" : "light"
    );

});
const API="http://localhost:3000/projects";
const EMP_API="http://localhost:3000/employees";

const today=new Date().toISOString().split("T")[0];
document.getElementById("endDate").min=today;


let editId=null;

document.getElementById("assignProject").addEventListener("click",()=>{

    editId = null;

    document.querySelector(".modal-title").textContent ="Assign Project";
    document.getElementById("submitBtn").textContent ="Assign";

});


//Assign Project
document.getElementById("department").addEventListener("change",async function(){

    const department=document.getElementById("department").value.trim();
    const response=await fetch(EMP_API);
    const employees=await response.json();

    const filteredEmployees=employees.filter(
        employee=>employee.Department === department
    );

    document.getElementById("employee").innerHTML=`<option value="">Select Employee</option>`;

    filteredEmployees.forEach(employee => {
          document.getElementById("employee").innerHTML+=
          `<option value="${employee.EmployeeID}">${employee.EmployeeID} - ${employee.Fullname}</option>`      
    });

});

//Assign Project
document.getElementById("submitBtn").addEventListener("click",async function(){

    let today=new Date().toISOString().split("T")[0];
    
    let projectName=document.getElementById("projectName").value.trim();
    let projectDescription=document.getElementById("projectDescription").value.trim();
    let endDate=document.getElementById("endDate").value.trim();
    let department=document.getElementById("department").value;
    let assignedEmployee=document.getElementById("employee").value;
    let remarks=document.getElementById("remarks").value.trim();

    if(!projectName || !projectDescription || !endDate || !department || !assignedEmployee || !remarks ){
        Swal.fire({
            icon:"warning",
            title:"Missing fields",
            text:"Please fill al the fields..."
        });
        return 0;
    }

    if(editId){

        await fetch(`${API}/${editId}`,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                ProjectName:projectName,
                ProjectDescription:projectDescription,
                EndDate:endDate,
                Department:department,
                AssignedEmployee:assignedEmployee,
                Remarks:remarks
            })
        });

        Swal.fire({
            icon:"success",
            title:"Project Updated Successfully"
        });

        editId = null;

        bootstrap.Modal.getInstance(document.getElementById("assignModal")).hide();
        loadProjects();

        return;
    }

    //Project ID Generation

    const response = await fetch(API);
    const projects = await response.json();

    const numbers = projects
        .filter(project => project.ProjectID)
        .map(project =>
            Number(project.ProjectID.replace("PRJ", ""))
        );

    const nextId = Math.max(...numbers, 0) + 1;

    const ProjectID = `PRJ${String(nextId).padStart(3, "0")}`;


    const projectData={
        ProjectID:ProjectID,
        ProjectName:projectName,
        ProjectDescription:projectDescription,
        StartDate:today,
        EndDate:endDate,
        Department:department,
        AssignedEmployee:assignedEmployee,
        ProjectStatus:"Not Yet Started",
        Remarks:remarks,
        isDeleted:false,
        IsViewed:false
    }
    
    try{
        await fetch(API,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(projectData)
        });     
        
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("assignModal")
        );

        modal.hide();
        document.getElementById("projectName").value="";
        document.getElementById("projectDescription").value="";
        document.getElementById("endDate").value="";
        document.getElementById("employee").value="";
        document.getElementById("department").value="";
        document.getElementById("remarks").value="";



        Swal.fire({
            title:"Project Assigned!",
            icon:"success",
            text:"Project Assigned Successfully.."
        });
        loadProjects();

    }
    catch(error){
        console.error(error);
        Swal.fire({
            title:"Error!",
            icon:"error",
            text:"Unable to add task.."
        });
    }
})


//All Projects

loadProjects();

let currentPage = 1;
const itemsPerPage = 6;

function getPageData(data){

    data.sort(
        (a,b)=>new Date(b.StartDate)-new Date(a.StartDate)
    );

    const start = (currentPage - 1) * itemsPerPage;

    return data.slice(start,start + itemsPerPage );
}

async function loadProjects(filter="all"){
    const response=await fetch(API);
    const projects=await response.json();

    const res=await fetch(EMP_API);
    const employees=await res.json();

    const projectCount=projects.filter(project=>project.isDeleted !== true).length;
    document.getElementById("projectCount").innerText=projectCount;

    const completedCount=projects.filter(project=>project.ProjectStatus==="Completed").length
    document.getElementById("completedCount").innerText=completedCount;

    const employeeCount=employees.filter(employee=>employee.Role !== "Admin").length
    document.getElementById("employeeCount").innerText=employeeCount;

    const overdueCount=projects.filter(project=> new Date(project.EndDate) < new Date() && project.ProjectStatus !== "Completed").length;
    document.getElementById("overdueCount").innerText=overdueCount;

    const deletedCount=projects.filter(project=> project.isDeleted === true).length;
    document.getElementById("deletedCount").innerText=deletedCount;

    const taskContainer=document.getElementById("taskContainer");
    taskContainer.innerHTML="";

    //getting value from search filters
    let filteredProjects = projects;

    const projectName = document.getElementById("searchProject")?.value.toLowerCase() || "";

    const employeeId = document.getElementById("searchEmployee")?.value.toLowerCase() || "";

    const status = document.getElementById("statusFilter")?.value || "";

    const fromDate = document.getElementById("fromDate")?.value;

    const toDate = document.getElementById("toDate")?.value;        

    filteredProjects = filteredProjects.filter(project=>{

        const nameMatch = project.ProjectName.toLowerCase().includes(projectName);

        const employeeMatch =  project.AssignedEmployee.toLowerCase().includes(employeeId);

        const statusMatch = !status || project.ProjectStatus === status;

        const projectDate =  new Date(project.StartDate);
        const dateMatch = (!fromDate || projectDate >= new Date(fromDate)) &&  (!toDate || projectDate <= new Date(toDate));

        return (
            nameMatch && employeeMatch && statusMatch && dateMatch
        );

    });

    

    if(filter === "all"){
        filteredProjects=filteredProjects.filter(project=>project.isDeleted !== true);

        getPageData(filteredProjects).forEach(project=>{
            const card=document.createElement("div");
            card.className="card project-card shadow-sm";

            let badgeClass = "";

            let statusText=project.ProjectStatus;

            const overdue = project.ProjectStatus !== "Completed" && new Date(project.EndDate) < new Date();

            if(overdue){
                badgeClass = "badge-overdue";
                statusText="Overdue";
            }
            else if(project.ProjectStatus === "Completed"){
                badgeClass = "badge-completed";
            }
            else if(project.ProjectStatus === "InProgress"){
                badgeClass = "badge-progress";
            }
            else{
                badgeClass = "badge-notstarted";
            }

            let progress = 0;
            let progressColor = "bg-secondary";

            if(overdue){
                progress = 100;
                progressColor = "bg-danger";
            }
            else if(project.ProjectStatus === "Completed"){
                progress = 100;
                progressColor = "bg-success";
            }
            else if(project.ProjectStatus === "InProgress"){
                progress = 40;
                progressColor = "bg-warning";
            }
            else{
                progress = 0;
                progressColor = "bg-danger";
            }

            card.innerHTML = `
                <div class="card-header project-header">
                    <i class="bi bi-kanban-fill me-2"></i>
                    ${project.ProjectID}
                </div>

                <div class="card-body">

                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title">
                            ${project.ProjectName}
                        </h5>

                        <span class="badge ${badgeClass}">
                            ${statusText}
                        </span>
                    </div>

                    <p>
                        <i class="bi bi-file-earmark-text-fill text-info me-2"></i>
                        ${project.ProjectDescription}
                    </p>

                    <p>
                        <i class="bi bi-person-badge-fill text-primary me-2"></i>
                        ${project.AssignedEmployee}
                    </p>

                    <div class="d-flex gap-4 project-dates mb-3">
                        <span>
                            <i class="bi bi-calendar-plus text-success me-1"></i>
                            <strong>Assigned Date:</strong>
                            ${project.StartDate}
                        </span>

                        <span>
                            <i class="bi bi-calendar-x-fill text-danger me-1"></i>
                            <strong>End Date:</strong>
                            ${project.EndDate}
                        </span>
                    </div>

                    <div class="progress mt-3">
                        <div class="progress-bar ${progressColor}"
                            style="width:${progress}%">
                            ${overdue?"overdue":progress + "%"}
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-end gap-2">
                    ${project.ProjectStatus !== "Completed" ? 
                        `<button class="btn btn-sm btn-warning rounded-circle edit-btn m-2" title="edit task" data-id="${project.id}">
                            <i class="bi bi-pencil-square"></i>
                        </button>`: ""
                    }

                    ${project.ProjectStatus === "Not Yet Started"  ? 
                        `<button class="btn btn-sm btn-info rounded-circle delete-btn m-2" title="delete task" data-id="${project.id}">
                            <i class="bi bi-trash-fill"></i>
                        </button>`: ""
                    }

                </div>
            `;
            taskContainer.appendChild(card);
            const editBtn = card.querySelector(".edit-btn");

            if(editBtn){

                editBtn.addEventListener("click",async ()=>{

                    editId = project.id;

                    document.querySelector(".modal-title").textContent ="Edit Project";
                    document.getElementById("submitBtn").textContent ="Update";

                    document.getElementById("projectName").value = project.ProjectName;

                    document.getElementById("projectDescription").value = project.ProjectDescription;

                    document.getElementById("endDate").value = project.EndDate;

                    document.getElementById("department").value =  project.Department;

                    document.getElementById("employee").value = project.AssignedEmployee;

                    document.getElementById("remarks").value = project.Remarks;

                    const modal = new bootstrap.Modal(
                        document.getElementById("assignModal")
                    );

                    modal.show();

                });

            }
            const deleteBtn=card.querySelector(".delete-btn");
            if(deleteBtn){

                deleteBtn.addEventListener("click",async function(){
                    const result=await Swal.fire({
                        title:"Delete Project?",
                        icon:"warning",
                        showCancelButton:true
                    });

                    if(result.isConfirmed){
                        await fetch(`${API}/${project.id}`,{
                            method:"PATCH",
                            headers:{"Content-Type":"application/JSON"},
                            body:JSON.stringify({isDeleted:true})
                        });

                        Swal.fire({
                            toast:true,
                            timer:2000,
                            timerProgressBar:true,
                            icon:"success",
                            title:"Project Deleted Successfully ...",
                            position:"top-end",
                            showCancelButton:false
                        });
                    }   
                    loadProjects();                

                });
            }            
        });
        renderPagination(filteredProjects.length, "all");

    }

    else if(filter === "completed"){
        const completedProjects=projects.filter(project=>project.ProjectStatus === "Completed");

        getPageData(completedProjects).forEach(project=>{
            const card=document.createElement("div");
            card.className="card project-card shadow-sm";

            card.innerHTML=`
                <div class="card-header project-header">
                    <i class="bi bi-kanban-fill me-2"></i>
                    ${project.ProjectID}
                </div>
                <div class="card-body">

                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title">
                            ${project.ProjectName}
                        </h5>

                        <span class="badge badge-completed">
                            ${project.ProjectStatus}
                        </span>
                    </div>

                    <p>
                        <i class="bi bi-file-earmark-text-fill text-info me-2"></i>
                        ${project.ProjectDescription}
                    </p>

                    <p>
                        <i class="bi bi-person-badge-fill text-primary me-2"></i>
                        ${project.AssignedEmployee}
                    </p>

                    <div class="d-flex gap-4 project-dates mb-3">
                        <span>
                            <i class="bi bi-calendar-plus text-success me-1"></i>
                            <strong>Assigned Date:</strong>
                            ${project.StartDate}
                        </span>

                        <span>
                            <i class="bi bi-calendar-x-fill text-danger me-1"></i>
                            <strong>End Date:</strong>
                            ${project.EndDate}
                        </span>
                    </div>

                    <div class="progress mt-3">
                        <div class="progress-bar bg-success"
                            style="width:100%">
                            100%
                        </div>
                    </div>

                </div>
            `;

            taskContainer.appendChild(card);
        });
        renderPagination(completedProjects.length, "completed");

    }
   
    else if(filter === "employees"){
        taskContainer.innerHTML=`
        <div class="employeeTableWrapper">

            <div class="employee-card">

                <div class="employee-header">
                    <div>
                        <i class="bi bi-people-fill me-2"></i>
                        Employee Directory
                    </div>

                    <span class="employee-count">
                        ${employees.filter(emp=>emp.Role !== "Admin").length}
                        Employees
                    </span>
                </div>

                <div class="table-responsive">
                    <table class="table employee-table mb-0">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Designation</th>
                                <th>Joined Date</th>
                            </tr>
                        </thead>

                        <tbody id="empTableBody"></tbody>
                    </table>
                </div>

            </div>

        </div>
        `;

        const tableBody=document.getElementById("empTableBody");

        employees.filter(employee=>employee.Role !== "Admin").forEach(employee=>{
            tableBody.innerHTML +=`
                <tr>
                    <td>${employee.EmployeeID}</td>
                    <td>${employee.Fullname}</td>
                    <td>${employee.Email}</td>
                    <td>${employee.Department}</td>
                    <td>${employee.Designation}</td>
                    <td>${employee.JoinedDate}</td>

                </tr>
        `;
        })

        document.getElementById("pagination").innerHTML = "";
               
    }
    else if(filter === "overdue"){

        const overdueProjects=projects.filter(project=> new Date(project.EndDate) < new Date() && project.ProjectStatus !== "Completed")

        getPageData(overdueProjects).forEach(project=>{
            const card=document.createElement("div");
            card.className="card project-card";

            card.innerHTML=`
                <div class="card-header project-header">
                    <i class="bi bi-kanban-fill me-2"></i>
                    ${project.ProjectID}
                </div>
                <div class="card-body">

                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title">
                            ${project.ProjectName}
                        </h5>

                        <span class="badge badge-overdue">
                            Overdue
                        </span>
                    </div>

                    <p>
                        <i class="bi bi-file-earmark-text-fill text-info me-2"></i>
                        ${project.ProjectDescription}
                    </p>

                    <p>
                        <i class="bi bi-person-badge-fill text-primary me-2"></i>
                        ${project.AssignedEmployee}
                    </p>

                    <div class="d-flex gap-4 project-dates mb-3">
                        <span>
                            <i class="bi bi-calendar-plus text-success me-1"></i>
                            <strong>Assigned Date:</strong>
                            ${project.StartDate}
                        </span>

                        <span>
                            <i class="bi bi-calendar-x-fill text-danger me-1"></i>
                            <strong>End Date:</strong>
                            ${project.EndDate}
                        </span>
                    </div>

                    <div class="progress mt-3">
                        <div class="progress-bar bg-danger"
                            style="width:100%">
                            overdue
                        </div>
                    </div>

                    <div class="d-flex justify-content-end gap-2">
                        ${project.ProjectStatus !== "Completed" ? 
                            `<button class="btn btn-sm btn-warning rounded-circle edit-btn m-2" title="edit task" data-id="${project.id}">
                                <i class="bi bi-pencil-square"></i>
                            </button>`: ""
                        }

                        ${project.ProjectStatus === "Not Yet Started"  ? 
                            `<button class="btn btn-sm btn-info rounded-circle delete-btn m-2" title="delete task" data-id="${project.id}">
                                <i class="bi bi-trash-fill"></i>
                            </button>`: ""
                        }

                    </div>

                </div>

            `;

            taskContainer.appendChild(card);
            const editBtn = card.querySelector(".edit-btn");

            if(editBtn){

                editBtn.addEventListener("click",async ()=>{

                    editId = project.id;

                    document.querySelector(".modal-title").textContent ="Edit Project";
                    document.getElementById("submitBtn").textContent ="Update";

                    document.getElementById("projectName").value = project.ProjectName;

                    document.getElementById("projectDescription").value = project.ProjectDescription;

                    document.getElementById("endDate").value = project.EndDate;

                    document.getElementById("department").value =  project.Department;

                    document.getElementById("employee").value = project.AssignedEmployee;

                    document.getElementById("remarks").value = project.Remarks;

                    const modal = new bootstrap.Modal(
                        document.getElementById("assignModal")
                    );

                    modal.show();

                });
                loadProjects();

            }
            const deleteBtn=card.querySelector(".delete-btn");
            if(deleteBtn){

                deleteBtn.addEventListener("click",async function(){
                    const result=await Swal.fire({
                        title:"Delete Project?",
                        icon:"warning",
                        showCancelButton:true
                    });

                    if(result.isConfirmed){
                        await fetch(`${API}/${project.id}`,{
                            method:"PATCH",
                            headers:{"Content-Type":"application/JSON"},
                            body:JSON.stringify({isDeleted:true})
                        });

                        Swal.fire({
                            toast:true,
                            timer:2000,
                            timerProgressBar:true,
                            icon:"success",
                            title:"Project Deleted Successfully ...",
                            position:"top-end",
                            showCancelButton:false
                        });
                    }   
                    loadProjects();                

                });
            }
        });
        renderPagination(overdueProjects.length, "overdue");

    }
    else if(filter === "deleted"){
        const deletedProjects = projects.filter(project=>project.isDeleted === true);
        getPageData(deletedProjects).forEach(project=>{
            const card=document.createElement("div");
            card.className="card project-card";

            card.innerHTML=`
                <div class="card-header project-header">
                    <i class="bi bi-kanban-fill me-2"></i>
                    ${project.ProjectID}
                </div>
                <div class="card-body">

                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title">
                            ${project.ProjectName}
                        </h5>

                        <span class="badge badge-overdue">
                            Deleted
                        </span>
                    </div>

                    <p>
                        <i class="bi bi-file-earmark-text-fill text-info me-2"></i>
                        ${project.ProjectDescription}
                    </p>

                    <p>
                        <i class="bi bi-person-badge-fill text-primary me-2"></i>
                        ${project.AssignedEmployee}
                    </p>

                    <div class="d-flex gap-4 project-dates mb-3">
                        <span>
                            <i class="bi bi-calendar-plus text-success me-1"></i>
                            <strong>Assigned Date:</strong>
                            ${project.StartDate}
                        </span>

                        <span>
                            <i class="bi bi-calendar-x-fill text-danger me-1"></i>
                            <strong>End Date:</strong>
                            ${project.EndDate}
                        </span>
                    </div>
                    <div class="d-flex justify-content-end gap-2">                        
                        <button class="btn btn-sm btn-warning rounded-circle restore-btn m-2" title="restore task" data-id="${project.id}">
                                <i class="bi bi-arrow-clockwise"></i>
                        </button>                        
                    </div>

                </div>

            `;

            taskContainer.appendChild(card);

            const restoreBtn=card.querySelector(".restore-btn");
            if(restoreBtn){

                restoreBtn.addEventListener("click",async function(){
                    const result=await Swal.fire({
                        title:"Restore Project?",
                        icon:"question",
                        showCancelButton:true
                    });

                    if(result.isConfirmed){
                        await fetch(`${API}/${project.id}`,{
                            method:"PATCH",
                            headers:{"Content-Type":"application/JSON"},
                            body:JSON.stringify({isDeleted:false})
                        });

                        Swal.fire({
                            toast:true,
                            timer:2000,
                            timerProgressBar:true,
                            icon:"success",
                            title:"Project Restored Successfully ...",
                            position:"top-end",
                            showCancelButton:false
                        });
                    }   
                    loadProjects();                

                });
            }
        });
        renderPagination(deletedProjects.length, "deleted");
    }    
}

//activate tab

function setActivateTab(activeID){
    document.querySelectorAll(".nav-link").forEach(tab=>{
        tab.classList.remove("active");
        tab.classList.add("text-black");
    })

    const activeTab=document.getElementById(activeID);
    activeTab.classList.add("active");
    activeTab.classList.remove("text-black");
    
}

document.getElementById("projects").addEventListener("click",()=>{
    currentPage = 1;
    setActivateTab("projects");
    loadProjects("all")
})


document.getElementById("employees").addEventListener("click",()=>{
    currentPage = 1;
    setActivateTab("employees");
    loadProjects("employees")
})

document.getElementById("completed").addEventListener("click",()=>{
    currentPage = 1;
    setActivateTab("completed");
    loadProjects("completed");
})

document.getElementById("overdue").addEventListener("click",()=>{
    currentPage = 1;
    setActivateTab("overdue");
    loadProjects("overdue")
})
document.getElementById("deleted").addEventListener("click",()=>{
    currentPage = 1;
    setActivateTab("deleted");
    loadProjects("deleted")
})

//filters for search
document.getElementById("searchProject").addEventListener("input",()=>{
    loadProjects();
});

document.getElementById("searchEmployee").addEventListener("input",()=>{
    loadProjects();
});

document.getElementById("statusFilter").addEventListener("change",()=>{
    loadProjects();
});

document.getElementById("fromDate").addEventListener("change",()=>{
    loadProjects();
});

document.getElementById("toDate").addEventListener("change",()=>{
    loadProjects();
});

document.getElementById("clearFilter").addEventListener("click",()=>{
    document.getElementById("searchProject").value="";
    document.getElementById("searchEmployee").value="";
    document.getElementById("statusFilter").value="";
    document.getElementById("fromDate").value="";
    document.getElementById("toDate").value="";
    loadProjects();
});


function renderPagination(dataLength, filter){

    const totalPages =
        Math.ceil(dataLength / itemsPerPage);

    const pagination =
        document.getElementById("pagination");

    pagination.innerHTML = "";

    for(let i=1;i<=totalPages;i++){

        const active =
            currentPage === i ? "active" : "";

        pagination.innerHTML += `
            <li class="page-item ${active}">
                <button
                    class="page-link"
                    onclick="changePage(${i},'${filter}')">
                    ${i}
                </button>
            </li>
        `;
    }
}

function changePage(page, filter){

    console.log("Clicked Page:", page);

    currentPage = page;
    loadProjects(filter);
}