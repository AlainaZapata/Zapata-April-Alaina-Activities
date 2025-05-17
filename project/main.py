from flask import Flask, jsonify, request, render_template, redirect, url_for, session
from flask_mysqldb import MySQL
import hashlib

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Required for session handling

# MySQL Config
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'alaina'

mysql = MySQL(app)

# Password salt
SALT = "lateg"

# Routes
@app.route('/')
def login_page():
    if 'username' in session:
        return redirect(url_for('inventory')) 
    return render_template('login.html')


@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        return redirect(url_for('login_page'))
    return redirect(url_for('inventory'))  


@app.route('/inventory')
def inventory():
    if 'username' not in session:
        return redirect(url_for('login_page'))  
    return render_template('inventory.html')  


@app.route('/register')
def register_page():
    return render_template('register.html')


# User Login
@app.route('/check_user', methods=['POST'])
def check_user():
    try:
        username = request.form['username']
        password = request.form['password']

        salted = (SALT + password).encode('utf-8')
        hash_password = hashlib.sha512(salted).hexdigest()

        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM users WHERE username=%s AND password=%s", (username, hash_password))
        user = cur.fetchone()
        cur.close()

        if user:
            session['username'] = username
            return redirect(url_for('inventory'))  
        else:
            # This is the key change: redirect with ?error=1
            return redirect(url_for('login_page', error=1))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# User Logout
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return redirect(url_for('login_page'))  


# Product Management APIs
@app.route('/api/products', methods=['GET', 'POST'])
def manage_products():
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    if request.method == 'POST':
        # Adding a product
        try:
            data = request.get_json()
            name = data.get('name')
            price = data.get('price')
            quantity = data.get('quantity', 0)
            category = data.get('category')

            if not name or price is None or not category:
                return jsonify({'error': 'Name, price, and category are required'}), 400

            created_by = session['username']  

            cursor = mysql.connection.cursor()
            cursor.execute("INSERT INTO products (name, price, quantity, category, created_by) VALUES (%s, %s, %s, %s, %s)",
                           (name, price, quantity, category, created_by))
            mysql.connection.commit()
            cursor.close()

            return jsonify({'message': 'Product added successfully'}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    elif request.method == 'GET':
        # Getting products with optional category filter
        category = request.args.get('category')  

        try:
            cursor = mysql.connection.cursor()
            if category:
                cursor.execute("SELECT id, name, price, quantity, category, created_by FROM products WHERE category = %s", (category,))
            else:
                cursor.execute("SELECT id, name, price, quantity, category, created_by FROM products")
            products = cursor.fetchall()
            cursor.close()

            product_list = [{'id': row[0], 'name': row[1], 'price': row[2], 'quantity': row[3], 'category': row[4], 'created_by': row[5]} for row in products]
            return jsonify(product_list)
        except Exception as e:
            return jsonify({'error': str(e)}), 500


@app.route('/api/products/<int:product_id>', methods=['GET', 'PUT', 'DELETE'])
def modify_product(product_id):
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    # Get Product by ID
    if request.method == 'GET':
        try:
            cursor = mysql.connection.cursor()
            cursor.execute("SELECT id, name, price, quantity, category, created_by FROM products WHERE id = %s", (product_id,))
            product = cursor.fetchone()
            cursor.close()

            if product:
                return jsonify({'id': product[0], 'name': product[1], 'price': product[2], 'quantity': product[3], 'category': product[4], 'created_by': product[5]})
            else:
                return jsonify({'error': 'Product not found'}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # Update Product
    if request.method == 'PUT':
        data = request.get_json()
        name = data.get('name')
        price = data.get('price')
        quantity = data.get('quantity', 0)
        category = data.get('category')

        if not name or price is None or not category:
            return jsonify({'error': 'Name, price, and category are required'}), 400

        try:
            cursor = mysql.connection.cursor()
            cursor.execute("UPDATE products SET name = %s, price = %s, quantity = %s, category = %s WHERE id = %s", 
                           (name, price, quantity, category, product_id))
            mysql.connection.commit()
            cursor.close()
            return jsonify({'message': 'Product updated successfully'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # Delete Product
    if request.method == 'DELETE':
        try:
            cursor = mysql.connection.cursor()
            cursor.execute("DELETE FROM products WHERE id = %s", (product_id,))
            mysql.connection.commit()
            cursor.close()
            return jsonify({'message': 'Product deleted successfully'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
