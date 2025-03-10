# MongoDB Setup
client = MongoClient("your_mongo_connection_string")
db = client["your_database_name"]
unrecognized_faces_collection = db["unrecognized_faces"]

def save_unrecognized_face_to_mongo(face_image):
    """Save unrecognized face image to MongoDB."""
    _, buffer = cv2.imencode('.jpg', face_image)
    face_base64 = base64.b64encode(buffer).decode('utf-8')

    unrecognized_faces_collection.insert_one({
        "image": face_base64,
        "captured_at": datetime.now(),
    })
    print("Unrecognized face saved to database.")

# After recognition happens
def send_recognition_to_backend(customer_id):
    url = "http://localhost:8000/api/customers/update-status"  # Adjust port accordingly
    payload = {
        "customerId": customer_id
    }
    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(url, json=payload, headers=headers)
        print("Backend Response:", response.json())
    except Exception as e:
        print("Error sending recognition to backend:", e)

def process_live_feed():
    cap = cv2.VideoCapture(CAMERA_ID)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        try:
            # Face Recognition
            predictions = DeepFace.find(img_path=frame, db_path=DB_PATH, model_name="Facenet512")

            if not predictions[0].empty and predictions[0].distance[0] < 0.3:
                # Recognized Face
                identity = predictions[0].identity[0].split("\\")[-1]
                print(f"Recognized: {identity} (Distance: {predictions[0].distance[0]:.2f})")
            else:
                # Unrecognized Face
                print("Unrecognized face detected.")
                save_unrecognized_face_to_mongo(frame)

        except Exception as e:
            print(f"Error during recognition: {e}")

        # Display live feed (optional)
        cv2.imshow("Live Feed", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()