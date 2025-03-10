# from flask import Flask, request, jsonify
# import requests

# import cv2
# import numpy as np
# import base64
# from deepface import DeepFace
# import os
# from datetime import *

# from flask_cors import CORS


# app = Flask(__name__)
# CORS(app)

# @app.route('/')
# def home():
#     return ''


# @app.route('/predict', methods=['GET', 'POST'])
# def upload_image():
#     if request.method == 'POST':
#         data = request.json
#         img_data = data['image'].split(',')[1]
#         nparr = np.frombuffer(base64.b64decode(img_data), np.uint8)
#         img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        
#         predictions = DeepFace.find(img_path=img, db_path="trainss", model_name="Facenet512")

        
            
#         #face = DeepFace.analyze(img, ['emotion'])
#         print(predictions[0],"asd")
#         if not predictions[0].empty and predictions[0].distance[0] < 0.3:
#             identity = predictions[0].identity[0].split("\\")[1]
            

#             #print(identity)
#             datas=requests.get(f"http://localhost:8000/api/customers/{identity}",
#                            headers={"Content-Type": "application/json"},)
                
            
#             response_data = datas.json()
#         return jsonify(response_data)
               

# @app.route('/new_user', methods=['POST'])
# def newuser():
#     if request.method == 'POST':
#         data = request.get_json()
#         name = data['name']
#         photos = data['photos']
#         phone = data['phone']

#         payload = {
#             "name": name,
#             "phone": phone,
            
#         }

#         datas=requests.post("http://localhost:8000/api/customers/create", json=payload, 
#                            headers={"Content-Type": "application/json"},)
#         print(datas.json())
#         response_data = datas.json()
#         user_id = response_data.get('_id')
#         print(user_id)

#         user_dir = os.path.join("trainss", str(user_id))
#         os.makedirs(user_dir, exist_ok=True) 
#         for i, photo in enumerate(photos):
#             photo_data = base64.b64decode(photo.split(',')[1])
#             print(i)
#             with open(os.path.join(user_dir, f'photo_{i+1}.jpg'), 'wb') as f:
#                 f.write(photo_data)
#         return jsonify({'status': 'success', 'message': 'User data saved.'})

# TRAINSS_FOLDER = "trainss"


# if __name__ == '__main__':
#     app.run()


from flask import Flask, request, jsonify, send_from_directory
import requests
import numpy as np
import cv2
from deepface import DeepFace
from pymongo import MongoClient
import base64
from datetime import datetime
from flask_cors import CORS
import os 

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Flask is running."

# Serve static files from the "trainss" directory
@app.route('/trainss/<user_id>/<filename>')
def serve_image(user_id, filename):
    # Construct the absolute path to "trainss"
    trainss_dir = os.path.join(os.path.dirname(__file__), '..', 'trainss')
    return send_from_directory(os.path.join(trainss_dir, user_id), filename)

DB_PATH = "trainss"

@app.route('/predict', methods=['GET', 'POST'])
def upload_image():
    if request.method == 'POST':
        data = request.json
        img_data = data['image'].split(',')[1]
        nparr = np.frombuffer(base64.b64decode(img_data), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    try:    
        predictions = DeepFace.find(img_path=img, db_path="trainss", model_name="Facenet512")

        if not predictions[0].empty and predictions[0].distance[0] < 0.3:
            identity = predictions[0].identity[0].split("\\")[1]

            send_recognition_to_backend(customer_id=identity, is_recognised=True)

             # Update visit count in backend
            visit_update_response = requests.put(
            f"http://localhost:8000/api/recognised/update-visit/{identity}",
            headers={"Content-Type": "application/json"})
            

            #print(identity)
            datas=requests.get(f"http://localhost:8000/api/customers/{identity}",
                           headers={"Content-Type": "application/json"},)
                
            
            response_data = datas.json()
            return jsonify(response_data)
    
        else:
            send_recognition_to_backend(customer_id=None, isRecognised=False)
            return jsonify({"message": "No match found"}), 404  # No match found
    except Exception as e:
        print("Error:", e)
        return jsonify({"message": "Error processing image", "error": str(e)}), 500  # Error response


@app.route('/new_user', methods=['POST'])
def newuser():

    try: 
        if request.method == 'POST':   
            data = request.get_json()
            name = data['name']
            phone = data['phone']
            photo = data['photo']  # Single Base64 image

            # Validate inputs
            if not name or not phone or not photo:
                return jsonify({'status': 'error', 'message': 'Name, phone, and photo are required!'}), 400

            # Step 1: Create user in backend
            payload = {"name": name, "phone": phone}
            try:
                response = requests.post(
                "http://localhost:8000/api/customers/create",
                json=payload,
                headers={"Content-Type": "application/json"}
                )
                response.raise_for_status()
                user_id = response.json().get('_id')
                if not user_id:
                    raise ValueError("User ID not returned from backend")
            except Exception as e:
                return ('error', f"Backend request failed: {str(e)}", 500)

                # Create a directory for the user to store the image
                
            user_dir = os.path.join("trainss", str(user_id))
            os.makedirs(user_dir, exist_ok=True)

                # Save the single image locally
            image_data = base64.b64decode(photo.split(',')[1])
            image_path = os.path.join(user_dir, f"{user_id}.jpg")
            with open(image_path, 'wb') as f:
                f.write(image_data)

                # Generate the URL for the saved image
            image_url = f"http://localhost:5000/trainss/{user_id}/{user_id}.jpg"

                # Update backend with the image URL
            payload["img"] = image_url
            update_response = requests.put(
                f"http://localhost:8000/api/customers/{user_id}/update",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            print("Updated Backend Response:", update_response.json())

            return jsonify({'status': 'success', 'message': 'User data saved and image processed.'})

    except Exception as e:
        print("Error:", e)
        return jsonify({"message": "Error processing image", "error": str(e)}), 500


def send_recognition_to_backend(customer_id=None,  is_recognised = False):
    if is_recognised:
        payload = {"customerId": customer_id, "isRecognised": True}
        url = "http://localhost:8000/api/recognised/update-status"
    else:
        payload = { "isRecognised": False}
        url = "http://localhost:8000/api/unrecognised/update-status"

    headers = {"Content-Type": "application/json"}

    try:
        response = requests.put(url, json=payload, headers=headers)
        print("Status Code:", response.status_code)
        print("Response Text:", response.text)
        response.raise_for_status()
    except Exception as e:
        print("Error sending recognition to backend:", e)


if __name__ == "__main__":
    app.run()



