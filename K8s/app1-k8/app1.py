from flask import Flask
from flask import request
import requests
import json
import os

app = Flask(__name__)


@app.route("/store-file", methods=["POST"])
def store_file():
    # JSON data from the request
    json_data = request.get_json()
    app.logger.info(json_data)
    try:
        # Getting the file name from the request
        file_name = json_data["file"]
        file_data = json_data["data"]
        app.logger.info(file_name)

        # Check if the required fields are present in the JSON data
        if file_name == "" or file_name == None or file_data == None:
            error = "Invalid JSON input."
            response = {"file": None, "error": error}
            return json.dumps(response)

        # Store the file data to the GKE persistent storage
        try:
            # Here is where our file is going to be stored.
            file_path = f"/AlmasfizaAnwarHussain_PV_dir/{file_name}"
            with open(file_path, "w") as file:
                file.write(file_data)

            # Return a success message for the file being saved.
            return json.dumps({"file": file_name, "message": "Success."}), 200

        except Exception:
            # Return an error message if there was an issue storing the file
            return (
                json.dumps(
                    {
                        "file": file_name,
                        "error": "Error while storing the file to the storage.",
                    }
                ),
                500,
            )
    except Exception:
        error = "Invalid JSON input."
        response = {"file": None, "error": error}
        return json.dumps(response)


@app.route("/calculate", methods=["POST"])
def hello():
    # Get the data from the API
    data = request.get_json()
    app.logger.info(data)

    # Getting the filename
    filename = data["file"]
    status = 1

    # Validating the JSON to ensure the file name was provided
    # If the file parameter is null, return the invalid JSON input result
    if filename == "" or filename == None:
        status = 0
        data["file"] = None
        error = "Invalid JSON input."
        response = {"file": None, "error": error}
        return json.dumps(response)

    # Verify that the file exists
    # If it does not, then return file not found error message
    else:
        filepath = "/AlmasfizaAnwarHussain_PV_dir/" + filename
        print(filepath)
        if os.path.exists(filepath):
            error = "No error. File found in the directory."
        else:
            status = 0
            error = "File not found."

    # Generating the response to be returned
    response = {"file": data["file"], "error": error}

    # Send the json data to the app2.py
    if status == 1:
        # Construct the URL using the Service DNS name
        service_dns_name = "app2-service.default.svc.cluster.local"
        service_url = f"http://{service_dns_name}:4000/process_json_data"
        responseApp2 = requests.post(
            service_url,
            headers={"Content-type": "application/json"},
            data=json.dumps(data),
        )

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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6000, debug=True)
