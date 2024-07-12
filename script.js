const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");

// Lista de Items
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Inicializar Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Funcionalidade de Drag and Drop
let draggedItem;
let currentColumn;
let dragging = false;

// Pega Arrays do localStorage se disponível, definir o valor padrão se não
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Aprender JavaScript", "Fazer um projeto", "Deitar e relaxar"];
    progressListArray = ["Trabalhar em projetos", "Ouvir música"];
    completeListArray = ["Ser Maneiro", "Fazer algo incrível"];
    onHoldListArray = ["Ser Chato"];
  }
}

// Definir localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  let arrayNames = ["backlog", "progress", "complete", "onHold"];
  listArrays.forEach((array, index) => {
    localStorage.setItem(`${arrayNames[index]}Items`, JSON.stringify(array));
  });

  // localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
  // localStorage.setItem('progressItems', JSON.stringify(progressListArray));
  // localStorage.setItem('completeItems', JSON.stringify(completeListArray));
  // localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));
}

// Filtrar Arrays para remover itens vazios
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}

// Criar DOM Elements para cada item
function createItemEl(columnEl, column, item, index) {
  // console.log("columnEl:", columnEl);
  // console.log("column:", column);
  // console.log("item:", item);
  // console.log("index:", index);
  // Listar Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  // Append
  columnEl.appendChild(listEl);
}

// Atualizar colunas no DOM - Resetar HTML, Filtrar Array, Atualizar localStorage
function updateDOM() {
  // Checar localStorage uma vez
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  // Coluna de Backlog
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  })
  backlogListArray = filterArray(backlogListArray);

  // Coluna de Progresso
  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  })
  progressListArray = filterArray(progressListArray);

  // Coluna de Completos
  completeList.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  })
  completeListArray = filterArray(completeListArray);

  // Coluna de Em Espera
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  })
  onHoldListArray = filterArray(onHoldListArray);

  // Rodar getSavedColumns apenas uma vez, Atualizar Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Atualizar item - Excluir se vazio, ou atualizar o array
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  // !selectedColumnEl[id].textContent ? delete selectedArray[id] : selectedArray[id] = selectedColumnEl[id].textContent;
  // if (!selectedColumnEl[id].textContent) {
  //   delete selectedArray[id];
  // } else {
  //   selectedArray[id] = selectedColumnEl[id].textContent;
  // }
  if (!dragging) {
    !selectedColumnEl[id].textContent ? delete selectedArray[id] : selectedArray[id] = selectedColumnEl[id].textContent;
  }
  updateDOM();
}

// Adicionar item a lista da coluna, redefinir o texto de entrada
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM();
}

// Mostrar Adicionar Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}

// Ocultar Adicionar Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}

// Permitir Arrays para refletir o Drag and Drop
function rebuildArrays() {
  // console.log(backlogList.children);
  // backlogListArray = [];
  // progressListArray = [];
  // completeListArray = [];
  // onHoldListArray = [];
  // for (let i = 0; i < backlogList.children.length; i++) {
  //   backlogListArray.push(backlogList.children[i].textContent);
  // }
  // for (let i = 0; i < progressList.children.length; i++) {
  //   progressListArray.push(progressList.children[i].textContent);
  // }
  // for (let i = 0; i < completeList.children.length; i++) {
  //   completeListArray.push(completeList.children[i].textContent);
  // }
  // for (let i = 0; i < onHoldList.children.length; i++) {
  //   onHoldListArray.push(onHoldList.children[i].textContent);
  // }
  backlogListArray = Array.from(backlogList.children).map(i => i.textContent);
  progressListArray = Array.from(progressList.children).map(i => i.textContent);
  completeListArray = Array.from(completeList.children).map(i => i.textContent);
  onHoldListArray = Array.from(onHoldList.children).map(i => i.textContent);
  updateDOM();
}

// Quando o item começa a arrastar
function drag(e) {
  draggedItem = e.target;
  // console.log("draggedItem:", draggedItem);
  dragging = true;
}

// Quando o item entra em uma área de queda
function allowDrop(e) {
  e.preventDefault();
}

// Adicionar cor de fundo quando o item entra em uma área de queda
function dragEnter(column) {
  //console.log("column:", column);
  //console.log(listColumns[column]);
  listColumns[column].classList.add("over");
  currentColumn = column;
}

// Quando o item solta
function drop(e) {
  e.preventDefault();
  // console.log("drop");
  // Remover a cor de fundo e padding
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  // Adicionar item ao DOM
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  // Dragging completo
  dragging = false;
  rebuildArrays();
}

// On Load - Atualizar DOM
updateDOM();

