// lesson show in UI***
// Lesson show in UI
const lessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(data => lessonsContainer(data.data));
};

const lessonsContainer = (lessonId) => {
    const lessonLoad = document.getElementById("vocabulary-container");
    lessonLoad.innerHTML = "";

    lessonId.forEach(words => {

        const createLesson = document.createElement("div");

        createLesson.innerHTML = `
            <button 
                onclick="wordLoader(${words.level_no}),level(${words.level_no})"
                class="btn colorBtn btn-soft py-4 btn-error">
                <i class="fa-brands fa-leanpub"></i>
                Learn - ${words.lessonName}
            </button>
        `;

        lessonLoad.append(createLesson);


        
    });
    
};

// word reconization:
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

// button works dynamically for onclick handler:

const wordLoader=(levelNo)=>{
    fetch(`https://openapi.programming-hero.com/api/level/${levelNo}`)
    .then(resp=>resp.json())
    .then(dataShow=>wordsDisplay(dataShow.data))
    // console.log(dataShow)
}

const wordsDisplay=(wordCon)=>{
    const wordsContainer=document.getElementById("wordsMeaning-container");
    wordsContainer.innerHTML=``;

// If there is no data available , then we have to apply this:
    if(wordCon.length===0){
        wordsContainer.innerHTML=`
        <div class="bg-gray-300 col-span-full mx-auto rounded-2xl  px-3 py-4">
    <img class="mx-auto py-4" src="./assets/alert-error.png" alt="" srcset="">
    <h1 class="text-shadow-black text-2xl">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।....</h1>
    <br>
    <h1 class="font-extrabold text-red-900 text-center text-xl">নেক্সট Lesson এ যান</h1>
  </div>
        `
    }

    wordCon.forEach(meaning =>{
    
        const createWord=document.createElement("div");
        createWord.innerHTML=`
        <div class="border-0 rounded-2xl bg-gray-100 w-11/12 text-center mr-5 py-7 space-y-3">
        <h2 class="font-extrabold text-4xl mb-3">${meaning.word}</h2>
        <h2 class="text-xl font-normal">meaning/pronunciation</h2>
        
      <h2 class="text-2xl pt-4 text-gray-700">${meaning.pronunciation}</h2>
      <h2 class="pt-3 text-2xl font-black">${meaning.meaning}</h2>

      <div class="flex justify-between gap-6 px-6 py-5">
      
        <i onclick="showModal('${meaning.id}')" class="pt-4 fa-solid fa-circle-question cursor-pointer btn btn-soft"></i>
        <i onclick="pronounceWord ('${meaning.word}')" class="px-5  fa-solid fa-volume-high cursor-pointer btn btn-soft pt-4"></i>
      </div>
      </div>

      

        `
        wordsContainer.append(createWord)
    })


}

// add modal system:

const showModal=(id)=>{
    fetch(`https://openapi.programming-hero.com/api/word/${id}`)
    .then(res=>res.json())
    .then(dataLoad=>modal(dataLoad.data))
}
const modal = (word) => {

    const modalContainer = document.getElementById("showModal");
    modalContainer.innerHTML = "";

    const createModal = document.createElement("div");

    createModal.innerHTML = `
    <div class="modal-box">

        <h3 class="text-2xl font-bold">
            ${word.word} 
            <i class="fa-solid fa-microphone cursor-pointer"></i>
        </h3>

        <p class="py-2"><b>Meaning:</b> ${word.meaning || "Not available"}</p>

       

        <div class="mt-4">
            <h2 class="font-bold">Example</h2>
            <p>${word.sentence || "No example available"}</p>

            <h2 class="font-bold mt-3">Synonyms</h2>
            <p>${word.synonyms?.join(", ") || "No synonyms available"}</p>
        </div>

        <div class="modal-action">
            <form method="dialog">
                <button class="btn">Close</button>
            </form>
        </div>

    </div>
    `;

    modalContainer.append(createModal);
    modalContainer.showModal();
}
lessons();


// search bar system:

document.getElementById("searchBtn").addEventListener("click", function () {

    const input = document.getElementById("levelValue");
    const valueOfSearch = input.value.toLowerCase().trim();
    if(valueOfSearch===""){
        alert("please write something for show vocabulary")
        return
        
    }

    fetch("https://openapi.programming-hero.com/api/words/all")
        .then(res => res.json())
        .then(dataPromise => {
            // console.log(dataPromise)

            const similarWords = dataPromise.data;

            const filterWords = similarWords.filter((word) => {
                return word.word.toLowerCase().includes(valueOfSearch);
            });

          

            wordsDisplay(filterWords);
        
        });
});