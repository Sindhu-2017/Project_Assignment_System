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

const themeBtn = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark"){

    document.body.classList.add("dark-mode");

    themeBtn.innerHTML =
    '<i class="bi bi-sun-fill"></i>';

}
else{

    themeBtn.innerHTML =
    '<i class="bi bi-moon-fill"></i>';

}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark-mode");

    const isDark =
    document.body.classList.contains("dark-mode");

    localStorage.setItem(
        "theme",
        isDark ? "dark" : "light"
    );

    themeBtn.innerHTML = isDark
        ? '<i class="bi bi-sun-fill"></i>'
        : '<i class="bi bi-moon-fill"></i>';

});

const API="http://localhost:3000/projects";
const EMP_API="http://localhost:3000/employees";

let currentPage = 1;
const itemsPerPage = 6;
let currentFilter = "all";

const loggedInUser=JSON.parse(localStorage.getItem("loggedInUser"))

if(loggedInUser){
    document.getElementById("fullname").textContent =loggedInUser.Fullname;
    document.getElementById("email").textContent =loggedInUser.Email;
    document.getElementById("doj").textContent =loggedInUser.JoinedDate;
    document.getElementById("department").textContent =loggedInUser.Department;
    document.getElementById("designation").textContent =loggedInUser.Designation;
}
else{
    window.location.href="login.html";
}



function getPageData(data){

    const start =  (currentPage - 1) * itemsPerPage;
    return data.slice( start, start + itemsPerPage);
}
//loadProjects

async function loadProjects(filter="all"){
    currentFilter = filter;

    const response=await fetch(API);
    const projects=await response.json();

    const employeeProjects=projects.filter(project=>project.AssignedEmployee === loggedInUser.EmployeeID)

    const allCount=employeeProjects.length;
    document.getElementById("allCount").innerText=allCount;

    const completedCount=employeeProjects.filter(project=>project.ProjectStatus==="Completed").length;
    document.getElementById("completedCount").innerText=completedCount;

    const pendingCount=employeeProjects.filter(project=>project.ProjectStatus==="InProgress").length
    document.getElementById("progressCount").innerText=pendingCount;

    const notStartedCount=employeeProjects.filter(project=>project.ProjectStatus==="Not Yet Started").length
    document.getElementById("notStartedCount").innerText=notStartedCount;

    const overdueCount=employeeProjects.filter(project=>project.ProjectStatus !== "Completed" && new Date(project.EndDate) < new Date()).length
    document.getElementById("overdueCount").innerText=overdueCount;

    const taskContainer=document.getElementById("taskContainer");
    taskContainer.innerHTML="";

    let filteredProjects=employeeProjects;

    if(filter === "pending"){
        filteredProjects=employeeProjects.filter(project=>project.ProjectStatus === "InProgress")
    }
    else if(filter === "completed"){
        filteredProjects=employeeProjects.filter(project=>project.ProjectStatus === "Completed")
    }
    else if(filter === "notStarted"){
        filteredProjects=employeeProjects.filter(project=>project.ProjectStatus === "Not Yet Started")
    }
    else if(filter === "overdue"){
        filteredProjects=employeeProjects.filter(project=>project.ProjectStatus !== "Completed" && new Date(project.EndDate) < new Date())
    }

    const searchName = document .getElementById("searchName") .value .toLowerCase();

    const fromDate =  document.getElementById("fromDate").value;

    const toDate =  document.getElementById("toDate").value;

    filteredProjects = filteredProjects.filter(project => {

        const hasName = searchName.trim() !== "";
        const hasDate = fromDate || toDate;

        const nameMatch =  project.ProjectName.toLowerCase().includes(searchName);

        const projectDate = new Date(project.StartDate);

        const dateMatch =(!fromDate || projectDate >= new Date(fromDate)) && (!toDate || projectDate <= new Date(toDate));

        if(hasName){
            return nameMatch;
        }

        if(hasDate){
            return dateMatch;
        }

        return true;
    });

    filteredProjects.sort( (a,b)=>  new Date(b.StartDate) -  new Date(a.StartDate));
   
    getPageData(filteredProjects).forEach(project=>{

        const isNew = project.IsViewed === false;
        const card=document.createElement("div");
        card.className = `
            card shadow-sm m-3 project-card
            ${isNew ? "new-task-blink" : ""}
        `;

        let badgeClass = "";
        let statusText=project.ProjectStatus;

        const overdue=project.ProjectStatus !== "Completed" && new Date(project.EndDate) < new Date();
        if(overdue){
            badgeClass="badge-overdue";
            statusText="Overdue";
        }
        else if(project.ProjectStatus === "Completed"){
            badgeClass = "badge-completed";
        }
        else if(project.ProjectStatus === "InProgress"){
            badgeClass = "badge-progress";   
        }
        else if(project.ProjectStatus === "Not Yet Started"){
            badgeClass = "badge-notstarted";   
        }
      

        let progress=0;
        let progressColor="bg-secondary";

        if(overdue){
            progressColor="bg-danger";
        }
        else if(project.ProjectStatus === "Completed"){
            progress=100;
            progressColor="bg-success";
        }
        else if(project.ProjectStatus === "InProgress"){
            progress=60; 
            progressColor="bg-warning"; 
        }
        else if(project.ProjectStatus === "Not Yet Started"){
            progress=0; 
            progressColor="bg-danger";
        }  
        

        card.innerHTML=`
            <div class="card-header project-header">
                <i class="bi bi-kanban-fill me-2"></i>
                ${project.ProjectID}
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <h5 class="card-title">${project.ProjectName}</h5>
                    <span class="badge ${badgeClass}">${statusText}</span>
                </div>
                <p><i class="bi bi-file-earmark-text-fill text-info me-2"></i>${project.ProjectDescription}</p>
                                
                <p><i class="bi bi-person-badge-fill text-primary me-2"></i>${project.AssignedEmployee}</p>
                <div class="d-flex gap-4 project-dates mb-3">
                    <span><i class="bi bi-calendar-plus text-success me-1"></i><strong>Assigned Date:</strong> ${project.StartDate}</span>
                    <span><i class="bi bi-calendar-x-fill text-danger me-1"></i><strong>End Date:</strong> ${project.EndDate}</span>
                </div>

                <div class="progress mt-3">
                    <div class="progress-bar ${progressColor}" style="width:${progress}%">
                        ${overdue?"overdue" : progress+"%"}
                    </div>
                </div>
                
                <div class="d-flex justify-content-end gap-2 mt-3">
                    ${project.ProjectStatus === "Not Yet Started" ?`
                    <button class="btn btn-info btn-sm rounded-circle start-btn" title="Start Task">
                        <i class="bi bi-play-circle"></i>
                    </button>`:""}

                    ${project.ProjectStatus === "InProgress" ?`
                    <button class="btn btn-info btn-sm rounded-circle complete-btn" title="Complete Task">
                        <i class="bi bi-check-lg"></i>
                    </button>`:""}
                </div>
            </div>
         `;

        taskContainer.appendChild(card);if(project.IsViewed === false){
        card.addEventListener("click", async ()=>{

            if(!project.IsViewed){

                await fetch(`${API}/${project.id}`,{
                    method:"PATCH",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        IsViewed:true
                    })
                });

            }

        });           
    }


         const startBtn = card.querySelector(".start-btn");

                if(startBtn){
                    startBtn.addEventListener("click", async ()=>{

                        await fetch(`${API}/${project.id}`,{
                            method:"PATCH",
                            headers:{
                                "Content-Type":"application/json"
                            },
                            body:JSON.stringify({
                                ProjectStatus:"InProgress"
                            })
                        });

                        await Swal.fire({
                            icon:"success",
                            title:"Updated Successfully!",
                            text:"Project status updated to InProgress successfully.."
                        });
                

                    });
                }

                const completeBtn = card.querySelector(".complete-btn");

                if(completeBtn){
                    completeBtn.addEventListener("click", async ()=>{

                        await fetch(`${API}/${project.id}`,{
                            method:"PATCH",
                            headers:{
                                "Content-Type":"application/json"
                            },
                            body:JSON.stringify({
                                ProjectStatus:"Completed"
                            })
                        });
                        await Swal.fire({
                            icon:"success",
                            title:"Updated Successfully!",
                            text:"Project status updated to Completed successfully.."
                        });
                    });
                }
                      
    });
    renderPagination(filteredProjects.length);


}

