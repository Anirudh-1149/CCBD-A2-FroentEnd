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
    // print(file)
    console.log(file)
    if (file) {
      var reader = new FileReader();
      console.log('test')
      reader.onload = function() {
          // var data = reader.result.split(',')[1]
          // console.log(data)
          // var base64_decoded = atob(data)
          // console.log(base64_decoded)
          // var base64_encoded = btoa(data)
          // console.log(base64_encoded)
          // var base64_decodedutf8Encoded = encodeURI(base64_decoded)
          // console.log(base64_decodedutf8Encoded)
          // var base64_encodedutf8Decoded = encodeURI(base64_encoded)
          const arrayBuffer = reader.result;
          console.log(arrayBuffer)
          // const byteArray = new Uint8Array(arrayBuffer);
          // // Convert the byte array to hexadecimal string
          // console.log(byteArray)
          // var hexString = Array.from(byteArray, byte => `\\x${byte.toString(16).padStart(2, '0')}`).join('');
          // hexString = 'b\'' + hexString + '\''
          // console.log(hexString);
          // console.log(base64_encodedutf8Decoded)
          var customLabels = document.getElementById('customLabel').value;
          var labels = customLabels.split(/\,| /).join(',');
          var params = {'bucket': 'pawa-b2-ccbd', 'filename': file.name.replace(/\s/g, ''), 'x-amz-meta-customLabels': labels};
          file.constructor=()=>file;
          var body = file;
          var additionalParams = {
            headers :{
              'Content-Type': 'image/jpeg'
            }
          }
          sdk.uploadBucketFilenamePut(params, body,additionalParams).then((response) => {
            console.log(response)
          }).catch((error) => {
            console.log('an error occurred', error);
          });
      }
      reader.readAsBinaryString(file)

      // console.log(file)
      // file.constructor=()=>file;
      // console.log(file)
      // var customLabels = document.getElementById('customLabel').value;
      // var labels = customLabels.split(/\,| /).join(',');
      // var params = {'bucket': 'pawa-b2-ccbd', 'filename': file.name.replace(/\s/g, ''), 'x-amz-meta-customLabels': labels};
      // var body = {'src' : file};
      // var additionalParams = {
      //   headers :{
      //     'Content-Type': 'image/jpeg'
      //   }
      // }
      // sdk.uploadBucketFilenamePut(params, body,additionalParams).then((response) => {
      //   console.log(response)
      // }).catch((error) => {
      //   console.log('an error occurred', error);
      // });
    }
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
    console.log('here1')
    const container = document.getElementById('imageContainer');
    container.innerHTML = '';
    var userInput = document.getElementById('textSearch').value
    if(userInput){
      console.log('here2')
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
