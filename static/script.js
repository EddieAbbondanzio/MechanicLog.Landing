(function () {
    let sendButton   = document.getElementById('button-send');
    let emailTextbox = document.getElementById('textbox-email');
    let successMsg   = document.getElementById('good-message');
    let errorMsg     = document.getElementById('bad-message');

    //Prepare the send button
    sendButton.addEventListener('click', sendRequest);

    /**
     * Send a subscribe request to the server
     */
    function sendRequest() {
        let httpRequest = new XMLHttpRequest();

        //Does it an email address in it?
        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailTextbox.value)) {
            alert('Please enter a valid email.')
            return;
        }

        httpRequest.open('POST', 'http://mechaniclog.net/subscribe', true);
        httpRequest.setRequestHeader('Content-Type', 'application/json');

        httpRequest.send(JSON.stringify({
            email: emailTextbox.value
        }));

        //Listen for a response
        httpRequest.onload = function () {
            if (this.status == 200) {
                successMsg.className = 'row';
                errorMsg.className   = 'row d-none';
            }
            else {
                successMsg.className = 'row d-none';
                errorMsg.className   = 'row';
            }

            document.getElementById('input-row').className ='row d-none';
        };
    }
})();