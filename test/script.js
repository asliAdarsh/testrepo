document.getElementById('imageForm').addEventListener('submit', async function(event) {
    event.preventDefault();  // Prevent the form from submitting

    const imageInput = document.getElementById('imageInput');
    const titleElement = document.getElementById('title');
    const descriptionElement = document.getElementById('description');
    const imageDisplay = document.getElementById('imageDisplay');

    // Check if a file is selected
    if (imageInput.files.length === 0) {
        alert("Please select an image file.");
        return;
    }

    const imageFile = imageInput.files[0];
    const fileReader = new FileReader();


    fileReader.onload = async function(event) {
        let imageBase64 = event.target.result;
        imageDisplay.src = imageBase64;
        imageDisplay.classList.remove('hidden');
    

        // Remove the prefix 'data:image/jpeg;base64,' (or similar)
        imageBase64 = imageBase64.replace(/^data:image\/(jpeg|png|gif);base64,/, '');

        const query = "Tell me about the given picture. DO GIVE ME ONLY IN GIVEN FORMAT" +
        " '{\n  \"title\": \"\"\n,  \"description\": \"\"\n} ' START YOUR RESPONSE WITH { AND END WITH }. Example:-  If a car is there then your response should be '{\n  \"title\": \"A beautiful looking car.\"\n, \"description\": \"This look like a beautiful car of ford company.\"\n} '.I am fetching title and description in frontend so make it easier to get. ALSO MUST GIVE TITLE and DESCRIPTION. Make sure not to use extra backslashes. DO NOT USE BACKTICKS OR MARKDOWN FORMATTING. DO NOT USE '``` or json' IN THE STARTING AND ENDING OF THE RESPONSE. "

        try {
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "model": "llava",
                    "prompt": query,
                    "stream": false,
                    "images": [imageBase64]  // Pass the cleaned base64 string
                })
            });
            // Check if the response is ok
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const res = await response.json();
            console.log("2314",res); 
            
            // const respString = JSON.stringify(res.response).trim()

            // const respN = JSON.parse(respString);

            // const resp = JSON.parse(respN)

            let resp;
            if (typeof res.response === 'string') {
                resp = JSON.parse(res.response);
            } else {
                resp = res.response; // Assuming it's already an object
            }


            console.log("11111",typeof(resp));
            console.log("2222",resp.title);
            console.log("3333",resp.description);



            // Assuming the response structure is correct
            titleElement.innerText = resp.title || "No title generated";
            descriptionElement.innerText = resp.description || "No description generated";

        } catch (error) {
            console.error('Error:', error);
            titleElement.innerText = "Error generating title";
            descriptionElement.innerText = "Error generating description";
        }
    };

    fileReader.readAsDataURL(imageFile);
});
