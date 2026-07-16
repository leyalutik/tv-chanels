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

    if(data.items.length === 0){


        let now = new Date();


        data.date =
            now.toLocaleDateString("ru-RU");


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


    document.getElementById(
        "commentModal"
    ).style.display = "block";


    document.getElementById(
        "commentText"
    ).value = "";


}







function saveComment(){


    let comment =
        document.getElementById(
            "commentText"
        ).value;



    data.items.push({

        text: comment

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


    box.innerHTML =
    `
    <b>Отчет по ТВ </b><br>
    <b>Дата:</b> ${data.date || "-"}<br>
    <b>Время:</b> ${data.time || "-"}
    `;


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



    data.items.forEach(item => {


        let div =
            document.createElement(
                "div"
            );


        div.className =
            "report-item";


        div.innerText =
            item.text;


        box.appendChild(div);


    });



    // автоматическая прокрутка вниз
    box.scrollTop = box.scrollHeight;


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