function renderPagination(totalItems){

    const totalPages =
        Math.ceil(totalItems / itemsPerPage);

    const pagination =
        document.getElementById("pagination");

    pagination.innerHTML = "";

    for(let i=1;i<=totalPages;i++){

        const li = document.createElement("li");

        li.className =
            `page-item ${
                currentPage === i ? "active" : ""
            }`;

        li.innerHTML = `
            <button class="page-link">
                ${i}
            </button>
        `;

        li.addEventListener("click",()=>{

            currentPage = i;

            loadProjects(currentFilter);
        });

        pagination.appendChild(li);
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

document.getElementById("all").addEventListener("click",()=>{
    currentPage = 1;
    setActivateTab("all");
    loadProjects("all")
})


document.getElementById("pending").addEventListener("click",()=>{
    currentPage = 1;
    setActivateTab("pending");
    loadProjects("pending")
})

document.getElementById("completed").addEventListener("click",()=>{
    currentPage = 1;
    setActivateTab("completed");
    loadProjects("completed")
})

document.getElementById("notStarted").addEventListener("click",()=>{
    currentPage = 1;
    setActivateTab("notStarted");
    loadProjects("notStarted")
})

document.getElementById("overdue").addEventListener("click",()=>{
    currentPage = 1;
    setActivateTab("overdue");
    loadProjects("overdue")
})

document.getElementById("searchName").addEventListener("input", () => {
    currentPage = 1;
    loadProjects();
});

document.getElementById("fromDate").addEventListener("change", () => {
    currentPage = 1;
    loadProjects();
});

document.getElementById("toDate").addEventListener("change", () => {
    currentPage = 1;
    loadProjects();
});

document.getElementById("clearFilter").addEventListener("click", () => {

    document.getElementById("searchName").value = "";
    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";

    loadProjects();
});

loadProjects("all");