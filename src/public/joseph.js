import './bootstrap';


document.addEventListener('DOMContentLoaded', function(){
    let button1 = document.getElementById('finished_button');
    let button2 = document.getElementById('upcomming_button');
    let content1 = document.getElementById('finished_content');
    let content2 = document.getElementById('upcomming_content');

    if(button1 && button2){
        button1.addEventListener('click', function(){
            button1.classList.add('selected_status');
            button2.classList.remove('selected_status');
            content1.classList.remove('hidden');
            content2.classList.add('hidden');
        });

        
        button2.addEventListener('click', function(){
            button1.classList.remove('selected_status');
            button2.classList.add('selected_status');
            content1.classList.add('hidden');
            content2.classList.remove('hidden');
        });
    }

});
