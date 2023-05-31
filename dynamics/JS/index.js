window.addEventListener("load",()=>{
    const contLista = document.getElementById("contLista"), contadorT = document.getElementById("contadorT");
    const divNuevaM = document.getElementById("divNuevaM"), noT = document.getElementById("alert");
    const btnAgregar = document.getElementById("btnAgregar"), btnLimpiar = document.getElementById("btnLimpiar");
    const inputT = document.getElementById("tarea"), selectM = document.getElementById("materia"), inputNuevaM = document.getElementById("inputNuevaM");
    var tareas = [], materias = [], tareasCompletadas = 0;
    const myModal=document.getElementById('alertForm');
    const btnAlertForm=document.getElementById('btnAlertForm');
    btnAlertForm.addEventListener('click', () =>{
        myModal.style.display="none";
        myModal.style.backgroundColor="none";
    });
    btnLimpiar.addEventListener("click",()=>{
        selectM.value="MATERIA";
        divNuevaM.style.display = (selectM.value == "OTRA") ? "block" : "none";
    });
    btnAgregar.addEventListener("click",(e)=>{
        e.preventDefault();
        e.stopPropagation();
        if(verificaDatos()){
            divNuevaM.style.display = (selectM.value == "OTRA") ? "block" : "none";
            tareas.push(inputT.value.toUpperCase());
            actualizaC();
            let valor=(inputNuevaM.value=="")?selectM.value:inputNuevaM.value;
            actualizaT(valor);
            inputNuevaM.value="";
            inputT.value="";
        }
    });
    selectM.addEventListener("change",()=>{
        divNuevaM.style.display = (selectM.value == "OTRA") ? "block" : "none";
        if(selectM.value!="OTRA"){
            inputNuevaM.value="";
        }
    });
    function verificaDatos(){
        let resp=true;
        if(inputT.value==""){
            resp=false;
            errorDatos("No se ingresó una tarea");
        }else if(selectM.value=="MATERIA"){
            resp=false;
            errorDatos("No se seleccionó una materia");
        }else if(selectM.value=="OTRA" && inputNuevaM.value==""){
            resp=false;
            errorDatos("No se ingresó una materia");
        }else if(tareas.includes(inputT.value.toUpperCase())){
            resp=false;
            errorDatos("La tarea ya existe");
        }else if(materias.includes(inputNuevaM.value.toUpperCase())){
            resp=false;
            errorDatos("La materia ya existe");
        }else if(selectM.value=="OTRA" && inputNuevaM.value!=""){
            materias.push(inputNuevaM.value.toUpperCase());
            selectM.innerHTML += "<option value='"+inputNuevaM.value+"'>"+inputNuevaM.value+"</option>";
        }
        return resp;
    }
    function errorDatos(mensaje){
        var p=document.getElementById("modalText");
        p.innerHTML=mensaje;
        myModal.style.display="block";
        myModal.style.backgroundColor="rgba(0, 0, 0, 0.50)";
    }
    function actualizaC() {
        if(tareas.length>0){
            noT.classList.add("hidden");
            contadorT.style.display="block";
            contadorT.innerHTML = `<span class='fs-4' id='contadorT'>${tareasCompletadas} tarea(s) completadas de ${tareas.length}</span>`;  
        }else{
            contLista.style.display="none";
            contadorT.style.display="none";
            noT.classList.remove("hidden");
        }
    }
    function actualizaT(valor) {
        let divTarea = document.createElement("div");
        divTarea.classList.add("homeworks","d-flex","flex-column","p-3","rounded");
        divTarea.innerHTML = `<span class="fs-3 text-white">${valor}: ${inputT.value}</span>
                                <div class="botones d-flex flex-row flex-wrap justify-content-end align-self-end gap-1 pt-3">
                                    <span class="btn bg-light" id="completed">Completada</span>
                                    <span class="btn bg-light" id="delete">Eliminar</span>
                                    <span class="btn bg-light" id="up">Arriba</span>
                                    <span class="btn bg-light" id="down">Abajo</span>
                                </div>`;
        divTarea.dataset.nameTarea = inputT.value.toUpperCase();
        divTarea.addEventListener("click", btnPresionado);
        contLista.appendChild(divTarea);
    }
    function btnPresionado(e) {
        switch (e.target.id) {
            case "completed":
                e.target.parentElement.parentElement.classList.toggle("completada");
                tareasCompletadas=(e.target.parentElement.parentElement.classList.contains("completada"))?tareasCompletadas+1:tareasCompletadas-1;
                actualizaC();
                break;
            case "delete":
                e.target.parentElement.parentElement.outerHTML = "";
                let nameTarea = e.target.parentElement.parentElement.dataset.nameTarea;
                let posicionTarea = tareas.indexOf(nameTarea);
                tareas.splice(posicionTarea, 1);
                if(e.target.parentElement.parentElement.classList.contains("completada")){
                    tareasCompletadas--;
                }
                actualizaC();
                break;
            case "up":
                let elementCurrent=e.target.parentElement.parentElement, elementUp=e.target.parentElement.parentElement.previousElementSibling;
                if(elementUp.classList.contains("alert")!=true){
                    if(elementCurrent.classList.contains("completada")){
                        elementUp.classList.add("completada");
                        elementCurrent.classList.remove("completada");
                    }else if(elementUp.classList.contains("completada")){
                        elementCurrent.classList.add("completada");
                        elementUp.classList.remove("completada");
                    }
                    const respCurrent=elementCurrent.innerHTML, respUp=elementUp.innerHTML;
                    elementUp.innerHTML=respCurrent;
                    elementCurrent.innerHTML=respUp;
                }
                break;
            case "down":
                let elementoActual=e.target.parentElement.parentElement, elementDown=e.target.parentElement.parentElement.nextElementSibling;
                if(elementDown!=null){
                    if(elementoActual.classList.contains("completada")){
                        elementDown.classList.add("completada");
                        elementoActual.classList.remove("completada");
                    }else if(elementDown.classList.contains("completada")){
                        elementoActual.classList.add("completada");
                        elementDown.classList.remove("completada");
                    }
                    const respActual=elementoActual.innerHTML, respDown=elementDown.innerHTML;
                    elementDown.innerHTML=respActual;
                    elementoActual.innerHTML=respDown;
                }
                break;
            default:
                break;
        }
    }
});