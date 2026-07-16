// список каналов

const channels = [

    "Первый",
    "Россия 1",
    "Россия 24",
    "НТВ",
    "СТС",
    "ТНТ",
    "РЕН ТВ",
    "ТВ3",
    "Домашний"

];


// выбранный канал

let selectedChannel = "";


// загрузка сохраненных данных

let report = JSON.parse(
    localStorage.getItem("tvReport")
) || [];



// создание кнопок

function createChannels(){

    const box =
    document.getElementById("channels");


    channels.forEach(channel=>{


        let button =
        document.createElement("button");


        button.innerText = channel;


        button.onclick = ()=>{

            openComment(channel);

        };


        box.appendChild(button);


    });

}



// открыть окно

function openComment(channel){

    selectedChannel = channel;


    document.getElementById(
        "modalTitle"
    ).innerText =
    channel;


    document.getElementById(
        "comment"
    ).value="";


    document.getElementById(
        "modal"
    ).style.display="block";


}



// сохранить с комментарием

function saveChannel(){


    let text =
    document.getElementById(
        "comment"
    ).value.trim();



    addToReport(
        selectedChannel,
        text
    );


    closeModal();

}



// пропустить комментарий

function skipComment(){


    addToReport(
        selectedChannel,
        ""
    );


    closeModal();

}



// добавить запись

function addToReport(channel,comment){


    report.push({

        channel:channel,

        comment:comment

    });



    save();


    showReport();

}



// показать список

function showReport(){


    let box =
    document.getElementById(
        "report"
    );


    box.innerHTML="";


    report.forEach(item=>{


        let div =
        document.createElement(
            "div"
        );


        div.className="report-item";


        div.innerHTML =
        "<b>"
        + item.channel
        +"</b><br>"
        +
        (
        item.comment
        ?
        "Комментарий: "
        +item.comment
        :
        ""
        );


        box.appendChild(div);


    });


}



// закрыть окно

function closeModal(){

    document.getElementById(
        "modal"
    ).style.display="none";

}



// сохранить

function save(){

    localStorage.setItem(

        "tvReport",

        JSON.stringify(report)

    );

}



// копировать

function copyReport(){


    let text="";


    report.forEach(item=>{


        text += item.channel;


        if(item.comment){

            text +=
            "\nКомментарий: "
            +item.comment;

        }


        text += "\n\n";


    });



    navigator.clipboard.writeText(text);


    alert(
        "Скопировано"
    );

}



// очистка

function clearReport(){


    if(
        confirm(
        "Очистить весь список?"
        )
    ){

        report=[];

        save();

        showReport();

    }

}



// запуск

createChannels();

showReport();
