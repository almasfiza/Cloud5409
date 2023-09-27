from flask import Flask
from flask import request
import json
import pymysql


app = Flask(__name__)


# MySQL database configuration
db_config = {
    'user': 'admin',
    'password': 'almasfiza',
    'host': 'aahshaikh-db-instance.cmorsks1yj0b.us-east-1.rds.amazonaws.com',
    'database': 'a3',
    'cursorclass': pymysql.cursors.DictCursor
}

@app.route('/store-products', methods=['POST'])
def store():
    # 1. Retrieve the data from API.
    data = request.get_json()
    products = data["products"]

    # Response
    response = {
        "message": "Success."
    }

    # 2. Store data to RDS.

    try:
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()

        # Prepare SQL statement
        insert_query = "INSERT INTO products (name, price, availability) VALUES (%s, %s, %s)"

        with connection.cursor() as cursor:
            # Iterate through the products list and insert each product into the database
            for product in products:
                name = product['name']
                price = product['price']
                availability = product['availability']
                record = (name, price, availability)
                cursor.execute(insert_query, record)

        # Commit the changes to the database
        connection.commit()

        print("Data written into DB.")
    except Exception as e:
        print("Error occured while writing data into DB:", str(e))
        response = {
            "message": "Failed."
        }
        return json.dumps(response), 500


    # 3. Return a 200 status code with JSON message
    return json.dumps(response), 200


# 4. Rob's app will POST to /list-products route
@app.route('/list-products', methods=['GET'])
def list_products():
    try:
        # Connect to MySQL database
        connection = pymysql.connect(**db_config)

        # Execute the query to display all the data from products
        query = "SELECT DISTINCT name, price, availability FROM products"
        with connection.cursor() as cursor:
            cursor.execute(query)
            result = cursor.fetchall()

        # JSON response to return
        products = []
        for row in result:
            product = {
                "name": row["name"],
                "price": row["price"],
                "availability": bool(row["availability"])
            }
            products.append(product)

        response = {
            "products": products
        }

        # Return the list of products with 200 status code
        return json.dumps(response), 200

    except Exception as e:
        print("Error occurred while querying data from DB:", str(e))
        return "", 500

    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000, debug= True)


