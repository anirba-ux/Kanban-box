let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const columns = [todo, progress, done];

let dragElement = null;


function addTask(title,desc,column){

const div = document.createElement("div");

div.classList.add("task");
div.setAttribute("draggable","true");

div.innerHTML=`
<h2>${title}</h2>
<p>${desc}</p>
<button>Delete</button>
`;

column.appendChild(div);


/* Desktop Drag (আগের মতোই) */
div.addEventListener("drag",()=>{
dragElement=div;
});


/* Mobile Tap Move */
div.addEventListener("click",(e)=>{

// delete button click হলে move করবে না
if(e.target.tagName==="BUTTON") return;

if(window.innerWidth<=768){

if(div.parentElement.id==="todo"){
progress.appendChild(div);
}

else if(div.parentElement.id==="progress"){
done.appendChild(div);
}

else if(div.parentElement.id==="done"){
todo.appendChild(div);
}

updateTaskCount();

}

});


/* Delete */
const deleteButton=div.querySelector("button");

deleteButton.addEventListener("click",()=>{
div.remove();
updateTaskCount();
});


return div;

}


function updateTaskCount() {
    columns.forEach(col => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    tasksData[ col.id ] = Array.from(tasks).map(t => {
      return {
        title: t.querySelector("h2").innerText,
        desc: t.querySelector("p").innerText,
      };
    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));

    count.innerText = tasks.length;
  });
}

if(localStorage.getItem("tasks")) {
    const data = JSON.parse(localStorage.getItem("tasks"));

    console.log(data)

    for(const col in data) {
       const column = document.querySelector(`#${col}`);
       data[col].forEach(task => {
          addTask(task.title, task.desc, column)
       })
    }

    updateTaskCount();
}



const tasks = document.querySelectorAll(".task");

tasks.forEach((task) => {
  task.addEventListener("drag", (e) => {
    // console.log("dragging", e)
    dragElement = task;
  });
});

function addDragEventsOnColumn(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });
  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();
    
   

    column.appendChild(dragElement);
    column.classList.remove("hover-over");

    updateTaskCount();

  });
}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

/* Modal related logic */

const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");

toggleModalButton.addEventListener("click", () => {
  modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
});

addTaskButton.addEventListener("click", () => {
  const taskTitle = document.querySelector("#task-title-input").value;
  const taskDesc = document.querySelector("#task-desc-input").value;

  addTask(taskTitle, taskDesc, todo)

 updateTaskCount();

  modal.classList.remove("active");

  document.querySelector("#task-title-input").value = "";
  document.querySelector("#task-desc-input").value = "";
});

/* Modal related logic */

/* Swipe control logic */

const boardWrapper = document.querySelector('.board-wrapper');

let isDown=false;
let startX;
let scrollLeft;

boardWrapper.addEventListener('touchstart',()=>{
 boardWrapper.style.scrollBehavior='smooth';
});

// mouse drag swipe desktop testing
boardWrapper.addEventListener('mousedown',(e)=>{
 isDown=true;
 startX=e.pageX-boardWrapper.offsetLeft;
 scrollLeft=boardWrapper.scrollLeft;
})

boardWrapper.addEventListener('mouseleave',()=>{
 isDown=false;
})

boardWrapper.addEventListener('mouseup',()=>{
 isDown=false;
})

boardWrapper.addEventListener('mousemove',(e)=>{
 if(!isDown) return;
 e.preventDefault();
 const x=e.pageX-boardWrapper.offsetLeft;
 const walk=(x-startX)*2;
 boardWrapper.scrollLeft=scrollLeft-walk;
})
