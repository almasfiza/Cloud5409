from flask import Flask 
from flask import request
import json
import csv

app = Flask(__name__)

# Function to  check if the file is in a valid CSV format
def validate_csv_file(file):

    with open(file, 'r') as check_file:
        # Using csv.reader to read csv files in python
        # https://realpython.com/python-csv/
        csv_reader = csv.reader(check_file, delimiter=',')
        headers = next(csv_reader)
        for row in csv_reader:
            if len(row) != len(headers):
                return False
        
        return True
    
def calculate_sum(file, product):
     
     total = 0
     
     with open(file, 'r') as file:
        # Using csv.reader to read csv files in python
        # https://realpython.com/python-csv/
        csv_reader = csv.reader(file, delimiter=',')
        headers = next(csv_reader)
        for row in csv_reader:
            # List indices must be integers or slices hence 
            # row[0] is row["product"]
            # row[1] is row["amount"]
            if row[0] == product:
                val = row[1]
                if val.isdigit():
                    total += int(row[1])
                else:
                    return -1
                
        return total
    

@app.route('/process_json_data', methods=['POST'])
def get_data_from_app1():
    data = request.get_json()
    print(data)

    # Load the file into memory
    file = "/app/data/" + data["file"]
    product = data["product"]

    # load_file = open(file, "r")
    # print(load_file.read())

    # response is what has to be returned to app1.py
    response = {}

    # result stores the sum of the amounts for a product matched
    result = ""
   
    # Parse the CSV and check and return the error if not in CSV format
    if validate_csv_file(file):
        print("Valid CSV file. The format is correct.")
        result = calculate_sum(file, product)
        if result != -1:
            response = {
                "file": data["file"],
                "sum": result
            }
        else:
            error = 'Input file not in CSV format.'
            response = {
                "file": data["file"],
                "error": error
            }

    else:
        error = 'Input file not in CSV format.'
        response = {
            "file": data["file"],
            "error": error
        }
    
    print(response)
    print("type of responseApp2 in app2.py")
    print(type(json.dumps(response)))

    return json.dumps(response)


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=4000, debug=True)