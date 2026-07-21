let selectedIndex = -1;

let data = JSON.parse(
    localStorage.getItem("tvData")
)
||
{
    date: "",
    time: "",
    items: []
};



function load(){
    alert("Версия программы: " + VERSION);

    
    createButtons();

    showInfo();

    showReport();

}




function createButtons(){

    let box = document.getElementById("channels");


    channels.forEach(channel => {


        let button = document.createElement("button");


        button.innerText = channel;


        button.onclick = function(){

            addChannel(channel);

        };


        box.appendChild(button);


    });

}






function addChannel(channel){


    // создаем дату только при первом канале
if(data.items.length===0){

    let now=new Date();

    data.items.push({

        text:"Проверка каналов",

        header:true

    });

    data.items.push({

        text:
        "Дата: "
        +
        now.toLocaleDateString("ru-RU")
        +
        "   Время: "
        +
        now.toLocaleTimeString(
            "ru-RU",
            {
                hour:"2-digit",
                minute:"2-digit"
            }
        ),

        header:true

    });

    data.items.push({

        text:"",

        header:true

    });

    
data.date = now.toLocaleDateString("ru-RU"); 
        data.time =
            now.toLocaleTimeString(
                "ru-RU",
                {
                    hour:"2-digit",
                    minute:"2-digit"
                }
            );


    }



    data.items.push({

        text: channel

    });



    save();


    showInfo();

    showReport();


}







function addComment(){

    

    let modal =
        document.getElementById("commentModal");
document.getElementById(
        "commentText"
    ).value = "";
    
    document.getElementById(
        "commentModal"
    ).style.display = "flex";
    

}




function saveComment(){

 let comment =
        document.getElementById(
            "commentText"
        ).value;
    
    if(data.items.length===0){

    let now=new Date();

    data.items.push({

        text:"Проверка каналов",

        header:true

    });

    data.items.push({

        text:
        "Дата: "
        +
        now.toLocaleDateString("ru-RU")
        +
        "   Время: "
        +
        now.toLocaleTimeString(
            "ru-RU",
            {
                hour:"2-digit",
                minute:"2-digit"
            }
        ),

        header:true

    });

    data.items.push({

        text:"",

        header:true

    });

    }
   



if(selectedIndex!=-1){

    data.items[selectedIndex].text=
    comment;

    selectedIndex=-1;

}
else{

    data.items.push({

        text:comment

    });

}

    


    save();


    showReport();


    closeModal();



}

function saveEmptyLine(){

    data.items.push({

        text: ""

    });

    save();

    showReport();

    closeModal();

}





function closeModal(){


    document.getElementById(
        "commentModal"
    ).style.display = "none";


}





function showInfo(){


    let box =
        document.getElementById(
            "checkInfo"
        );




}




function save(){


    localStorage.setItem(

        "tvData",

        JSON.stringify(data)

    );


}



function showReport(){



   
    let box =
        document.getElementById(
            "report"
        );

    box.innerHTML = "";

    data.items.forEach((item,index)=>{
        let div =
            document.createElement(
                "div"
            );
div.onclick = function(){
    if(item.header){
        return;
    }
    selectedIndex = index;
    showReport();  // оставляем, если нужно обновить выделение
};
        
        div.className =
            "report-item";
              if(index===selectedIndex){

    div.classList.add("selected");

}

        div.innerText =
            item.text;

        box.appendChild(div);
      });
    

    // Прокрутить к последней строке
    let last = box.lastElementChild;

    if(last){

        last.scrollIntoView({
            behavior:"smooth",
            block:"end"
        });

    }
let btn=document.getElementById(
"editDeleteBtn"
);

btn.disabled=
selectedIndex==-1;
}




function showDeleteDialog(){

    if(selectedIndex==-1){

        return;

    }

    document.getElementById(
    "deleteModal"
    ).style.display="block";

}



function closeDeleteModal(){

    document.getElementById(
    "deleteModal"
    ).style.display="none";

}


function deleteSelected(){

    if(selectedIndex==-1){

        return;

    }

    if(confirm("Удалить строку?")){

        data.items.splice(selectedIndex,1);

        selectedIndex=-1;

        save();

        showReport();

        showInfo();

    }

    closeDeleteModal();

}


function editSelected(){

    document.getElementById(
    "commentText"
    ).value=
    data.items[selectedIndex].text;

document.getElementById(
        "emptyLineBtn"
    ).style.display = "none";

    closeDeleteModal();

    document.getElementById(
        "commentModal"
    ).style.display = "flex";



    addComment();

}







    


    

function copyReport(){


    let text =

`
Отчёт по ТВ
Дата:
${data.date}
Время:
${data.time}

`;



    data.items.forEach(item => {


        text += item.text + "\n";


    });



    navigator.clipboard.writeText(text);



    alert(
        "Отчет скопирован"
    );


}








function clearReport(){



    if(confirm(
        "Очистить список?"
    )){


        data = {

            date:"",
            time:"",
            items:[]

        };



        save();


        showInfo();

        showReport();


    }


}






load();
