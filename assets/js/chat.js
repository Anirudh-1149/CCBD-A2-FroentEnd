window.addEventListener("load", ()=>{
  const input = document.getElementById("upload");

  input.addEventListener("change",  (e)=>{
    let fileName = e.target.files[0].name;
    console.log(fileName);
  })

  document.getElementById('upload-file-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var fileInput = document.getElementById('upload');
    var file = fileInput.files[0];

    var customLabels = document.getElementById('customLabel').value;
    var labels = customLabels.split(/\,| /).join(',');
    let additionParameters = {
      headers:{
        'Content-Type': file.type , 
        "X-Api-Key":"SelkfDnPdb3D3MQUNsQH67UxjnLiDiiKabf2ISTI", 
        'X-Amz-Meta-CustomLabels': labels
      }
    };
    var apiEndpoint = "https://bkqzqjw7sc.execute-api.us-east-1.amazonaws.com/Api2Stage1/upload/pawa-b2-ccbd/" + file.name;
    axios.put(apiEndpoint,file,additionParameters).then(response=>{
      console.log(response)
  })
  });

  document.getElementById('textSerachButton').addEventListener('click', function(){
    window.SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new window.SpeechRecognition();
    recognition.interimResults = true;
    recognition.addEventListener('result', (e)=>{
      const text = Array.from(e.results)
      .map(result=>result[0])
      .map(result=>result.transcript)
      .join('');
      console.log(e.results);
      console.log(text)
      document.getElementById('textSearch').innerHTML = text;
    })
    recognition.start();
  })

  document.getElementById('search-image-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const container = document.getElementById('imageContainer');
    container.innerHTML = '';
    var userInput = document.getElementById('textSearch').value
    if(userInput){
      var additionalParams = {
        headers : {
          'Accept' : '*'
        }
      }
      var params ={'q': userInput};
      sdk.searchGet(params,{}, additionalParams).then((response) => {
        console.log(response)
        var images = response['data'];
        const container = document.getElementById('imageContainer');
        images.forEach(image => {
          const img = new Image();
          var imageParts = image['name'].split('.');
          var imageType = imageParts[imageParts.length-1];
          img.src = `data:image/${imageType};base64,${image['data']}`;
          console.log(img.src)
          container.appendChild(img);
        });
      }).catch((error) =>{
        console.log('an error occurred', error);
      });
    }
  });
})
