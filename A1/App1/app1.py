from flask import Flask
from flask import request
import requests
import json
import os

app = Flask(__name__)

@app.route('/calculate', methods=['POST'])
def hello():
    
    # Get the data from the API
    data = request.get_json()

    # Getting the filename
    filename = data["file"]

    status = 1

    # Validating the JSON to ensure the file name was provided
    # If the file parameter is null, return the invalid JSON input result
    if filename == "":
        status = 0
        data["file"] = None
        error = "Invalid JSON input."

    # Verify that the file exists
    # If it does not, then return file not found error message

    else:
        filepath = "/app/data/" + filename
        print(filepath)
        if os.path.exists(filepath): 
            error = "No error. File found in the directory."
        else:
            status = 0
            error = "File not found."
        
    # Generating the response to be returned 
    response = {
        "file" : data["file"],
        "error": error 
    }

    # Send the json data to the app2.py
    if(status == 1):
        responseApp2 = requests.post('http://10.5.0.6:4000/process_json_data', headers={'Content-type': 'application/json'}, data=json.dumps(data))

        # print("type of responseApp2 in app1.py")
        # print(type(responseApp2))

        # Converting the requests.models.response class to json format 
        # https://stackoverflow.com/questions/25016301/class-requests-models-response-to-json
        responseApp2 = responseApp2.json()
        return json.dumps(responseApp2)
    else:
        # print(type(response))
        # print(type(json.dumps(response)))
        return json.dumps(response)

    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000, debug=True)

