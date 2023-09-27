from flask import Flask
from flask import request
import json
import csv
import os

app = Flask(__name__)


# Function to  check if the file is in a valid CSV format
def validate_csv_file(file):
    # # Returning false if the file is empty
    # if os.stat(file).st_size == 0:
    #     return False
    # Using csv.reader to read csv files in python
    # https://realpython.com/python-csv/
    with open(file, "r") as check_file:
        csv_reader = csv.reader(check_file, delimiter=",", skipinitialspace=True)
        headers = next(csv_reader)
        for row in csv_reader:
            if len(row) != len(headers):
                return False

    return True


def calculate_sum(file, product):
    total = 0
    # random comment to check the CICD
    with open(file, "r") as file:
        # Using csv.reader to read csv files in python
        # https://realpython.com/python-csv/
        csv_reader = csv.reader(file, delimiter=",", skipinitialspace=True)
        headers = next(csv_reader)
        stripped_headers = []
        for header in headers:
            header = header.strip()
            stripped_headers.append(header)
        expected_headers = ["product", "amount"]
        if expected_headers == stripped_headers:
            for row in csv_reader:
                # List indices must be integers or slices hence
                # row[0] is row["product"]
                # row[1] is row["amount"]
                if(row[0] == product):
                    val = row[1]
                    if val:
                        total += int(val)
                
        else:
            return -1

    return total


@app.route("/process_json_data", methods=["POST"])
def get_data_from_app1():
    data = request.get_json()
    app.logger.info(data)
    # Load the file into memory
    file = "/AlmasfizaAnwarHussain_PV_dir/" + data["file"]
    product = data["product"]

    # load_file = open(file, "r")
    # app.logger.info(load_file.read())

    # response is what has to be returned to app1.py
    response = {}

    # result stores the sum of the amounts for a product matched
    result = ""

    # Parse the CSV and check and return the error if not in CSV format
    if validate_csv_file(file):
        app.logger.info("Valid CSV file. The format is correct.")
        result = calculate_sum(file, product)
        app.logger.info("result in main: ", result)
        if result != -1:
            response = {"file": data["file"], "sum": str(result)}
            return json.dumps(response)
        else:
            error = "Input file not in CSV format."
            response = {"file": data["file"], "error": error}
            return json.dumps(response)


    error = "Input file not in CSV format."
    response = {"file": data["file"], "error": error}
    return json.dumps(response)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4000, debug=True)
